using System.Web.Http;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using GiftKnacksProject.Api.Controllers.ApiResults;

namespace GiftKnacksProject.Api.Dependencies.Installers
{
    public class ControllersInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Classes.FromAssemblyContaining<ApiResult>()
                    .BasedOn<ApiController>()
                    .LifestyleTransient());
        }
    }
}
