using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnackProject.NotificationTypes.Chat;
using Microsoft.ServiceBus.Messaging;
using Newtonsoft.Json;

namespace GiftKnackMessageAgent.Services
{
    public class ChatMessageFromMqProcessor : IChatMessageFromMqProcessor
    {
        public Task ProcessMessage(BrokeredMessage brokeredMessage)
        {
            var body = brokeredMessage.GetBody<string>();
            var message = JsonConvert.DeserializeObject<ChatMqMessage>(body);
            
            return null;
        }
    }
}
