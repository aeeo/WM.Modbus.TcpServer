using System;
using System.IO.Ports;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AMWD.Modbus.Common.Util;
using NLog;
using ServiceStack;
using ServiceStack.Configuration;
using ServiceStack.Data;
using ServiceStack.OrmLite;
using WG3000.Modbus.TcpServer.Helper;
using WG3000.Modbus.TcpServer.ServiceModel;

namespace WG3000.Modbus.TcpServer.Uart
{
    public class Package
    {
        public int Flag { set; get; }

        public byte[] Buffer { set; get; }
        public  int Count { set; get; }
    }
    public static class MyUart
    {
        /// <summary>
        /// 树莓派串口操作，也可以用于Windows系统（COMx）
        /// </summary>
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();

        private static readonly Package Package = new Package();

        public static void Run()
        {
            var task = new Task(() =>
            {
                var appSettings = new AppSettings();
                var portName = appSettings.Get<string>("Modbus.SerialPort", "COM4");

                Package.Flag = 0;
                Package.Count = 0;
                Package.Buffer = new byte[1024];

                try
                {
                    //查询系统中支持的串口列表
                    var ports = SerialPort.GetPortNames();
                    var isTty = false;
                    if (ports.Length == 0)
                    {
                        Logger.Info($"No serial port allow to use!");
                        return;
                    }

                    Logger.Info("Serial List:");
                    foreach (var prt in ports)
                    {
                        Logger.Info($"  {prt}");
                        if (prt.Contains(portName))
                            isTty = true;
                    }

                    if (!isTty)
                    {
                        Logger.Info($"No {portName} serial port!");
                        return;
                    }

                    //Linux加上/dev
                    if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                    {
                        portName = $"/dev/{portName}";
                    }
                    else
                    {
                    }

                    using var serial = new SerialPort(portName, 115200);

                    //开始使用串口
                    serial.DataReceived += DataReceived;
                    serial.Encoding = Encoding.UTF8;
                    serial.Open();

                    if (serial.IsOpen)
                    {
                        Logger.Info($"Port {portName} has opened!");
                    }
                    else
                    {
                        Logger.Info($"Port {portName} cannot open!");
                        return;
                    }

                    while (true)
                    {
                        Thread.Sleep(100);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            });

            task.Start();
        }

        private static void DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            try
            {
                if (!(sender is SerialPort))
                {
                    return;
                }

                var serial = (SerialPort)sender;

                while (serial.BytesToRead > 0)
                {
                    var byteCount = serial.BytesToRead;
                    var buffer = new byte[byteCount];

                    var readCount = serial.Read(buffer, 0, byteCount);

                    Logger.Info(ParserHelper.ToHexString(buffer));
                    for (var i = 0; i < readCount; i++)
                    {
                        if (Package.Count == 1024)
                        {
                            Package.Flag = 0;
                            Package.Count = 0;
                            Logger.Info($"重置包解析器");
                        }

                        Package.Buffer[Package.Count] = buffer[i];
                        Package.Count += 1;

                        switch (Package.Flag)
                        {
                            case 0:
                                if (Package.Count >= 3)
                                {
                                    if ((Package.Buffer[Package.Count - 1] == ParserHelper.Pack_SYN_C) &&
                                        (Package.Buffer[Package.Count - 2] == ParserHelper.Pack_SYN_B) &&
                                        (Package.Buffer[Package.Count - 3] == ParserHelper.Pack_SYN_A))
                                    {
                                        Package.Flag = 1;
                                        Package.Count = 0;
                                        Logger.Info($"读到数据包的开始标记");
                                    }
                                }
                                break;

                            case 1:
                                if (Package.Count >= 3)
                                {
                                    if ((Package.Buffer[Package.Count - 1] == ParserHelper.Pack_STOP_C) &&
                                        (Package.Buffer[Package.Count - 2] == ParserHelper.Pack_STOP_B) &&
                                        (Package.Buffer[Package.Count - 3] == ParserHelper.Pack_STOP_A))
                                    {
                                        Logger.Info($"读到到数据包的结束标记，数据长度：[{Package.Count - 3}]字节");

                                        switch (Package.Buffer[1])
                                        {
                                            //向主机申请下发网络配置
                                            case ParserHelper.MB_FUNC_SLAVE_REQUEST_CONFIG:

                                                var connectionFactory = HostContext.TryResolve<IDbConnectionFactory>();
                                                var dbFac = connectionFactory.OpenDbConnection();

                                                var list = dbFac.Select<IotOilWell>( x => x.ModbusAddress == Package.Buffer[0]);
                                                
                                                if(!list.IsEmpty())
                                                {
                                                    // PROCESS DATA HERE
                                                    var timeSyncPacket = ParserHelper.PacketTimeSyncPackage(Package.Buffer[0], (ushort)(list[0].Stroke * 100), (ushort)(list[0].Displacement * 100));
                                                    serial.Write(timeSyncPacket, 0, timeSyncPacket.Length);
                                                    Logger.Info($"向设备[{Package.Buffer[0]}]发送时间同步包");
                                                    Logger.Info(ParserHelper.ToHexString(timeSyncPacket));
                                                }
                                                else
                                                {
                                                    Logger.Error("本组内无此设备");
                                                }

                                                break;

                                            //向主机发送的状态数据包
                                            case ParserHelper.MB_FUNC_SLAVE_RUNSTATE_DATA:
                                                // PROCESS DATA HERE
                                                Logger.Debug(ParserHelper.ToHexString(Package.Buffer.Take(Package.Count - 3).ToArray()));
                                                ParserHelper.ProcessWorkGraphStatusPackage(Package.Buffer.Take(Package.Count - 5).ToArray());
                                                Logger.Info($"接收到设备[{Package.Buffer[0]}]状态报告包");    
                                                break;

                                            //向主机发送的功图数据
                                            case ParserHelper.MB_FUNC_SLAVE_WORKGRAPH_DATA:
                                                // PROCESS DATA HERE
                                                Logger.Debug(ParserHelper.ToHexString(Package.Buffer.Take(Package.Count - 3).ToArray()));
                                                ParserHelper.ProcessWorkGraphPackage(Package.Buffer.Take(Package.Count - 5).ToArray());

                                                var crc = Package.Buffer.Take(Package.Count - 5).ToArray().CRC16();
                                                
                                                var ackPacket = ParserHelper.PacketAckPackage(Package.Buffer[0]);
                                                serial.Write(ackPacket, 0, ackPacket.Length);

                                                Logger.Info($"接收到功图数据包，向设备[{Package.Buffer[0]}]发送数据确认包");
                                                Logger.Info(ParserHelper.ToHexString(ackPacket));
                                                break;
                                        }

                                        Package.Flag = 0;
                                        Package.Count = 0;
                                    }
                                }
                                break;
                        }
                    }
                }

            }
            catch(Exception ex)
            {
                Logger.Error(ex.Message);
            }
        }
    }
}
