using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Helpers.Utils;
using Microsoft.ServiceBus.Messaging;

namespace GiftKnacksProject.Api.Services.Services.NotificationsType
{
    public abstract class BaseNotification
    {
        private DateTime _notificationTime;

        public DateTime NotificationTime
        {
            get { return _notificationTime; }
          
        }

        public abstract string Type { get; }
        //Кому адресовано сообщение

        public BaseNotification()
        {
            _notificationTime=DateTime.Now;
        }

        public BrokeredMessage CreateMessage()
        {
            var message = new BrokeredMessage();
           foreach (var property in GetProperties())
            {
                message.Properties.Add(property);
            }
            return message;
        }

        protected IDictionary<string, object> GetProperties()
        {
            var dict= this.AsDictionary();
            return dict;
        }
    }
}
