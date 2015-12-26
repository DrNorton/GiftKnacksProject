using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Stream;

namespace GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities
{
    public class InsertCommentToEntityInActivity:BaseInActivity
    {
        public long CommentUserId { get; set; }

        public long Id { get; set; }

        public override string Action
        {
            get { return "addComment"; } 
        }

        public override string TargetType { get; set; }



        public override Activity BuildStreamNetActivity()
        {
            var activity = new Activity($"author_id:{CommentUserId}", Action, $"{TargetType}:{Id}");
            return activity;
        }
    }
}
