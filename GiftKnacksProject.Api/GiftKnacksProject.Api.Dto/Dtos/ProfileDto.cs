using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace GiftKnacksProject.Api.Dto.Dtos
{
    public class ProfileDto
    {
        public long Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string AvatarUrl { get; set; }
        public string AboutMe { get; set; }
   
        public Nullable<System.DateTime> Birthday { get; set; }
        public bool IsFilled { get; set; }
        public ContactsDto Contacts { get; set; }
    }
}
