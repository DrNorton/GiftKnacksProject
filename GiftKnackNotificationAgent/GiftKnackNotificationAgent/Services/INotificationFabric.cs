using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnackNotificationAgent.Models;

namespace GiftKnackNotificationAgent.Services
{
    public interface INotificationFabric
    {
        Task<Notification> CreateNotification(string type,IDictionary<string,object> properties );
    }
}