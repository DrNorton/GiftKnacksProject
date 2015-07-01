using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;
using GiftKnacksProject.Api.Dto.Dtos.Wishes;
using GiftKnacksProject.Api.EfDao.Base;
using Itenso.TimePeriod;

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


        public async Task<IEnumerable<GiftDto>> GetGift(GiftFilterDto filter)
        {
            IQueryable<Gift> query = Db.Set<Gift>().AsQueryable();
            if (!String.IsNullOrEmpty(filter.Keyword))
            {
                query=query.Where(x => x.Name.Contains(filter.Keyword));
            }

            if (filter.Country!=null)
            {
                query = query.Where(x => x.Country1.Name == filter.Country.Name);
            }
            if (!String.IsNullOrEmpty(filter.City))
            {
                query = query.Where(x => x.Country1.Name.Contains(filter.City));
            }

            //if (!(filter.From == null && filter.To == null))
            //{
            //    query.Where(x=>(x.FromDate<=filter.To ||filter.From==null)&&(x.ToDate==null||x.ToDate>=filter.To));
            //}
            

         
            
            query=query.OrderBy(x=>x.Name).Skip(filter.Offset).Take(filter.Length);
        
            return query.Select(x => new GiftDto()
            {
                Country = new CountryDto() { Code = x.Country1.Id, Name = x.Country1.Name },
                Description = x.Description,
                Benefit = x.Benefit,
                City = x.City,
                FromDate = x.FromDate,
                ToDate = x.ToDate,
                Location = x.Location,
                Name = x.Name

            }).ToList();

        }


        private bool CheckIntersectPeriods(Gift gift,DateTime from,DateTime to)
        {
           
            var giftRange=new TimeRange((DateTime)gift.FromDate,(DateTime)gift.ToDate);
            var findRange = new TimeRange((DateTime) gift.FromDate, (DateTime) gift.ToDate);
            return giftRange.IntersectsWith(findRange);

        }
    }
}
