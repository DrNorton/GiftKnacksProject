using Microsoft.AspNet.Identity.EntityFramework;

namespace GiftKnacksProject.Api.Controllers
{
    public class AuthContext : IdentityDbContext<IdentityUser>
    {
        public AuthContext()
            : base("AuthContext")
        {

        }
    }
}