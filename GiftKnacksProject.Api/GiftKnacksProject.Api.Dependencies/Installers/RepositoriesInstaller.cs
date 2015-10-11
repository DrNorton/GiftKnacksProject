using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.EfDao;
using GiftKnacksProject.Api.EfDao.Base;
using GiftKnacksProject.Api.EfDao.Repositories;

namespace GiftKnacksProject.Api.Dependencies.Installers
{
    public class RepositoriesInstaller: IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For<EfContext>().LifestylePerWebRequest());
            
            container.Register(Component.For<IAuthRepository, EfAuthRepository>().LifestylePerWebRequest());
           
            container.Register(Component.For<IProfileRepository, ProfileRepository>().LifestylePerWebRequest());

            container.Register(Component.For<ICountryRepository, CountryRepository>().LifestylePerWebRequest());
            container.Register(Component.For<IWishRepository, WishRepository>().LifestylePerWebRequest());
            container.Register(Component.For<IGiftRepository, GiftRepository>().LifestylePerWebRequest());
            container.Register(Component.For<ILinkRepository, LinkRepository>().LifestylePerWebRequest());
            container.Register(Component.For<IReferenceRepository, ReferenceRepository>().LifestylePerWebRequest());
            container.Register(Component.For<ICommentRepository, CommentRepository>().LifestylePerWebRequest());
        }
    }
}
