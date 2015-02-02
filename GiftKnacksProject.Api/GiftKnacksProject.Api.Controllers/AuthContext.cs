using GiftKnacksProject.Api.Dao.AuthUsers;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GiftKnacksProject.Api.Controllers
{
    public class AuthContext : IdentityDbContext<AppUser, AppRole, long, AppUserLogin, AppUserRole, AppUserClaim>
    {
        public AuthContext()
            : base("AuthContext")
        {

        }
    }
}