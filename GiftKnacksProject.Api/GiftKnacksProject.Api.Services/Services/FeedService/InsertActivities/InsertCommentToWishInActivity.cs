using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Stream;

namespace GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities
{
    public class InsertCommentToWishInActivity:BaseInActivity
    {
        public long CommentUserId { get; set; }

        public long WishId { get; set; }

        public override Activity BuildStreamNetActivity()
        {
            var activity = new Activity($"author_id:{CommentUserId}", "addComment", $"wish:{WishId}");
            return activity;
        }
    }
}
