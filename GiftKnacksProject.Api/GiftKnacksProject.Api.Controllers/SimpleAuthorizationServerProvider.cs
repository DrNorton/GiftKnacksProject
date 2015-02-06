using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Castle.Windsor;
using GiftKnacksProject.Api.Dao.AuthUsers;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.EfDao;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.OAuth;

namespace GiftKnacksProject.Api.Controllers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        private readonly IWindsorContainer _container;
       
      


        public SimpleAuthorizationServerProvider(IWindsorContainer container)
        {
            _container = container;
        }

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var userManager = _container.Resolve<CustomUserManager>();
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            var user = await userManager.FindByNameAsync(context.UserName);
            
           
            if (user == null)
            {
                context.SetError("invalid_grant", "The user name doesnt Exist");
                return;
            }
            var passwordCorrect=await userManager.CheckPasswordAsync(user, context.Password);
            if (!passwordCorrect)
            {
                context.SetError("invalid_grant", "The password is fake");
                return;
            }

            if (!user.ConfirmEmail)
            {
                context.SetError("invalid_grant", "Validate your email");
                return;
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);

            identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));


            context.Validated(identity);

        }
    }
}