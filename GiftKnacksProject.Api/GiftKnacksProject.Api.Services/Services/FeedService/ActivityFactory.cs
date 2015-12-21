using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities;
using GiftKnacksProject.Api.Services.Services.FeedService.ResultActivities;
using Stream;

namespace GiftKnacksProject.Api.Services.Services.FeedService
{
    public interface IActivityFactory
    {
        Task<BaseOutActivity> GetActivity(Activity activity);
    }

    public class ActivityFactory : IActivityFactory
    {
        private readonly IProfileRepository _profileRepository;
        private readonly IWishRepository _wishRepository;
        private readonly IGiftRepository _giftRepository;

        public ActivityFactory(IProfileRepository profileRepository,IWishRepository wishRepository,IGiftRepository giftRepository)
        {
            _profileRepository = profileRepository;
            _wishRepository = wishRepository;
            _giftRepository = giftRepository;
        }

        public Task<BaseOutActivity> GetActivity(Activity activity)
        {
            switch (activity.Verb)
            {
                case "addComment":
                    return CreateCommentActivity(activity);
                    break;

                case "Join":
                    return CreateJoinActivity(activity);
                    break;
            }

            return Task.FromResult(new BaseOutActivity() {Info = new AddCommentInfo()});
        }

        private async Task<BaseOutActivity> CreateJoinActivity(Activity activity)
        {
            var joinOutActivity = new BaseOutActivity();
            var parts = activity.Actor.Split(new char[] { ':' });
            joinOutActivity.Info = new JoinInfo();
            var objectsParts = activity.Object.Split(new char[] { ':' });
            var shortProfile = await _profileRepository.GetShortProfile(long.Parse(parts[1]));
            joinOutActivity.Info.User = new UserInfo() { FirstName = shortProfile.FirstName, Id = shortProfile.Id, LastName = shortProfile.LastName };
            joinOutActivity.Info.TargetType = objectsParts[0];
            if (joinOutActivity.Info.TargetType == "wish")
            {
                var wish = await _wishRepository.GetWish(long.Parse(objectsParts[1]));
                joinOutActivity.Info.Target = new WishOrGiftInfo() { Id = wish.Id, Title = wish.Name };
            }
            else
            {
                var gift = await _giftRepository.GetGift(long.Parse(objectsParts[1]));
                joinOutActivity.Info.Target = new WishOrGiftInfo() { Id = gift.Id, Title = gift.Name };
            }

            joinOutActivity.Time = activity.Time;
            return joinOutActivity;
        }

        private async Task<BaseOutActivity> CreateCommentActivity(Activity activity)
        {
            var comment= new BaseOutActivity();
            var parts=activity.Actor.Split(new char[] {':'});
            comment.Info=new AddCommentInfo();
            var objectsParts = activity.Object.Split(new char[] {':'});
            var shortProfile = await _profileRepository.GetShortProfile(long.Parse(parts[1]));
            comment.Info.User =new UserInfo() {FirstName = shortProfile.FirstName,Id = shortProfile.Id,LastName = shortProfile.LastName};
            comment.Info.TargetType = objectsParts[0];
            if (comment.Info.TargetType == "wish")
            {
                var wish= await _wishRepository.GetWish(long.Parse(objectsParts[1]));
                comment.Info.Target=new WishOrGiftInfo() {Id = wish.Id,Title = wish.Name};
            }
            else
            {
               var gift = await _giftRepository.GetGift(long.Parse(objectsParts[1]));
                comment.Info.Target = new WishOrGiftInfo() { Id = gift.Id, Title = gift.Name };
            }

            comment.Time = activity.Time;
            return comment;
        }
    }
}
