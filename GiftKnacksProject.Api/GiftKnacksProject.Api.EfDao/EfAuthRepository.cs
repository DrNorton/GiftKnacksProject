using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Security.Policy;
using System.Threading.Tasks;
using FamilyTasks.EfDao;
using GiftKnacksProject.Api.Dao.AuthUsers;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Users;
using GiftKnacksProject.Api.Helpers.Utils;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GiftKnacksProject.Api.EfDao
{
    public class EfAuthRepository : GenericRepository<User>, IAuthRepository 
    {
        

        public EfAuthRepository(EfContext context)
            : base(context)
        {
         
        }

        public  Task RegisterUser(ApplicationUser appUser)
        {
            var user = Db.Set<User>().Create();
            user.Email = appUser.UserName;
            user.Password = appUser.PasswordHash;
            user.DateRegister = DateTime.Now;
            user.Profile = Db.Set<Profile>().Create();
            user.Profile.Id = user.Id;
            Db.Set<User>().Add(user);
            Db.SaveChanges();
            return Task.FromResult(0);
        }

        public   Task UpdateUser(ApplicationUser appUser)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Id == appUser.Id);
            user.Email = appUser.UserName;
            user.Password = appUser.PasswordHash;
         
            Db.SaveChanges();
            return Task.FromResult(0);
        }

        public async Task<ApplicationUser> FindUser(string userName, string password)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Email == userName);
            if (user == null)
            {
                return null;
            }
            return new ApplicationUser(){Id = user.Id,PasswordHash = user.Password,UserName = user.Email};
        }

        public async Task<IdentityResult> ChangePassword(string email, string newPassword, string oldPassword)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Email == email);
            if (user == null)
            {
                return new IdentityResult(new List<string>() { "User not finded" });
            }
            if (user.Password == oldPassword)
            {
                user.Password = newPassword;
                Save();
                return IdentityResult.Success;
            }
            return new IdentityResult(new List<string>() { "Incorrect old password" });
        }


        public async Task<ApplicationUser> FindUser(long id)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Id == id);
            if (user == null)
            {
                return null;
            }
            return new ApplicationUser() { Id = user.Id, PasswordHash = user.Password, UserName = user.Email };
        }
    }
}
