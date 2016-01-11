
using GiftKnackNotificationAgent.Dtos;
using GiftKnacksProject.Api.Dto.Dtos.Profile;
using GiftKnacksProject.Api.Dto.Dtos.Wishes;
using Newtonsoft.Json;

namespace GiftKnackNotificationAgent.Models.Infos
{
    public class AddCommentInfo:BaseNotificationInfo
    {
        public string TargetType { get; set; }
        public TinyProfileDto User { get; set; }
        public BasicWishGiftDto Target { get; set; }
    }
}
