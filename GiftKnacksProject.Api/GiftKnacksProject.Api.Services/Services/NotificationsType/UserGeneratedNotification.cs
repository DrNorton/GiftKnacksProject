using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GiftKnacksProject.Api.Services.Services.NotificationsType
{
    public abstract class UserGeneratedNotification:BaseNotification
    {
        public long CreatorId { get; set; }
    }
}
