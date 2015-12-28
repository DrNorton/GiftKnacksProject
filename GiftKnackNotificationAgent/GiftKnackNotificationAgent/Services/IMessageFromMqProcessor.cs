using System.Threading.Tasks;
using Microsoft.ServiceBus.Messaging;

namespace GiftKnackNotificationAgent.Services
{
    public interface IMessageFromMqProcessor
    {
        Task ProcessMessage(BrokeredMessage message);
    }
}