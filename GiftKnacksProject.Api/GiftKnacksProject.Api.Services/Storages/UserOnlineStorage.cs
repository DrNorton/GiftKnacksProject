using System.Collections.Generic;
using GiftKnacksProject.Api.Services.Interfaces;

namespace GiftKnacksProject.Api.Services.Storages
{
    public class UserOnlineStorage : IUserOnlineStorage
    {
        private List<long> _usersOnline;

        public UserOnlineStorage()
        {
            _usersOnline=new List<long>();
        }

        public void AddUserToOnline(long id)
        {
            if (_usersOnline.IndexOf(id) == -1)
            {
                _usersOnline.Add(id);
            }
        }

        public void RemoveUserFromOnline(long id)
        {
            if (_usersOnline.IndexOf(id) != -1)
            {
                _usersOnline.Remove(id);
            }
        }

        public bool GetOnlineStatus(long id)
        {
            return (_usersOnline.IndexOf(id) != -1);
        }
    }
}
