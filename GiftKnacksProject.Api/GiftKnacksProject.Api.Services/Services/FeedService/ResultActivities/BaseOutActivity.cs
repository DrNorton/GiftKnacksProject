using System;

namespace GiftKnacksProject.Api.Services.Services.FeedService.ResultActivities
{
    public  class BaseOutActivity
    {
        public string Action => Info.Action;

        public DateTime? Time { get; set; }

        public BaseActivityInfo Info { get; set; }
      
    }
}
