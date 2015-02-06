using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos;

namespace GiftKnacksProject.Api.EfDao
{
    public interface IProfileRepository
    {
        Task<ProfileDto> GetProfile(long userId);
        Task UpdateProfile(ProfileDto profile);
    }
}