using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.EfDao;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.OAuth;

namespace GiftKnacksProject.Api.Controllers
{
    public class SimpleAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        private readonly IAuthRepository _authRepository;

        public SimpleAuthorizationServerProvider(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {

            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            var user = await _authRepository.FindUser(context.UserName, context.Password);
           
            
            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            
            
            identity.AddClaim(new Claim("sub", context.UserName));
            identity.AddClaim(new Claim("role", "user"));
            identity.AddClaim(new Claim("id",user.Id.ToString()));

            context.Validated(identity);

        }
    }
}