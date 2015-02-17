using System.Linq;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos;
using GiftKnacksProject.Api.EfDao.Base;

namespace GiftKnacksProject.Api.EfDao.Repositories
{
    public class ProfileRepository : GenericRepository<Profile>, IProfileRepository
    {
        public ProfileRepository(EfContext context)
            : base(context)
        {

        }

        public async Task<ProfileDto> GetProfile(long userId)
        {
            var profile = Db.Set<Profile>().FirstOrDefault(x => x.Id == userId);
            
            if (profile == null)
            {
                return null;
            }
            var types = Db.Set<ContactType>();
       
            return new ProfileDto() { 
                AboutMe = profile.AboutMe, 
                AvatarUrl = profile.AvatarUrl,
                Birthday = profile.Birthday, 
                City = profile.City, 
                Country = profile.Country==null?null:new CountryDto(){Code = profile.Country1.Id,Name = profile.Country1.Name}, 
                FirstName = profile.FirstName,
                Id = profile.Id,
                LastName = profile.LastName,
                IsFilled = profile.IsFilled,
                HideBirthday = profile.HideBirthday,
                Contacts = profile.Contacts.Select(x=>new ContactDto(){Name = x.ContactType.Name,Value = x.Value,MainContact = x.MainContact}).ToList(),
                ContactTypes = types.Select(x=>x.Name).ToList(),
                Gender = GetGenderStringFromBool(profile.Gender)
                
            };
        }

        public Task UpdateProfile(ProfileDto profile)
        {
            var findedProfile = Db.Set<Profile>().FirstOrDefault(x => x.Id == profile.Id);
            if (findedProfile == null)
            {
                return null;
            }

            findedProfile.AboutMe = profile.AboutMe;
            findedProfile.AvatarUrl = profile.AvatarUrl;
            findedProfile.Birthday = profile.Birthday;
            findedProfile.IsFilled = profile.IsFilled;
            findedProfile.City = profile.City;
            findedProfile.Gender = ParseGenderStr(profile.Gender);
         
            var contactTypes = Db.Set<ContactType>();

            //удаляем контакты если есть
            foreach (var contactsFromDb in findedProfile.Contacts.ToList())
            {
                var deletedContact = profile.Contacts.FirstOrDefault(x => x.Name == contactsFromDb.ContactType.Name);
                if (deletedContact == null)
                {
                    Db.Set<Contact>().Remove(contactsFromDb);
                }
            }
            foreach (var contact in profile.Contacts)
            {
                var findedCurrentContact=findedProfile.Contacts.FirstOrDefault(x => x.ContactType.Name == contact.Name);
                if (findedCurrentContact != null)
                {
                    findedCurrentContact.Value = contact.Value;
                    findedCurrentContact.MainContact = contact.MainContact;
                }
                else
                {
                    var type = contactTypes.FirstOrDefault(x => x.Name == contact.Name);
                    var con = Db.Set<Contact>().Create();
                    con.ContactType = type;
                    con.MainContact = contact.MainContact;
                    con.Value = contact.Value;
                    findedProfile.Contacts.Add(con);
                }

               

               
            }
            if (profile.Country != null)
            {
                  findedProfile.Country1 = Db.Set<Country>().FirstOrDefault(x=>x.Id==profile.Country.Code);
            }
          
            findedProfile.FirstName = profile.FirstName;
            findedProfile.LastName = profile.LastName;
            findedProfile.HideBirthday = profile.HideBirthday;
            findedProfile.IsFilled = profile.CalcIsFilled();
            base.Update(findedProfile);
            base.Save();
            return Task.FromResult(0);
        }

        private bool ParseGenderStr(string gender)
        {
            if (gender.ToLower() == "male")
            {
                return true;
            }
            return false;
        }

        private string GetGenderStringFromBool(bool gender)
        {
            if (gender) return "male";
            return "female";
        }
    }
}
