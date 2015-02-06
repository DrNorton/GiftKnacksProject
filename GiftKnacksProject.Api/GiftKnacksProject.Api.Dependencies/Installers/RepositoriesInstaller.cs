using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.EfDao;

namespace GiftKnacksProject.Api.Dependencies.Installers
{
    public class RepositoriesInstaller: IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For<EfContext>().LifestyleTransient());
            
            container.Register(Component.For<IAuthRepository, EfAuthRepository>().LifestyleTransient());
           
            container.Register(Component.For<IProfileRepository, ProfileRepository>().LifestyleTransient());
        }
    }
}
