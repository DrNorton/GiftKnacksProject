using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities;
using GiftKnacksProject.Api.Services.Services.FeedService.ResultActivities;
using Stream;

namespace GiftKnacksProject.Api.Services.Interfaces
{
    public interface IFeedService
    {
        Task AddActivityFeed(BaseInActivity activity);
        Task<IEnumerable<BaseOutActivity>> GetLenta(long userId);
    }
}