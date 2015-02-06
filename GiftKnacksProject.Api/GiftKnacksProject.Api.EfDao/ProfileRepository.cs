using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FamilyTasks.EfDao;
using GiftKnacksProject.Api.Dto.Dtos;

namespace GiftKnacksProject.Api.EfDao
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
            var contacts = profile.Contact;
            return new ProfileDto() { 
                AboutMe = profile.AboutMe, 
                AvatarUrl = profile.AvatarUrl,
                Birthday = profile.Birthday, 
                City = profile.City, 
                Country = profile.Country, 
                FirstName = profile.FirstName,
                Id = profile.Id,
                LastName = profile.LastName ,
                Contacts = new ContactsDto() { Facebook = contacts.Facebook,Skype = contacts.Skype,Telephone = contacts.Telephone,Vk = contacts.Vk}
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
            findedProfile.City = profile.City;
            findedProfile.Contact.Facebook = profile.Contacts.Facebook;
            findedProfile.Contact.Skype = profile.Contacts.Skype;
            findedProfile.Contact.Telephone = profile.Contacts.Telephone;
            findedProfile.Contact.Vk = profile.Contacts.Vk;
            findedProfile.Country = profile.Country;
            findedProfile.FirstName = profile.FirstName;
            findedProfile.LastName = profile.LastName;
            base.Update(findedProfile);
            base.Save();
            return Task.FromResult(0);
        }


      
    }
}
