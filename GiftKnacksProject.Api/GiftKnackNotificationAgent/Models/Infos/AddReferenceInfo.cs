using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos.Profile;

namespace GiftKnackNotificationAgent.Models.Infos
{
    public class AddReferenceInfo:BaseNotificationInfo
    {
        public TinyProfileDto User { get; set; }

        public byte? Rate { get; set; }
    }
}
