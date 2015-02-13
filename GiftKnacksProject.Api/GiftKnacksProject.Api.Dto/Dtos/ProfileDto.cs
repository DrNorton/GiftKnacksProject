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
     [JsonConverter(typeof(CustomDateTimeConverter))]
        public Nullable<System.DateTime> Birthday { get; set; }
        public bool IsFilled { get; set; }
       
        public List<ContactDto> Contacts { get; set; }
        public bool HideBirthday { get; set; }

        public List<string> ContactTypes { get; set; }

        [JsonProperty("UploadAvatar")]
        public ImageDto Image { get; set; }

        public int ProfileProgress
        {
            get { return CalcProgress(); }
        }

        public int CalcProgress()
        {
            double progress = 0;
            if (!String.IsNullOrEmpty(FirstName)) progress++;
            if (!String.IsNullOrEmpty(LastName)) progress++;
            if (!String.IsNullOrEmpty(Country)) progress++;
            if (!String.IsNullOrEmpty(City)) progress++;
            if (!String.IsNullOrEmpty(AvatarUrl)) progress++;
            if (!String.IsNullOrEmpty(AboutMe)) progress++;
            if (Birthday != null) progress++;
            return Convert.ToInt32(Math.Round((progress/7)*100));
        }


        public bool CalcIsFilled()
        {
           IsFilled = !String.IsNullOrEmpty(FirstName)
                           && !String.IsNullOrEmpty(LastName)
                           && !String.IsNullOrEmpty(Country) 
                           && Birthday!=null;
            return IsFilled;
        }
    }

    class CustomDateTimeConverter : IsoDateTimeConverter
    {
        public CustomDateTimeConverter()
        {
            base.DateTimeFormat = "dd.MM.yyyy";
        }
    }
}
