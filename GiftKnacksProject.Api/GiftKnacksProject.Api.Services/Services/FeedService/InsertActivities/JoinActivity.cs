using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Stream;

namespace GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities
{
    public class JoinActivity : BaseInActivity
    {

        public override string Action
        {
            get { return "Join"; }
        }

        public long EntityId { get; set; }
        public long AuthorId { get; set; }
        public override string TargetType { get; set; }

        public override Activity BuildStreamNetActivity()
        {
            var activity = new Activity($"author_id:{AuthorId}", Action, $"{TargetType}:{EntityId}");
            return activity;
        }

    }
}
