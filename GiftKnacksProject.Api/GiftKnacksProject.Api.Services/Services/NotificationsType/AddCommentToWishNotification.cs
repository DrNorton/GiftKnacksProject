using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GiftKnacksProject.Api.Services.Services.NotificationsType
{
    public class AddCommentToWishNotification:AddCommentNotification
    {
        public override string TargetType => "wish";
    }
}
