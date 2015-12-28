
using GiftKnackNotificationAgent.Dtos;

namespace GiftKnackNotificationAgent.Models.Infos
{
    public class AddCommentInfo:BaseNotificationInfo
    {
        public string TargetType { get; set; }
        public UserDto User { get; set; }

    }
}
