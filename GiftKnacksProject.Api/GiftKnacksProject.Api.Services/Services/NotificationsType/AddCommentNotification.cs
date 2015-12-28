using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos.Comments;

namespace GiftKnacksProject.Api.Services.Services.NotificationsType
{
    public abstract class AddCommentNotification: UserGeneratedNotification
    {
        public override string Type { get { return "AddComment"; } }
        public long TargetId { get; set; }
        public abstract string TargetType { get; }
        public long CommentId { get; set; }
    }

}
