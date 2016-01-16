using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos.Profile;
using GiftKnacksProject.Api.Dto.Dtos.Wishes;

namespace GiftKnackNotificationAgent.Models.Infos
{
    public class TotalClosedInfo: BaseNotificationInfo
    {
        public TinyProfileDto WishOwner { get; set; }
        public BasicWishGiftDto ClosedWish { get; set; }

    }
}
