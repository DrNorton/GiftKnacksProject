using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnackNotificationAgent.Models.Infos;
using GiftKnackNotificationAgent.Services;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.Azure.WebJobs;
using Microsoft.ServiceBus.Messaging;

namespace GiftKnackNotificationAgent
{
    public class Functions
    {
        private readonly IMessageFromMqProcessor _messageFromMqProcessor;
 

        public Functions(IMessageFromMqProcessor messageFromMqProcessor)
        {
            _messageFromMqProcessor = messageFromMqProcessor;
        }

        public  async Task ProcessQueueMessage([ServiceBusTrigger("notifications")] BrokeredMessage message,
      TextWriter logger)
        {
           await _messageFromMqProcessor.ProcessMessage(message);
            await logger.WriteLineAsync("dadad");
        }

      
    }
}
