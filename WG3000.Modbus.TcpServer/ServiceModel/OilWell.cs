using System;
using System.Collections.Generic;
using ServiceStack.DataAnnotations;

namespace WG3000.Modbus.TcpServer.ServiceModel
{

    [Alias("IOT_OilWell")]
    public class IotOilWell
    {
        //油井基础数据
        [Index]
        [AutoIncrement]
        public long Id { set; get; }
        [Index]
        public long WellId { set; get; }
        public string WellName { set; get; }

        [Index]
        public byte ModbusAddress { set; get; }

        public double Displacement { get; set; }  //位移 
        public double Stroke { get; set; }        //冲次
    }

    //无线功图传感器状态数据
    [Alias("IOT_Data_WorkGraph_Status")]
    public class IotDataWorkGraphStatus
    {
        [Index] 
        [AutoIncrement] 
        public long Id { set; get; }
        [Index] 
        public long WellId { set; get; }
        [Index]
        public byte ModbusAddress { set; get; }
        [Index] 
        public DateTime DateTime { get; set; }      //数据采集时间
        public int? WellStatus { get; set; }        //油井运行状态
        public double? BatteryVoltage { get; set; } //电池电压 
        public double? Temperature { get; set; }    //机柜温度 
        public double? Humidity { get; set; }       //机柜湿度 
        public double? Displacement { get; set; }    //参考冲程 
        public double? Stroke { get; set; }          //参考冲次
    }


    //无线功图传感器状态最新一条数据
    [Alias("IOT_Data_WorkGraph_Status_Latest")]
    public class IotDataWorkGraphStatusLatest
    {
        [Index]
        [AutoIncrement]
        public long Id { set; get; }
        [Index]
        public long WellId { set; get; }
        [Index]
        public byte ModbusAddress { set; get; }
        [Index]
        public DateTime DateTime { get; set; }      //数据采集时间
        public int? WellStatus { get; set; }        //油井运行状态
        public double? BatteryVoltage { get; set; } //电池电压 
        public double? Temperature { get; set; }    //机柜温度 
        public double? Humidity { get; set; }       //机柜湿度 
        public double? Displacement { get; set; }    //参考冲程 
        public double? Stroke { get; set; }          //参考冲次
    }

    //油井功图
    [Alias("IOT_Data_OilWell_IndicatorDiagram")]
    public class IotDataOilWellIndicatorDiagram
    {
        [Index]
        [AutoIncrement]
        public long Id { set; get; }
        [Index]
        public long WellId { set; get; }
        [Index]
        public DateTime DateTime { get; set; }    //数据采集时间
        public double? Displacement { get; set; } //位移 
        public double? Stroke { get; set; }       //冲次

        [Index]
        public double? MaxLoad { get; set; }    //最大载荷
        [Index]
        public double? MinLoad { get; set; }    //最小载荷 
        [Index]
        public double? AvgLoad { get; set; }    //平均载荷 

        public double? Interval { get; set; }    //采样间隔
        public int? Count { get; set; }          //采样点数
        public List<double> D { get; set; }     //位移
        public List<double> L { get; set; }     //载荷
    }


    //油井功图最新一条数据
    [Alias("IOT_Data_OilWell_IndicatorDiagram_Latest")]
    public class IotDataOilWellIndicatorDiagramLatest
    {
        public long Id { set; get; }
        [Index]
        [PrimaryKey]
        public long WellId { set; get; }
        [Index]
        public DateTime DateTime { get; set; }   //数据采集时间
        public double? Displacement { get; set; } //位移 
        public double? Stroke { get; set; } //冲次

        [Index]
        public double? MaxLoad { get; set; }    //最大载荷
        [Index]
        public double? MinLoad { get; set; }    //最小载荷 
        [Index]
        public double? AvgLoad { get; set; }    //平均载荷 

        public double? Interval { get; set; }    //采样间隔
        public int? Count { get; set; }          //采样点数
        public List<double> D { get; set; }     //位移
        public List<double> L { get; set; }     //载荷
    }
}
