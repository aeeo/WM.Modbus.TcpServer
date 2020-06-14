using AMWD.Modbus.Tcp.Client;
using AMWD.Modbus.Tcp.Server;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using ServiceStack;
using ServiceStack.Configuration;
using System;
using System.Net;
using System.Threading.Tasks;
using WG3000.Modbus.TcpServer.Modbus;
using WG3000.Modbus.TcpServer.ServiceModel;
using WG3000.Modbus.TcpServer.Uart;
using Microsoft.Extensions.Logging;

namespace WG3000.Modbus.TcpServer
{
    //dotnet publish -f netcoreapp3.1 -c Release
    public class Program
    {
        private static readonly ILoggerFactory LoggerFactory = new LoggerFactory();

        public static async Task Main(string[] args)
        {
            try
            {
                var appSettings = new AppSettings();
                var port = appSettings.Get<int>("Modbus.ServerPort", 502);
                MyUart.Run();
                var logger = LoggerFactory.CreateLogger("client");

                MyModbusServer.Server = new ModbusServer(port, logger);
                await MyModbusServer.Server.Initialization;

                var t = MyModbusServer.Server.IsRunning;


                MyModbusServer.Server.AddDevice(1);
                //MyModbusServer.Server.AddDevice(2);
                //MyModbusServer.Server.AddDevice(3);

                //MyModbusServer.Server.SetCoil(1, 0, true);
                //MyModbusServer.Server.SetHoldingRegister(1, 1, 1000);
                //MyModbusServer.Server.SetHoldingRegister(1, 2, 1000);

                //using (var mbClient = new ModbusClient("localhost", 502))
                //{
                //    await mbClient.Connect();
                //    var r = new AMWD.Modbus.Common.Structures.Register
                //    {
                //        Address = 0,
                //        Value = 1
                //    };

                //    await mbClient.WriteSingleRegister(1, r);
                //    var t1 = await mbClient.ReadCoils(1, 0, 1);
                //}


                DataWriter.Start();

                BuildWebHost(args).Run();
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            finally
            {
                MyModbusServer.Server?.Dispose();
            }
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseKestrel(options =>
                    {
                        options.AllowSynchronousIO = true;
                        options.Listen(IPAddress.Parse("0.0.0.0"), 80);
                    })
                .UseModularStartup<Startup>()
                .Build();
    }
}