using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnackProject.NotificationTypes.Chat;
using GiftKnacksProject.Api.Services.Interfaces;
using Microsoft.Azure.Documents.Client;
using Microsoft.ServiceBus.Messaging;
using Newtonsoft.Json;

namespace GiftKnacksProject.Api.Services.Services.ChatMessages
{
    public class ChatMessageService: IChatMessageService
    {
        private readonly QueueClient _queueClient;
        private readonly DocumentClient _databaseClient;

        public ChatMessageService(QueueClient chatQueueClient, DocumentClient databaseClient)
        {
            _queueClient = chatQueueClient;
            _databaseClient = databaseClient;
        }

        public Task SendMessageToQueue(ChatMqMessage mqMessage)
        {
            var message = new BrokeredMessage(JsonConvert.SerializeObject(mqMessage));
            return _queueClient.SendAsync(message);
        }
    }
}
