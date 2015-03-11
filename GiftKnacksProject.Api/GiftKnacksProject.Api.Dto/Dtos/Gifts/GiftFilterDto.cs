using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GiftKnacksProject.Api.Dto.Dtos.Gifts
{
    public class GiftFilterDto
    {
        public string Country { get; set; }
        public string City { get; set; }
        public List<string> Keywoard { get; set; }
        public string Category { get; set; }
        public DateTime Time { get; set; }
    }
}
