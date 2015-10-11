using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace GiftKnacksProject.Api.Controllers.Hubs
{
    public class OnlineHub:Hub
    {
        private int _userCount;

        public override Task OnConnected()
        {
            _userCount++;
            var context = GlobalHost.ConnectionManager.GetHubContext<OnlineHub>();
            context.Clients.All.online(_userCount);
        }

        public override Task OnReconnected()
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<OnlineHub>();
            context.Clients.All.online(_userCount);
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            _userCount--;
            var context = GlobalHost.ConnectionManager.GetHubContext<OnlineHub>();
            context.Clients.All.online(_userCount);
        }
    }
}
