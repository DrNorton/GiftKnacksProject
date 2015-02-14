using System.Collections.Generic;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dto.Dtos;

namespace GiftKnacksProject.Api.EfDao.Base
{
    public interface ICountryRepository
    {
        Task<IEnumerable<CountryDto>> GetAllCountries();
    }
}