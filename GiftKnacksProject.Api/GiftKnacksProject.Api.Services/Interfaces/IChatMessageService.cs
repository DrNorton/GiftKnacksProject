using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnackProject.NotificationTypes.Chat;

namespace GiftKnacksProject.Api.Services.Interfaces
{
    public interface IChatMessageService
    {
        Task SendMessageToQueue(ChatMqMessage mqMessage);
    }
}
