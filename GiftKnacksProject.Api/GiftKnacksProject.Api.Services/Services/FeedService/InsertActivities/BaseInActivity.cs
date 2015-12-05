using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Helpers.Utils;
using Stream;

namespace GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities
{
    public abstract class BaseInActivity
    {
        public FeedType FeedType { get; set; }
        public long FeedId { get; set; }

        public BaseInActivity()
        {
            FeedType=FeedType.Flat;
        }
        public abstract Activity BuildStreamNetActivity();

        public StreamFeed CreateFeed(StreamClient streamClient)
        {
            return streamClient.Feed("user", FeedId.ToString());
        }
    }

    public enum FeedType
    {
        [StringValue("flat")]
        Flat,
        [StringValue("aggregated")]
        Aggregated
    }
}
