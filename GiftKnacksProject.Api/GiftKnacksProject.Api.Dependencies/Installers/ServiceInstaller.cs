using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Castle.MicroKernel.Registration;



namespace GiftKnacksProject.Api.Dependencies.Installers
{
    public class ServiceInstaller:IWindsorInstaller
    {
        public void Install(Castle.Windsor.IWindsorContainer container, Castle.MicroKernel.SubSystems.Configuration.IConfigurationStore store)
        {
           // container.Register(Component.For<EmailService>().LifestyleTransient());
        }
    }
}
