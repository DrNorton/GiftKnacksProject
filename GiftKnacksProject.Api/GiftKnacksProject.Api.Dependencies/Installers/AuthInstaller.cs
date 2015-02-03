using System;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using GiftKnacksProject.Api.Controllers;
using GiftKnacksProject.Api.Dao.AuthUsers;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Helpers.Utils;
using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;

namespace GiftKnacksProject.Api.Dependencies.Installers
{
    public class AuthInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(
              Component.For<IUserStore<ApplicationUser, long>>().ImplementedBy<CustomUserStore>().LifestyleTransient());
            container.Register(Component.For<CustomUserManager>().LifestyleTransient());
           
         
            container.Register(
                Component.For<OAuthAuthorizationServerOptions>()
                    .UsingFactoryMethod((kernel, parameters) => new OAuthAuthorizationServerOptions
                    {
                        AllowInsecureHttp = true,
                        TokenEndpointPath = new PathString("/api/token"),
                        AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                        Provider = new SimpleAuthorizationServerProvider(kernel.Resolve<CustomUserManager>())
                    })
                    .LifestyleTransient());


            
           
        }
    }
}
