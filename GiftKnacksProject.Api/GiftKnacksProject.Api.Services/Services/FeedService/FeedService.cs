using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Services.Interfaces;
using GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities;
using Stream;

namespace GiftKnacksProject.Api.Services.Services.FeedService
{
    public class FeedService : IFeedService
    {
        private StreamClient _streamClient;

        public FeedService()
        {
            _streamClient = new StreamClient("gmj9wtcfuwng", "9fcw6uq5ktmjc5c7fjwkb3pdapgrm2eb9n5z43m35w3vwak4w3guqtyfj4yvujkx");
        }
        public  Task AddActivityFeed(BaseInActivity insertedActivity)
        {
            var userFeed = insertedActivity.CreateFeed(_streamClient);
            return userFeed.AddActivity(insertedActivity.BuildStreamNetActivity());
        }

        public Task<IEnumerable<Activity>> GetLenta(long userId)
        {
            var userFeed = _streamClient.Feed("user", userId.ToString());
            return  userFeed.GetActivities();
        }
    }
}
