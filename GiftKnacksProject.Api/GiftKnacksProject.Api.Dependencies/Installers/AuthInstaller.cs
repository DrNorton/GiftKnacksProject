using System;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using GiftKnacksProject.Api.Controllers;
using GiftKnacksProject.Api.Dao.AuthUsers;
using GiftKnacksProject.Api.Dao.Emails;
using GiftKnacksProject.Api.Dao.Emails.Mailers;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.AuthUsers;
using GiftKnacksProject.Api.Helpers.Utils;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.Owin.Security.OAuth;

namespace GiftKnacksProject.Api.Dependencies.Installers
{
    public class AuthInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            var provider = new DpapiDataProtectionProvider("Sample");
          
            IDataProtector protector = provider.Create("EmailConfirmation");
            container.Register(Component.For<IDataProtector>().Instance(protector));
            container.Register(
                Component.For<DataProtectorTokenProvider<ApplicationUser, long>>().LifestyleTransient());

            container.Register(Component.For<IIdentityMessageService>().ImplementedBy<AuthEmailService>().LifestyleTransient());
            container.Register(Component.For<IPasswordHasher>().ImplementedBy<PasswordHasher>().LifestyleTransient());
            container.Register(Component.For<IUserMailer>().ImplementedBy<UserMailer>().LifestyleTransient());

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
                        Provider = new SimpleAuthorizationServerProvider(container)
                    })
                    .LifestyleTransient());


            
           
        }
    }
}
