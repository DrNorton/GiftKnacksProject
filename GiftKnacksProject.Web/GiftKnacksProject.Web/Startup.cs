using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(GiftKnacksProject.Web.Startup))]
namespace GiftKnacksProject.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
