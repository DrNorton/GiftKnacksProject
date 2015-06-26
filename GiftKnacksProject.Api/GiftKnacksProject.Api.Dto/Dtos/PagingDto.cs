using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GiftKnacksProject.Api.Dto.Dtos
{
    public class PagingDto
    {
        public int Offset { get; set; }
        public int Length { get; set; }
    }
}
