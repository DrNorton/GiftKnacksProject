using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;
using GiftKnacksProject.Api.Dto.Dtos.Wishes;

namespace GiftKnacksProject.Api.Dao.Repositories
{
    public interface IWishRepository
    {
        Task<IEnumerable<WishDto>> GetUserWishes(long userId);
        Task<EmptyWishDto> GetEmptyDtoWithAdditionalInfo(long userId);
        void AddWish(long userId,WishDto wish);
        Task<IEnumerable<WishDto>> GetWishes(FilterDto filter);
        Task<WishDto> GetWish(long id);
    }
}