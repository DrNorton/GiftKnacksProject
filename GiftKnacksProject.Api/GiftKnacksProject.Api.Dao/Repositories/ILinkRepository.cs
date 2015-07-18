using System.Threading.Tasks;

namespace GiftKnacksProject.Api.Dao.Repositories
{
    public interface ILinkRepository
    {
        Task LinkWithGift(long userId, long wishId, long giftId);
    }
}