using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Services.Interfaces;
using GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities;
using GiftKnacksProject.Api.Services.Services.FeedService.ResultActivities;
using Stream;

namespace GiftKnacksProject.Api.Services.Services.FeedService
{
    public class FeedService : IFeedService
    {
        private readonly IActivityFactory _activityFactory;
        private StreamClient _streamClient;

        public FeedService(IActivityFactory activityFactory)
        {
            _activityFactory = activityFactory;
            _streamClient = new StreamClient("gmj9wtcfuwng", "9fcw6uq5ktmjc5c7fjwkb3pdapgrm2eb9n5z43m35w3vwak4w3guqtyfj4yvujkx");
        }

        public  Task AddActivityFeed(BaseInActivity insertedActivity)
        {
            var userFeed = insertedActivity.CreateFeed(_streamClient);
            return userFeed.AddActivity(insertedActivity.BuildStreamNetActivity());
        }

        public async Task<IEnumerable<BaseOutActivity>> GetLenta(long userId)
        {
            var userFeed = _streamClient.Feed("user", userId.ToString());
            var activities=await userFeed.GetActivities();
            var resultList = new List<BaseOutActivity>();
            foreach (var activity in activities)
            {
                resultList.Add(await _activityFactory.GetActivity(activity));
            }
            return resultList;
        }
    }
}
