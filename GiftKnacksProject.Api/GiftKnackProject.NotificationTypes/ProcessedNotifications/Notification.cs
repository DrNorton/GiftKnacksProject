using System;

namespace GiftKnackProject.NotificationTypes.ProcessedNotifications
{
    public class Notification
    {
        public DateTime Time { get; set; }
        public string Action { get; set; }

        public BaseNotificationInfo Info { get; set; }
    }
}
