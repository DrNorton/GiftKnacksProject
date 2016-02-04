using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using GiftKnackMessageAgent.Services;

namespace GiftKnackMessageAgent.Installers
{
    public class ServiceInstaller:IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For<Functions>().LifestyleTransient());
            container.Register(Component.For<IChatMessageFromMqProcessor>().ImplementedBy<ChatMessageFromMqProcessor>().LifestyleTransient());
            
        }
    }
}
