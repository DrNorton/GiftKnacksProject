using System;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.AuthUsers;
using GiftKnacksProject.Api.Dto.Users;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GiftKnacksProject.Api.Dao.Repositories
{
    public interface IAuthRepository : IDisposable
    {
        Task RegisterUser(ApplicationUser createUserDto);

  


        Task<IdentityResult> ChangePassword(string email, string newPassword, string oldPassword);
        Task<ApplicationUser> FindUser(string userName, string password);
        Task<ApplicationUser> FindUser(long id);

        Task UpdateUser(ApplicationUser appUser);
    }
}
