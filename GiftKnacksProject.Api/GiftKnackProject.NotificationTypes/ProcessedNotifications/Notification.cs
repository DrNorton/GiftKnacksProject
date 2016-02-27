using System;

namespace GiftKnackProject.NotificationTypes.ProcessedNotifications
{
    public class Notification
    {
        public DateTime Time { get; set; }
        public string Action { get; set; }

        public long TargetUserId
        {
            get { return Info.OwnerId; }
        }


        public BaseNotificationInfo Info { get; set; }
    }
}
