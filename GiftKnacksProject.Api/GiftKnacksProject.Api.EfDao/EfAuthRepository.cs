using System.Linq;
using System.Threading.Tasks;
using FamilyTasks.EfDao;
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
            user.Profile = Db.Set<Profile>().Create();
            user.Profile.Id = user.Id;
            Db.Set<User>().Add(user);
            Db.SaveChanges();
            return IdentityResult.Success;
        }

        public async Task<IdentityUser> FindUser(string userName, string password)
        {
            var user = Db.Set<User>().FirstOrDefault(x => x.Email == userName);

           if (user != null)
           {
               return new IdentityUser(userName);
           }

           return null;
        }
    }
}
