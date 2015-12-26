using Newtonsoft.Json;

namespace GiftKnacksProject.Api.Services.Services.FeedService.ResultActivities
{
    public abstract class BaseActivityInfo
    {
        [JsonIgnore]
        public abstract string Action { get; }
        public UserInfo User { get; set; }
        public string TargetType { get; set; }
        public WishOrGiftInfo Target { get; set; }
    }
}
