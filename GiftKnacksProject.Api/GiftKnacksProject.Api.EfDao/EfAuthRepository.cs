using System;
using System.Linq;
using System.Net.Mail;
using System.Security.Policy;
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
            user.DateRegister = DateTime.Now;
            user.Profile = Db.Set<Profile>().Create();
            user.Profile.Id = user.Id;
            Db.Set<User>().Add(user);
            Db.SaveChanges();
            await ConfirmEmail(user);
            return IdentityResult.Success;
        }

        private Task ConfirmEmail(User user)
        {
            var mailMessage = new MailMessage(new MailAddress("dimaivanov1@mail.ru", "Web Registration"),
                       new MailAddress(user.Email));
            mailMessage.Subject = "Email confirmation";
            mailMessage.Body = string.Format("Dear {0}<BR/>Thank you for your registration, please click on the below link to comlete your registration:",user.Id);
            mailMessage.IsBodyHtml = true;
            var smtp = new SmtpClient("smtp.mail.ru");
            smtp.Credentials = new System.Net.NetworkCredential("dimaivanov1@mail.ru", "dimarianon1990");
            smtp.EnableSsl = true;
             return smtp.SendMailAsync(mailMessage); 
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
