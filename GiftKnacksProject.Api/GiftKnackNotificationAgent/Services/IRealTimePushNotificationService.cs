using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnackNotificationAgent.Models;
using GiftKnackProject.NotificationTypes.ProcessedNotifications;

namespace GiftKnackNotificationAgent.Services
{
    public interface IRealTimePushNotificationService
    {
        Task SentRealTimeMessages(IEnumerable<Notification> notifications);
    }
}