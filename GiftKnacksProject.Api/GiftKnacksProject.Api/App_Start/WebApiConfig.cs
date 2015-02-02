using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using Castle.Windsor;
using GiftKnacksProject.Api;
using Newtonsoft.Json.Serialization;

namespace FamilyTasks.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config, IWindsorContainer container)
        {
            // Web API routes
            config.MapHttpAttributeRoutes();
            config.EnableCors();
            GlobalConfiguration.Configuration.Services.Replace(typeof(IHttpControllerActivator),
                new WindsorCompositionRoot(container));
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}
