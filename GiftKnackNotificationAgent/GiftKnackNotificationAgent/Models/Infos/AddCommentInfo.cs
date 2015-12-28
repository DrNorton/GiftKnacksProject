using GiftKnacksProject.Api.Dto.Dtos.Profile;

namespace GiftKnackNotificationAgent.Models.Infos
{
    public class AddCommentInfo:BaseNotificationInfo
    {
        public string TargetType { get; set; }
        public TinyProfileDto User { get; set; }

    }
}
