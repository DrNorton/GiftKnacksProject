﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos.Links;
using GiftKnacksProject.Api.Dto.JsonConverters;
using Newtonsoft.Json;

namespace GiftKnacksProject.Api.Dto.Dtos.Gifts
{
    public class GiftDto
    {

        public long Id { get; set; }
        public string Name { get; set; }
        public CountryDto Country { get; set; }
      
        public string City { get; set; }
        public string Location { get; set; }
        [JsonConverter(typeof(CustomDateTimeConverter))]
        public Nullable<System.DateTime> FromDate { get; set; }
        [JsonConverter(typeof(CustomDateTimeConverter))]
        public Nullable<System.DateTime> ToDate { get; set; }
        public string Benefit { get; set; }
        public string Description { get; set; }

        public CreatorDto Creator { get; set; }

        public IEnumerable<ParticipantDto> Participants { get; set; }
      
    }
}
