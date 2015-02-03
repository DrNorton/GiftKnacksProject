using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Dao.AuthUsers
{
    public class CustomUserManager : UserManager<ApplicationUser,long>
    {
        public CustomUserManager(IUserStore<ApplicationUser, long> store)
            : base(store)
        {
            this.PasswordHasher = new PasswordHasher();
        }

        public override Task<ApplicationUser> FindAsync(string userName, string password)
        {
            Task<ApplicationUser> taskInvoke = Task<ApplicationUser>.Factory.StartNew(() =>
            {
                PasswordVerificationResult result = this.PasswordHasher.VerifyHashedPassword(userName, password);
                if (result == PasswordVerificationResult.SuccessRehashNeeded)
                {
                    return Store.FindByNameAsync(userName).Result;
                }
                return null;
            });
            return taskInvoke;
        }
    }
}
