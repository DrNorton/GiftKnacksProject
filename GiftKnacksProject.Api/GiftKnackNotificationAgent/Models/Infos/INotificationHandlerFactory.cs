using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnackProject.NotificationTypes;

namespace GiftKnackNotificationAgent.Models.Handlers
{
    public interface INotificationHandlerFactory
    {
        IBaseNotificationHandler<TInputMessage> Resolve<TInputMessage>() where TInputMessage : BaseQueueNotification;
    }
}
