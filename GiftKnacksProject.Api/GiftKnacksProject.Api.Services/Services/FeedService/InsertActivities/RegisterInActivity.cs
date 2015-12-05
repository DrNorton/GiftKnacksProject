using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Stream;

namespace GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities
{
    public class RegisterInActivity:BaseInActivity
    {
        public const string MessageText = "Пользователь зарегистрирован";
        public long UserId { get; set; }

        public override Activity BuildStreamNetActivity()
        {
            var activity = new Activity(UserId.ToString(),"useregistered",String.Format("{0}:{1}","registered",UserId));
            return activity;
        }
    }
}
