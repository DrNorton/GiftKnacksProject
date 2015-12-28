using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Services.Services.NotificationsType;

namespace GiftKnacksProject.Api.Services.Interfaces
{
    public interface INotificationService
    {
        Task SentNotificationToQueue(BaseNotification activity);
    }
}