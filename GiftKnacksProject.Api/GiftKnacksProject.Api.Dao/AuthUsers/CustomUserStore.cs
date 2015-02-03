using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GiftKnacksProject.Api.Dao.AuthUsers
{
    public class CustomUserStore : IUserStore<ApplicationUser,long>,IUserPasswordStore<ApplicationUser,long>
    {
        private readonly IAuthRepository _repository;

        public CustomUserStore(IAuthRepository repository)
        {
            _repository = repository;
            
        }

        public Task CreateAsync(ApplicationUser user)
        {
            return _repository.RegisterUser(user);
        }

        public Task DeleteAsync(ApplicationUser user)
        {
            throw new NotImplementedException();
        }

        public Task<ApplicationUser> FindByIdAsync(long userId)
        {
            return _repository.FindUser(userId);
        }

        public Task<ApplicationUser> FindByNameAsync(string userName)
        {
            return  _repository.FindUser(userName, "");
        }

        public Task UpdateAsync(ApplicationUser user)
        {
            return _repository.UpdateUser(user);
        }

        public void Dispose()
        {
            _repository.Dispose();
        }

        public Task<string> GetPasswordHashAsync(ApplicationUser user)
        {
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }

            return Task.FromResult(user.PasswordHash);

        }

        public Task<bool> HasPasswordAsync(ApplicationUser user)
        {
            return Task.FromResult(user.PasswordHash != null);
        }

        public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash)
        {
            return Task.FromResult(user.PasswordHash = passwordHash);
        }
    }
}
