using System;
using System.Collections.Concurrent;
using System.Threading;
using NLog;
using ServiceStack;
using ServiceStack.Data;
using ServiceStack.OrmLite;

namespace WG3000.Modbus.TcpServer.ServiceModel
{
    public static class DataWriter
    {
        private static readonly Logger Logger = LogManager.GetCurrentClassLogger();
        public static readonly ConcurrentQueue<IotDataOilWellIndicatorDiagram> WorkGraphDataQueue = new ConcurrentQueue<IotDataOilWellIndicatorDiagram>();
        public static readonly ConcurrentQueue<IotDataWorkGraphStatus> WorkGraphStatusQueue = new ConcurrentQueue<IotDataWorkGraphStatus>();

        private static readonly Thread Thread = new Thread(Go);
        public static bool Start()
        {
            if (Thread.ThreadState == ThreadState.Unstarted)
            {
                Thread.Start();
            }
            return true;
        }

        private static void Go()
        {
            
            Thread.Sleep(1000 * 10);

        START:
            try
            {
                var connectionFactory = HostContext.TryResolve<IDbConnectionFactory>();
                using var dbFac = connectionFactory.OpenDbConnection();

                dbFac.CreateTableIfNotExists<IotOilWell>();
                dbFac.CreateTableIfNotExists<IotDataWorkGraphStatus>();
                dbFac.CreateTableIfNotExists<IotDataWorkGraphStatusLatest>();
                dbFac.CreateTableIfNotExists<IotDataOilWellIndicatorDiagram>();
                dbFac.CreateTableIfNotExists<IotDataOilWellIndicatorDiagramLatest>();

                while (true)
                {
                    var bFlag = false;

                    //保存功图数据
                    WorkGraphDataQueue.TryDequeue(out var workGraphData);
                    while (workGraphData != null)
                    {
                        bFlag = true;
                        dbFac.Insert(workGraphData);

                        var recordLatest = workGraphData.ConvertTo<IotDataOilWellIndicatorDiagramLatest>();
                        recordLatest.Id = recordLatest.WellId;
                        dbFac.Save(recordLatest);

                        WorkGraphDataQueue.TryDequeue(out workGraphData);
                    }

                    //保存功图状态数据
                    WorkGraphStatusQueue.TryDequeue(out var workGraphStatus);
                    while (workGraphStatus != null)
                    {
                        bFlag = true;

                        dbFac.Insert(workGraphStatus);

                        var recordLatest = workGraphStatus.ConvertTo<IotDataWorkGraphStatusLatest>();
                        recordLatest.Id = recordLatest.WellId;
                        dbFac.Save(recordLatest);

                        WorkGraphStatusQueue.TryDequeue(out workGraphStatus);
                    }

                    if (bFlag == false)
                    {
                        Thread.Sleep(1000);
                    }
                }
            }
            catch (Exception ex)
            {
                Logger.Error($"Task.Run异常{ex.Message}");
                Thread.Sleep(1000);
                goto START;
            }
            // ReSharper disable once FunctionNeverReturns
        }
    }
}