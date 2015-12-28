using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Castle.Facilities.Startable;
using Castle.MicroKernel.Registration;
using GiftKnacksProject.Api.Services;
using GiftKnacksProject.Api.Services.Interfaces;
using GiftKnacksProject.Api.Services.Services;
using GiftKnacksProject.Api.Services.Services.FeedService;
using GiftKnacksProject.Api.Services.Storages;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure;


namespace GiftKnacksProject.Api.Dependencies.Installers
{
    public class ServiceInstaller:IWindsorInstaller
    {
        public void Install(Castle.Windsor.IWindsorContainer container, Castle.MicroKernel.SubSystems.Configuration.IConfigurationStore store)
        {
            var fileService = new FileService(container.Resolve<UrlSettings>());
            container.Register(Component.For<IFileService>().Instance(fileService));
            var connectionQmString = ConfigurationManager.AppSettings["Microsoft.ServiceBus.ConnectionString"];
       
            container.Register(
                Component.For<QueueClient>()
                    .UsingFactoryMethod(() => QueueClient.CreateFromConnectionString(connectionQmString,"notifications"))
                    .LifestyleTransient());
 


            container.Register(Component.For<INotificationService>().ImplementedBy<NotificationService>().LifestyleTransient());
            container.Register(Component.For<IUserOnlineStorage>().ImplementedBy<UserOnlineStorage>().LifeStyle.Singleton.Start());
        }
    }
}
