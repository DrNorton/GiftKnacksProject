using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;

namespace GiftKnacksProject.Api.Dao.Repositories
{
    public interface IGiftRepository
    {
        Task<IEnumerable<GiftDto>> GetUserGifts(long userId);
        Task<EmptyGiftDto> GetEmptyDtoWithAdditionalInfo(long userId);
        Task<long> AddGift(long userId, GiftDto gift);
        Task<IEnumerable<GiftDto>> GetGifts(FilterDto filter);
        Task<GiftDto> GetGift(long id);
    }
}