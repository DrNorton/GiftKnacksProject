using System.Web.Http;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using FamilyTasks.Api;
using GiftKnacksProject.Api.Dependencies;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace GiftKnacksProject.Api
{
    public class Startup
    {
      

        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            var container = ConfigureWindsor(GlobalConfiguration.Configuration);
            ConfigureOAuth(app, container);
            
            GlobalConfiguration.Configure(c => WebApiConfig.Register(c, container));
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);
            
        }

        public void ConfigureOAuth(IAppBuilder app, IWindsorContainer container)
        {
            //// Token Generation
            app.UseOAuthAuthorizationServer(container.Resolve<OAuthAuthorizationServerOptions>());
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());

        }

        public static IWindsorContainer ConfigureWindsor(HttpConfiguration configuration)
        {
            var container = CastleInstaller.Install();
            var dependencyResolver = new WindsorDependencyResolver(container);
            configuration.DependencyResolver = dependencyResolver;

            return container;
        }    
    }
}