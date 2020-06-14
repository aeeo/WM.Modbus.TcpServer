using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using AMWD.Modbus.Common.Util;
using Newtonsoft.Json;
using NLog;
using ServiceStack;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using ServiceStack.Text;
using WG3000.Modbus.TcpServer.Modbus;
using WG3000.Modbus.TcpServer.ServiceModel;

namespace WG3000.Modbus.TcpServer.Helper
{
    public static class ParserHelper
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        public const byte Pack_SYN_A = 0xAA;       //包开始同步字节A
        public const byte Pack_SYN_B = 0XDD;       //包开始同步字节B
        public const byte Pack_SYN_C = 0X55;       //包开始同步字节C

        public const byte Pack_STOP_A = 0xAA;       //包结束同步字节A
        public const byte Pack_STOP_B = 0xEE;       //包结束同步字节B
        public const byte Pack_STOP_C = 0xCC;       //包结束同步字节B

        public const byte MB_FUNC_SLAVE_ERROR = 0xEE;              //上报的紧急错误信息包
        public const byte MB_FUNC_MASTER_TIMESYNC = 0xF0;          //主机返回的时间同步包 160
        public const byte MB_FUNC_MASTER_RESPONSE = 0xF1;          //主机返回的数据响应包
        public const byte MB_FUNC_MASTER_DATAERROR = 0xF2;         //主机返回的数据错误信息包，收到这个包之后要重发数据
        public const byte MB_FUNC_MASTER_WWGCONFIG = 0XF7;         //主机返回的无线功图配置
        public const byte MB_FUNC_SLAVE_RUNSTATE_DATA = 0xF3;      //向主机发送的状态数据包
        public const byte MB_FUNC_SLAVE_WORKGRAPH_DATA = 0xF4;     //向主机发送的功图数据
        public const byte MB_FUNC_SLAVE_REQUEST_CONFIG = 0xF5;     //向主机申请下发网络配置
        public const byte MB_FUNC_SLAVE_REQUEST_WWGCONFIG = 0xF6;  //相主机申请下发无线功图配置
        public const byte MB_FUNC_SLAVE_CONFIG_ACK = 0xE2;         //无线功图配置应答包

        private const byte POS_PACKET_HEAD_LEN = 3;
        private const byte POS_PACKET_DATA_START = 11;

        private static readonly short[] ForceBuffer = new short[] { 4806, 4950, 5105, 5266, 5415, 5535, 5620, 5660, 5666, 5646, 5602, 5555, 5512, 5492, 5497, 5518, 5550, 5579, 5602, 5615, 5609, 5589, 5563, 5531, 5508, 5499, 5504, 5522, 5548, 5570, 5586, 5593, 5588, 5574, 5550, 5526, 5503, 5494, 5497, 5509, 5532, 5554, 5573, 5579, 5577, 5564, 5541, 5518, 5492, 5467, 5453, 5445, 5449, 5454, 5458, 5456, 5444, 5431, 5415, 5396, 5370, 5327, 5257, 5170, 5073, 4975, 4879, 4782, 4695, 4629, 4593, 4586, 4597, 4618, 4639, 4652, 4655, 4642, 4623, 4607, 4598, 4599, 4607, 4619, 4638, 4650, 4662, 4670, 4667, 4664, 4651, 4642, 4634, 4632, 4642, 4652, 4666, 4683, 4696, 4702, 4697, 4673, 4585, 4449, 4290, 4124, 4004, 3909, 3817, 3731, 3664, 3629, 3622, 3634, 3654, 3677, 3696, 3710, 3714, 3715, 3726, 3741, 3772, 3812, 3860, 3916, 3971, 4032, 4105, 4196, 4305, 4426, 4555, 4685, 4823 };
        private static readonly short[] AccBuffer = new short[] { 1234, 1228, 1232, 1218, 1223, 1224, 1219, 1231, 1234, 1226, 1214, 1197, 1191, 1215, 1192, 1199, 1226, 1209, 1206, 1205, 1228, 1207, 1208, 1195, 1192, 1204, 1203, 1190, 1181, 1186, 1188, 1192, 1193, 1191, 1198, 1189, 1183, 1185, 1188, 1180, 1179, 1186, 1180, 1192, 1179, 1184, 1181, 1181, 1175, 1188, 1162, 1177, 1174, 1171, 1166, 1175, 1173, 1169, 1176, 1161, 1171, 1165, 1173, 1164, 1173, 1163, 1165, 1168, 1175, 1170, 1166, 1149, 1180, 1188, 1174, 1169, 1186, 1170, 1210, 1211, 1163, 1144, 1209, 1192, 1167, 1157, 1227, 1211, 1163, 1228, 1221, 1184, 1222, 1226, 1197, 1212, 1220, 1207, 1224, 1216, 1235, 1233, 1223, 1237, 1251, 1242, 1225, 1177, 1253, 1255, 1225, 1225, 1256, 1232, 1250, 1236, 1247, 1241, 1261, 1254, 1229, 1252, 1258, 1240, 1244, 1250, 1241, 1243, 1242, 1244, 1229, 1236, 1232, 1236, 1233 };

        public static void AppendBytes(ref byte[] buffer, byte[] appendBuffer)
        {
            var bufferList = buffer.ToList();
            var appendBufferList = appendBuffer.ToList();

            bufferList.AddRange(appendBufferList);
            buffer = bufferList.ToArray();
        }


        public static void InsertByte(ref byte[] buffer, int index, byte appendBuffer)
        {
            var bufferList = buffer.ToList();

            bufferList.Insert(index, appendBuffer);
            buffer = bufferList.ToArray();
        }


        public static void AppendByte(ref byte[] buffer, byte appendBuffer)
        {
            var bufferList = buffer.ToList();
            var tempList = new List<byte>() { appendBuffer };

            bufferList.AddRange(tempList);
            buffer = bufferList.ToArray();
        }

        //public static void PaddingPacket(ref byte[] buffer)
        //{
        //    var bufferList = buffer.ToList();
        //    var tempList = new List<byte>();

        //    foreach (var item in bufferList)
        //    {
        //        tempList.Add(item);
        //        if (item == Pack_SYN_A)
        //        {
        //            tempList.Add((byte)Pack_Padding);
        //        }
        //    }
        //    buffer = tempList.ToArray();
        //}

        /*
	        功能： 添加一个8位数据到缓冲区
	        参数：
	        返回值：
        */
        public static UInt32 AppendUInt8Data(ref byte[] buffer, UInt32 bufferLength, byte u8Data)
        {
            var ktls = buffer.ToList();
            ktls.AddRange(BytesConvertHelper.ConvertUInt8ToByteArray(u8Data));
            buffer = ktls.ToArray();

            return 1;
        }


        /*
            功能： 添加一个16位数据到缓冲区
            参数：
            返回值：
        */
        public static UInt32 AppendUInt16Data(ref byte[] buffer, UInt32 bufferLength, UInt16 u16Data)
        {
            var ktls = buffer.ToList();
            ktls.AddRange(BytesConvertHelper.ConvertUInt16ToByteArray(u16Data));
            buffer = ktls.ToArray();

            return 2;
        }


        public static UInt32 AppendInt16Data(ref byte[] buffer, UInt32 bufferLength, Int16 s16Data)
        {
            var ktls = buffer.ToList();
            ktls.AddRange(BytesConvertHelper.ConvertInt16ToByteArray(s16Data));
            buffer = ktls.ToArray();

            return 2;
        }


        /*
            功能： 添加一个32位数据到缓冲区
            参数：
            返回值：
        */
        public static UInt32 AppendUInt32Data(ref byte[] buffer, UInt32 bufferLength, UInt32 u32Data)
        {
            var ktls = buffer.ToList();
            ktls.AddRange(BytesConvertHelper.ConvertUInt32ToByteArray(u32Data));
            buffer = ktls.ToArray();

            return 4;
        }

        /*
            功能： 添加一个64位数据到缓冲区
            参数：
            返回值：
        */
        public static UInt32 AppendUInt64Data(ref byte[] buffer, UInt32 bufferLength, UInt64 u64Data)
        {
            var ktls = buffer.ToList();
            ktls.AddRange(BytesConvertHelper.ConvertIntToByteArray(u64Data));
            buffer = ktls.ToArray();

            return 8;
        }

        /*
            功能： 添加一个流数据到缓冲区
            参数：
            返回值：
        */
        public static UInt32 AppendStreamData(ref byte[] buffer, UInt32 bufferLength, byte[] payload, UInt32 dataLength)
        {
            var ktls = buffer.ToList();
            ktls.AddRange(payload.ToList());
            buffer = ktls.ToArray();

            return dataLength;
        }


        public static byte[] PacketTestWorkGraphDataPackage(byte slaveId)
        {
            const byte periodPointCount = 135;

            var buffer = new byte[0];

            // Zigbee短地址，即Modbus设备地址
            AppendByte(ref buffer, slaveId);
            //功能码
            AppendByte(ref buffer, MB_FUNC_SLAVE_WORKGRAPH_DATA);
            //RTU设备编号
            AppendBytes(ref buffer, BytesConvertHelper.ConvertInt32ToByteArray(0x13FFFF00 + slaveId));
            //长度，先占位，后面填充
            AppendBytes(ref buffer, BytesConvertHelper.ConvertInt16ToByteArray(11 + 135 * 4));
            //采样点数 PointCount
            AppendByte(ref buffer, periodPointCount);
            //采样间隔 SampleInterval*100
            AppendBytes(ref buffer, BytesConvertHelper.ConvertInt16ToByteArray((short)(1562)));

            ////以下为数据部分
            //////////////////////////////////////////////////////////////////
            //以数据填充开始
            //////////////////////////////////////////////////////////////////

            for (var i = 0; i < periodPointCount; i++)
            {
                AppendBytes(ref buffer, BytesConvertHelper.ConvertInt16ToByteArray(ForceBuffer[i]));
            }
            for (var i = 0; i < periodPointCount; i++)
            {
                AppendBytes(ref buffer, BytesConvertHelper.ConvertInt16ToByteArray(ForceBuffer[i]));
            }

            //////////////////////////////////////////////////////////////////
            //数据填充结束
            //////////////////////////////////////////////////////////////////

            ////数据部分结束

            ////以下为包尾固定部分
            //计算并保存CRC
            AppendBytes(ref buffer, buffer.CRC16());

            //包头标志
            InsertByte(ref buffer, 0, Pack_SYN_C);
            InsertByte(ref buffer, 0, Pack_SYN_B);
            InsertByte(ref buffer, 0, Pack_SYN_A);

            //包尾标志
            AppendByte(ref buffer, Pack_STOP_A);
            AppendByte(ref buffer, Pack_STOP_B);
            AppendByte(ref buffer, Pack_STOP_C);

            return buffer;
        }

        ///	生成时间同步包
        public static byte[] PacketTimeSyncPackage(byte slaveId, ushort refStrokeFrequency, ushort refStrokeLength)
        {
            var buffer = new byte[0];

            // Zigbee短地址，即Modbus设备地址
            AppendByte(ref buffer, slaveId);
            //功能码
            AppendByte(ref buffer, MB_FUNC_MASTER_TIMESYNC);

            var dt = DateTime.Now;
            AppendBytes(ref buffer, BytesConvertHelper.ConvertUInt16ToByteArray((ushort)dt.Year));
            AppendByte(ref buffer, (byte)dt.Month);
            AppendByte(ref buffer, (byte)dt.Day);
            AppendByte(ref buffer, (byte)dt.Hour);
            AppendByte(ref buffer, (byte)dt.Minute);
            AppendByte(ref buffer, (byte)dt.Second);

            //是否下发了新的冲次和冲程
            AppendByte(ref buffer, 1);
            //参考冲次
            AppendBytes(ref buffer, BytesConvertHelper.ConvertUInt16ToByteArray(refStrokeFrequency));
            //参考冲程
            AppendBytes(ref buffer, BytesConvertHelper.ConvertUInt16ToByteArray(refStrokeLength));

            //计算并保存CRC
            AppendBytes(ref buffer, BitConverter.IsLittleEndian ? buffer.CRC16() : buffer.CRC16().Reverse().ToArray());

            //包头标志
            InsertByte(ref buffer, 0, Pack_SYN_C);
            InsertByte(ref buffer, 0, Pack_SYN_B);
            InsertByte(ref buffer, 0, Pack_SYN_A);

            //包尾标志
            AppendByte(ref buffer, Pack_STOP_A);
            AppendByte(ref buffer, Pack_STOP_B);
            AppendByte(ref buffer, Pack_STOP_C);

            return buffer;
        }

        ///	生成ACK包
        public static byte[] PacketAckPackage(byte slaveId)
        {
            var buffer = new byte[0];

            // Zigbee短地址，即Modbus设备地址
            AppendByte(ref buffer, slaveId);
            //功能码
            AppendByte(ref buffer, MB_FUNC_MASTER_RESPONSE);

            AppendByte(ref buffer, 0x41);
            AppendByte(ref buffer, 0x63);
            AppendByte(ref buffer, 0x63);
            AppendByte(ref buffer, 0x65);
            AppendByte(ref buffer, 0x70);
            AppendByte(ref buffer, 0x74);
            AppendByte(ref buffer, slaveId);

            //计算并保存CRC
            AppendBytes(ref buffer, BitConverter.IsLittleEndian ? buffer.CRC16().Reverse().ToArray() : buffer.CRC16());

            //包头标志
            InsertByte(ref buffer, 0, Pack_SYN_C);
            InsertByte(ref buffer, 0, Pack_SYN_B);
            InsertByte(ref buffer, 0, Pack_SYN_A);

            //包尾标志
            AppendByte(ref buffer, Pack_STOP_A);
            AppendByte(ref buffer, Pack_STOP_B);
            AppendByte(ref buffer, Pack_STOP_C);

            return buffer;
        }

        ///	处理状态数据包
        public static void ProcessWorkGraphStatusPackage(byte[] data)
        {
            try
            {
                var iotDataWorkGraphStatus = new IotDataWorkGraphStatus
                {
                    DateTime = DateTime.Now,
                    WellId = 0,
                    ModbusAddress = (byte)BytesConvertHelper.ConvertByteArrayToInt8(data, 0),
                    BatteryVoltage = BytesConvertHelper.ConvertByteArrayToInt16(data, 11) / 1000.0,
                    WellStatus = BytesConvertHelper.ConvertByteArrayToInt16(data, 13),
                    Temperature = BytesConvertHelper.ConvertByteArrayToInt16(data, 15) / 100.0,
                    Humidity = BytesConvertHelper.ConvertByteArrayToInt16(data, 17) / 100.0,
                    Stroke = BytesConvertHelper.ConvertByteArrayToInt16(data, 19) / 100.0,
                    Displacement = BytesConvertHelper.ConvertByteArrayToInt16(data, 21) / 100.0
                };
                var connectionFactory = HostContext.TryResolve<IDbConnectionFactory>();
                var dbFac = connectionFactory.OpenDbConnection();
                var list = dbFac.Select<IotOilWell>(x => x.ModbusAddress == data[0]);

                if (!list.IsEmpty())
                {
                    iotDataWorkGraphStatus.WellId = list[0].WellId;
                    DataWriter.WorkGraphStatusQueue.Enqueue(iotDataWorkGraphStatus);
                }
                Logger.Info(iotDataWorkGraphStatus.Dump());
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        //处理功图包
        public static void ProcessWorkGraphPackage(byte[] data)
        {
            try
            {
                var iotDataOilWellIndicatorDiagram = new IotDataOilWellIndicatorDiagram
                {
                    DateTime = DateTime.Now,
                    Count = (int?)BytesConvertHelper.ConvertByteArrayToInt8(data, 8),
                    Interval = BytesConvertHelper.ConvertByteArrayToInt16(data, 9) / 100.0,
                    D = new List<double>(),
                    L = new List<double>()
                };

                var count = (int)iotDataOilWellIndicatorDiagram.Count;

                var deviceId = (byte)1;
                var offset = (ushort)((deviceId - 1) * 550);
                MyModbusServer.Server.SetHoldingRegister(deviceId, (ushort)(31550 + offset + 3), (ushort)count);
                MyModbusServer.Server.SetHoldingRegister(deviceId, (ushort)(31550 + offset + 4), (ushort)(iotDataOilWellIndicatorDiagram.Interval * 100));

                for (var i = 0; i < count; i++)
                {
                    iotDataOilWellIndicatorDiagram.L.Add(BytesConvertHelper.ConvertByteArrayToInt16(data, 11 + 2 * i));
                    MyModbusServer.Server.SetHoldingRegister(deviceId, (ushort)(31550 + offset + i), (ushort)(iotDataOilWellIndicatorDiagram.Interval * 100));
                }

                for (var i = 0; i < count; i++)
                {
                    iotDataOilWellIndicatorDiagram.D.Add(BytesConvertHelper.ConvertByteArrayToInt16(data, 11 + 2 * count + 2 * i));
                    MyModbusServer.Server.SetHoldingRegister(deviceId, (ushort)(31550 + offset + 262 + i), (ushort)(iotDataOilWellIndicatorDiagram.Interval * 100));
                }

                var connectionFactory = HostContext.TryResolve<IDbConnectionFactory>();
                var dbFac = connectionFactory.OpenDbConnection();
                var list = dbFac.Select<IotOilWell>(x => x.ModbusAddress == data[0]);

                if (!list.IsEmpty())
                {
                    iotDataOilWellIndicatorDiagram.WellId = list[0].WellId;
                    DataWriter.WorkGraphDataQueue.Enqueue(iotDataOilWellIndicatorDiagram);
                }

                Logger.Info(iotDataOilWellIndicatorDiagram.Dump());
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public static string ToHexString(byte[] bytes)
        {
            var hexString = string.Empty;

            if (bytes == null) return hexString;
            var strB = new StringBuilder();

            foreach (var t in bytes)
            {
                strB.Append(t.ToString("X2") + " ");
            }

            hexString = strB.ToString();
            return hexString;
        }

        public static void AccToDisplace(List<double> accArray, double detaT, double refStrokeLength, double accelerationConst, out List<double> displace, out double chongCheng)
        {
            if (accArray == null) throw new ArgumentNullException(nameof(accArray));

            var itemCount = accArray.Count;

            var newAccDis = accArray.Select(t => Math.Abs(t - accelerationConst) * 9.8 / accelerationConst).ToList();
            var speedArray = accArray.Select(t => 0.0).ToList();
            displace = accArray.Select(t => 0.0).ToList();

            //做平移,每个点减去一个P值
            var partial = newAccDis.Average();
            for (var i = 0; i < itemCount; i++)
            {
                newAccDis[i] = newAccDis[i] - partial;
            }

            //加速度积分成速度
            for (var k = 0; k < itemCount; k++)
            {
                for (var i = 0; i <= k; i++)
                {
                    speedArray[k] = speedArray[k] + (newAccDis[((i + 1) % itemCount)] + newAccDis[i]) / 2.0 * detaT;
                }
            }

            //对速度数组积分前做一个平移 对速度的每个点减去一个值
            partial = speedArray.Average();
            for (var k = 0; k < itemCount; k++)
            {
                speedArray[k] = speedArray[k] - partial;
            }

            //速度积分成位移*
            for (var k = 0; k < itemCount; k++)
            {
                for (var i = 0; i <= k; i++)
                {
                    displace[k] = displace[k] + (speedArray[(i + 1) % itemCount] + speedArray[i]) / 2.0 * detaT;
                }
            }

            //对位移作如下处理
            var maxValue = displace.Max();
            var minValue = displace.Min();

            if (Math.Abs(refStrokeLength) > 0.01)
            {
                for (var k = 0; k < displace.Count; k++)
                {
                    displace[k] = Math.Round(refStrokeLength * ((displace[k] - minValue) / Math.Abs(maxValue - minValue)), 2);
                }
            }
            else
            {
                for (var k = 0; k < itemCount; k++)
                {
                    displace[k] = Math.Round(displace[k] + Math.Abs(minValue), 2);
                }
            }

            chongCheng = displace.Max() - minValue;

            Console.WriteLine("displace:{0}", displace.ToString());
        }


        public static UInt16 FindPeriod(UInt16 windowSize, List<double> dataList)
        {
            var windowDataList = dataList.Select(t => 0.0).ToList();
            var sumArrayValue = dataList.Select(t => 0.0).ToList();

            //将对应的前几个值放到数组里
            for (var i = 0; i < windowSize; i++)
            {
                windowDataList[i] = dataList[i];
            }

            for (var i = windowSize; i <= (dataList.Count - windowSize); i++)
            {
                double sumValue = 0;
                for (var j = i; j < (i + windowSize); j++)
                {
                    sumValue = sumValue + Math.Abs(dataList[i] - windowDataList[j]);
                }

                sumArrayValue.Add(sumValue);
            }

            double minValue = 65535;
            ushort minDot = 0;

            for (var j = 0; j < sumArrayValue.Count; j++)
            {
                if (!(sumArrayValue[j] < minValue)) continue;
                minValue = sumArrayValue[j];
                minDot = (ushort)j;
            }

            if (minValue < windowSize * 2)
                return (ushort)dataList.Count;
            else
                return (ushort)(minDot + windowSize);
        }
    }
}
