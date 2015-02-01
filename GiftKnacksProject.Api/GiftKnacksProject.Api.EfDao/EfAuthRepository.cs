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

        public async Task<IdentityResult> RegisterUser(CreateUserDto createUserDto)
        {
            var user = Db.Set<User>().Create();
            user.Email = createUserDto.Email;
            user.Password = createUserDto.Password;
            user.DateRegister = DateTime.Now;
            user.Profile = Db.Set<Profile>().Create();
            user.Profile.Id = user.Id;
            Db.Set<User>().Add(user);
            Db.SaveChanges();
            return IdentityResult.Success;
        }


        public async Task<AppUser> FindUser(string userName, string password)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Email == userName);

           if (user != null)
           {
               var findedUser= new AppUser();
               findedUser.Id = user.Id;
               findedUser.Email = user.Email;
               findedUser.UserName = user.Email;
               return findedUser;
           }

           return null;
        }

        public async Task<IdentityResult> ChangePassword(string email, string newPassword, string oldPassword)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Email == email);
            if (user.Password == oldPassword)
            {
                user.Password = newPassword;
                Save();
                return IdentityResult.Success;
            }
            return new IdentityResult(new List<string>() { "Incorrect old password" });
        }
    }
}
