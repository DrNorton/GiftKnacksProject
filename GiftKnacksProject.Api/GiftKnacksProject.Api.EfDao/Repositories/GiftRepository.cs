using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;
using GiftKnacksProject.Api.Dto.Dtos.Wishes;
using GiftKnacksProject.Api.EfDao.Base;

namespace GiftKnacksProject.Api.EfDao.Repositories
{
    public class GiftRepository : GenericRepository<Gift>, IGiftRepository
    {
        public GiftRepository(EfContext context)
            : base(context)
        {

        }
        public async Task<IEnumerable<GiftDto>> GetUserGifts(long userId)
        {
            return Db.Set<Gift>().Where(x => x.UserId == userId).Select(x => new GiftDto()
            {
               
                Country = new CountryDto() { Code = x.Country1.Id, Name = x.Country1.Name },
               
            }).ToList();
        }

        public async Task<EmptyGiftDto> GetEmptyDtoWithAdditionalInfo(long userId)
        {
          
            return new EmptyGiftDto()
            {

            };
        }

        public async void AddGift(long userId, GiftDto gift)
        {
            var country = Db.Set<Country>().FirstOrDefault(x => x.Id == gift.Country.Code);
  
           base.Insert(new Gift()
            {
                Name = gift.Name,
                Benefit = gift.Benefit,
                City = gift.City,
                Country1=country,
                Description = gift.Description,
                FromDate = gift.FromDate,
                ToDate = gift.ToDate,
                Location = gift.Location,
                UserId = userId
                
            });
            
            base.Save();
        }


        public Task<IEnumerable<GiftDto>> GetGift(GiftFilterDto filter)
        {
           
        }
    }
}
