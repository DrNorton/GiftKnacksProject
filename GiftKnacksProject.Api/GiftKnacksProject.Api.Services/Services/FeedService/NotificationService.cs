using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Services.Interfaces;
using GiftKnacksProject.Api.Services.Services.NotificationsType;
using Microsoft.ServiceBus.Messaging;
using Microsoft.WindowsAzure;


namespace GiftKnacksProject.Api.Services.Services.FeedService
{
    public class NotificationService : INotificationService
    {
        private QueueClient _client;


        public NotificationService(QueueClient client)
        {
            _client = client;
        }

        public  Task SentNotificationToQueue(BaseNotification notification)
        {
            return _client.SendAsync(notification.CreateMessage());
        }

    }
}
