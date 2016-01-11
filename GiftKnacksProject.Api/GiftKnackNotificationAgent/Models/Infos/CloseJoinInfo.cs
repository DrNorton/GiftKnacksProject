using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos.Profile;
using GiftKnacksProject.Api.Dto.Dtos.Wishes;

namespace GiftKnackNotificationAgent.Models.Infos
{
    public class CloseJoinInfo:BaseNotificationInfo
    {
        public TinyProfileDto User { get; set; }
        public BasicWishGiftDto Target { get; set; }
        public string TargetType { get; set; }
    }
}
