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
        Task<IdentityResult> RegisterUser(CreateUserDto createUserDto);

        Task<AppUser> FindUser(string userName, string password);


        Task<IdentityResult> ChangePassword(string email, string newPassword, string oldPassword);
    }
}
