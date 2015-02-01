using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GiftKnacksProject.Api.Dao.AuthUsers
{
    public class AppUser : IdentityUser<long, AppUserLogin, AppUserRole, AppUserClaim>,IUser<long>
    {

    }

    public class AppUserLogin : IdentityUserLogin<long> { }

    public class AppUserRole : IdentityUserRole<long> { }

    public class AppUserClaim : IdentityUserClaim<long> { }

    public class AppRole : IdentityRole<long, AppUserRole> { }

    public class AppClaimsPrincipal : ClaimsPrincipal
    {
        public AppClaimsPrincipal(ClaimsPrincipal principal)
            : base(principal)
        { }

        public int UserId
        {
            get { return int.Parse(this.FindFirst(ClaimTypes.Sid).Value); }
        }
    }
}
