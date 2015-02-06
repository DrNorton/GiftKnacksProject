using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Diagnostics;
using System.Linq;
using System.Net.Mail;
using System.Security.Policy;
using System.Threading.Tasks;
using FamilyTasks.EfDao;
using GiftKnacksProject.Api.Dao.AuthUsers;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.AuthUsers;

using GiftKnacksProject.Api.Helpers.Utils;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GiftKnacksProject.Api.EfDao
{
    public class EfAuthRepository : GenericRepository<User>, IAuthRepository 
    {
        private readonly EfContext _context;


        public EfAuthRepository(EfContext context)
            : base(context)
        {
            _context = context;
        }

        public  Task RegisterUser(ApplicationUser appUser)
        {
            var user = Db.Set<User>().Create();
            user.Email = appUser.UserName;
            user.Password = appUser.PasswordHash;
            user.DateRegister = DateTime.Now;
            user.ConfirmMail = false;
            user.EmailStamp = appUser.EmailStamp;
            user.Profile = Db.Set<Profile>().Create();
            user.Profile.Id = user.Id;
            user.Profile.Contact = Db.Set<Contact>().Create();
            user.Profile.Contact.Id = user.Profile.Id;
            base.Insert(user);
            base.Save();
            appUser.Id = user.Id;
            return Task.FromResult(0);
        }

        public  Task UpdateUser(ApplicationUser appUser)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Id == appUser.Id);
            user.Email = appUser.UserName;
            user.Password = appUser.PasswordHash;
            user.ConfirmMail = appUser.ConfirmEmail;
            user.EmailStamp = appUser.EmailStamp;

            base.Update(user);
            base.Save();

            return Task.FromResult(0);
        }

        public async Task<ApplicationUser> FindUser(string userName, string password)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Email == userName);
            
            if (user == null)
            {
                return null;
            }
            return new ApplicationUser(){Id = user.Id,PasswordHash = user.Password,UserName = user.Email,ConfirmEmail = user.ConfirmMail,EmailStamp = user.EmailStamp};
        }

      


        public async Task<ApplicationUser> FindUser(long id)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Id == id);
            if (user == null)
            {
                return null;
            }
            return new ApplicationUser() { Id = user.Id, PasswordHash = user.Password, UserName = user.Email,ConfirmEmail = user.ConfirmMail,EmailStamp = user.EmailStamp};
        }
    }
}
