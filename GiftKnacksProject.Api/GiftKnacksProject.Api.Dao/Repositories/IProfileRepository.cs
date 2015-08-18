using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos;
using GiftKnacksProject.Api.Dto.Dtos.Profile;

namespace GiftKnacksProject.Api.Dao.Repositories
{
    public interface IProfileRepository
    {
        Task<ProfileDto> GetProfile(long userId);
        Task UpdateProfile(ProfileDto profile);
        Task<ShortProfileDto> GetShortProfile(long userId);
    }
}