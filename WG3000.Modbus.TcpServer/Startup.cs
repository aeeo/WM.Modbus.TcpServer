using Funq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using ServiceStack;
using ServiceStack.Api.OpenApi;
using ServiceStack.Configuration;
using ServiceStack.Data;
using ServiceStack.DataAnnotations;
using ServiceStack.Desktop;
using ServiceStack.Logging;
using ServiceStack.Logging.NLogger;
using ServiceStack.OrmLite;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace WG3000.Modbus.TcpServer
{
    public class Startup : ModularStartup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public new void ConfigureServices(IServiceCollection services)
        {
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            LogManager.LogFactory = new NLogFactory();

            app.UseServiceStack(new AppHost
            {
                AppSettings = new NetCoreAppSettings(Configuration)
            });
        }
    }

    public class AppHost : AppHostBase
    {
        public AppHost() : base("Modbus.TcpServer", typeof(Program).Assembly) { }

        public override void Configure(IServiceCollection services)
        {
            var appSettings = new AppSettings();
            var contentRootPath = appSettings.Get("HostingEnvironment.ContentRootPath", MapProjectPath("~/"));

            //Register Database Connection, see: https://github.com/ServiceStack/ServiceStack.OrmLite#usage
            services.AddSingleton<IDbConnectionFactory>(c =>
                new OrmLiteConnectionFactory(Path.Combine(contentRootPath,"data.sqlite"), SqliteDialect.Provider));
        }

        // Configure your AppHost with the necessary configuration and dependencies your App needs
        public override void Configure(Container container)
        {
            SetConfig(new HostConfig
            {
                DebugMode = AppSettings.Get(nameof(HostConfig.DebugMode), HostingEnvironment.IsDevelopment()),
            });

            var appSettings = new AppSettings();
            var contentRootPath = appSettings.Get("HostingEnvironment.ContentRootPath", MapProjectPath("~/"));
            var webRootPath = appSettings.Get("HostingEnvironment.WebRootPath", MapProjectPath("~/wwwroot"));

            HostContext.AppHost.Config.WebHostPhysicalPath = webRootPath;

            //下行代码解决supervisor下运行wwwroot目录找不准的问题
            HostingEnvironment.ContentRootPath = contentRootPath;
            HostingEnvironment.WebRootPath = webRootPath;

            Plugins.Add(new SharpPagesFeature
            {
                EnableSpaFallback = true,
                ScriptMethods = { new DbScriptsAsync() },
                Args = {
                    //Only display user-defined list of tables:
                    ["tables"] = "IOT_OilWell,IOT_Data_WorkGraph_Status,IOT_Data_WorkGraph_Status_Latest,IOT_Data_OilWell_IndicatorDiagram,IOT_Data_OilWell_IndicatorDiagram_Latest",
                }
            });

            if (Config.DebugMode)
            {
                Plugins.Add(new HotReloadFeature
                {
                    VirtualFiles = VirtualFiles, //Monitor all folders for changes including /src & /wwwroot
                });
            }

            Plugins.Add(new DesktopFeature
            {
                AppName = "Modbus.TcpServer"
            });

            Plugins.Add(new OpenApiFeature
            {
                UseBasicSecurity = true,
            });

            // Customize Service Generation for this database
            var ignoreTables = new[] { "IgnoredTable", }; // don't generate AutoCrud APIs for these tables
            var readOnlyTables = new[] { "CrudEvent", "IOT_Data_WorkGraph_Status", "IOT_Data_WorkGraph_Status_Latest", "IOT_Data_OilWell_IndicatorDiagram", "IOT_Data_OilWell_IndicatorDiagram_Latest" };
            var protectTableByRole = new Dictionary<string,string[]> {
                ["Admin"]  = new[] { nameof(CrudEvent), nameof(ValidationRule), "CrudEvent", "UserAuth", "UserAuthDetails", "UserAuthRole" },
                ["User"]   = new[] { "IOT_OilWell", "IOT_Data_WorkGraph_Status", "IOT_Data_WorkGraph_Status_Latest", "IOT_Data_OilWell_IndicatorDiagram", "IOT_Data_OilWell_IndicatorDiagram_Latest" },
            };

            var tableRequiredFields = new Dictionary<string,string[]> {
            };
            
            Plugins.Add(item: new AutoQueryFeature {
                MaxLimit = 100,
                GenerateCrudServices = new GenerateCrudServices {
                    // Comment below to disable auto-generation of missing AutoQuery Services
                    AutoRegister = true,
                    
                    ServiceFilter = (op,req) => {
                        // Require all Write Access to Tables to be limited to Authenticated Users
                        if (op.IsCrudWrite())
                        {
                            op.Request.AddAttributeIfNotExists(new ValidateRequestAttribute("IsAuthenticated"), 
                                x => x.Validator == "IsAuthenticated");
                        }
            
                        // Limit Access to specific Tables
                        foreach (var tableRole in protectTableByRole)
                        {
                            foreach (var table in tableRole.Value)
                            {
                                if (op.ReferencesAny(table))
                                    op.Request.AddAttribute(new ValidateHasRoleAttribute(tableRole.Key));
                            }
                        }

                        // Add [ValidateNotEmpty] attribute on Services operating Tables with Required Fields
                        if (op.DataModel != null && tableRequiredFields.TryGetValue(op.DataModel.Name, out var requiredFields))
                        {
                            var props = op.Request.Properties.Where(x => requiredFields.Contains(x.Name));
                            props.Each(x => x.AddAttribute(new ValidateNotEmptyAttribute()));
                        }
                    },

                    TypeFilter = (type, req) => {
                        // Add OrmLite [Required] Attribute on Tables with Required Fields
                        if (tableRequiredFields.TryGetValue(type.Name, out var requiredFields))
                        {
                            var props = type.Properties.Where(x => requiredFields.Contains(x.Name));
                            props.Each(x => x.AddAttribute(new RequiredAttribute()));
                        }
                    },

                    //Don't generate the Services or Types for Ignored Tables
                    IncludeService = op => !ignoreTables.Any(table => op.ReferencesAny(table)) &&
                        !(op.IsCrudWrite() && readOnlyTables.Any(table => op.ReferencesAny(table))),
                    IncludeType = type => !ignoreTables.Contains(type.Name),
                }
            });

            // Add support for auto capturing executable audit history for AutoCrud Services
            container.AddSingleton<ICrudEvents>(c => new OrmLiteCrudEvents(c.Resolve<IDbConnectionFactory>()));
            container.Resolve<ICrudEvents>().InitSchema();
        }
    }
}
