using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnackNotificationAgent.Models;
using GiftKnackNotificationAgent.Models.Infos;
using GiftKnacksProject.Api.Dao.Repositories;

namespace GiftKnackNotificationAgent.Services
{
    public class NotificationFabric : INotificationFabric
    {
        private readonly IWishRepository _wishRepository;
        private readonly IProfileRepository _profileRepository;

        public NotificationFabric(IWishRepository wishRepository,IProfileRepository profileRepository)
        {
            _wishRepository = wishRepository;
            _profileRepository = profileRepository;
        }

        public async Task<Notification> CreateNotification(string type,IDictionary<string,object> properties )
        {
            var notification=new Notification();
            notification.Action = properties["Type"].ToString();
            notification.Time = (DateTime)properties["NotificationTime"];
            switch (type)
            {
                case "addcomment":
                   notification.Info=await FillAddComment(properties);
                    break;
            }
            return notification;
        }

        private async Task<BaseNotificationInfo> FillAddComment(IDictionary<string, object> properties)
        {
            var creatorId = (long)properties["CreatorId"];
            var user = await _profileRepository.GetShortProfile(creatorId);
            return new AddCommentInfo() {TargetType = properties["TargetType"].ToString()};
        }
    }
}
