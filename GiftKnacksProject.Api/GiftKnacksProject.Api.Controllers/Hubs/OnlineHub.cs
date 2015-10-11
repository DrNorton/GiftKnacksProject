using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Services.Interfaces;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace GiftKnacksProject.Api.Controllers.Hubs
{
    [HubName("onlinehub")]
    public class OnlineHub:Hub
    {
        private readonly IUserOnlineStorage _userOnlineStorage;

        public OnlineHub(IUserOnlineStorage userOnlineStorage)
        {
            _userOnlineStorage = userOnlineStorage;
        }


        public override Task OnConnected()
        {
            Groups.Add(Context.ConnectionId, "users");
            var clientId = GetClientId();
            _userOnlineStorage.AddUserToOnline(clientId);
            var context = GlobalHost.ConnectionManager.GetHubContext<OnlineHub>();
         
            return null;
        }
        [Authorize]
        public Task<int> GetUserOnline()
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<OnlineHub>();
            return Task.FromResult(4);
        } 

        public override Task OnReconnected()
        {
            var clientId = GetClientId();
            _userOnlineStorage.AddUserToOnline(clientId);

            Groups.Add(Context.ConnectionId, "users");
            var context = GlobalHost.ConnectionManager.GetHubContext<OnlineHub>();
            return null;
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            Groups.Remove(Context.ConnectionId, "users");
            var clientId = GetClientId();
            _userOnlineStorage.RemoveUserFromOnline(clientId);
            var context = GlobalHost.ConnectionManager.GetHubContext<OnlineHub>();
            return null;
        }

        private long GetClientId()
        {
           var strId= Context.User.Identity.GetUserId();
            return long.Parse(strId);
        }
    }
}
