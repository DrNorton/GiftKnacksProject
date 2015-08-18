using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;
using GiftKnacksProject.Api.Dto.Dtos.Links;
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
                Id = x.Id,
                Country = new CountryDto() { Code = x.Country1.Id, Name = x.Country1.Name },
                Description = x.Description,
                Benefit = x.Benefit,
                City = x.City,
                FromDate = x.FromDate,
                ToDate = x.ToDate,
                Location = x.Location,
                Name = x.Name,
                Participants = x.WishGiftLinks.Select(y => new ParticipantDto() { FirstName = y.Wish.User.Profile.FirstName, Id = y.Wish.User.Id, LastName = y.Wish.User.Profile.LastName }),
                
            }).ToList();
        }

        public async Task<EmptyGiftDto> GetEmptyDtoWithAdditionalInfo(long userId)
        {
          
            return new EmptyGiftDto()
            {

            };
        }

        public async Task<long>   AddGift(long userId, GiftDto gift)
        {
            var country = Db.Set<Country>().FirstOrDefault(x => x.Id == gift.Country.Code);
            var status = Db.Set<GiftWishStatus>().FirstOrDefault(x => x.Code.Equals(0));
            var newgift = new Gift()
            {
                Name = gift.Name,
                Benefit = gift.Benefit,
                City = gift.City,
                Country1 = country,
                GiftWishStatus = status,
                Description = gift.Description,
                FromDate = gift.FromDate,
                ToDate = gift.ToDate,
                Location = gift.Location,
                UserId = userId

            };
           base.Insert(newgift);
            
            base.Save();
            return newgift.Id;
        }


        public async Task<IEnumerable<GiftDto>> GetGifts(FilterDto filter)
        {
            IQueryable<Gift> query = Db.Set<Gift>().AsQueryable();
            if (filter != null)
            {

                if (filter.UserId != null)
                {
                    query = query.Where(x => x.UserId == filter.UserId);
                }

                if (!String.IsNullOrEmpty(filter.Keyword))
                {
                    query = query.Where(x => x.Name.Contains(filter.Keyword));
                }

                if (filter.Country != null && filter.Country.Name!=null)
                {
                    query = query.Where(x => x.Country1.Name.Equals(filter.Country.Name,StringComparison.OrdinalIgnoreCase));
                }
                if (!String.IsNullOrEmpty(filter.City))
                {
                    query = query.Where(x => x.City.Contains(filter.City));
                }

                if (!(filter.From == null && filter.To == null))
                {
                    query.Where(x => (x.FromDate <= filter.To) && (x.FromDate >= filter.From));
                }
            }



            query=query.OrderBy(x=>x.Name).Skip(filter.Offset).Take(filter.Length);
        
            return query.Select(x => new GiftDto()
            {
                Country = new CountryDto() { Code = x.Country1.Id, Name = x.Country1.Name },
                City = x.City,
                FromDate = x.FromDate,
                ToDate = x.ToDate,
                Name = x.Name,
                Id=x.Id

            }).ToList();

        }




        public Task<GiftDto> GetGift(long id)
        {
            var findedGift = Db.Set<Gift>().Find(id);
            if (findedGift != null)
            {
                var dto = new GiftDto()
                {
                    Id = findedGift.Id,
                    Country = new CountryDto() {Code = findedGift.Country1.Id, Name = findedGift.Country1.Name},
                    Description = findedGift.Description,
                    Benefit = findedGift.Benefit,
                    City = findedGift.City,
                    FromDate = findedGift.FromDate,
                    ToDate = findedGift.ToDate,
                    Status = new StatusDto(){Code = findedGift.GiftWishStatus.Code,Status = findedGift.GiftWishStatus.Status},
                    Location = findedGift.Location,
                    Name = findedGift.Name,
                    Participants = findedGift.WishGiftLinks.Select(x => new ParticipantDto() {FirstName = x.Wish.User.Profile.FirstName, Id = x.Wish.User.Id, LastName = x.Wish.User.Profile.LastName }),
                    Creator = new CreatorDto() { AvatarUrl = findedGift.User.Profile.AvatarUrl,CreatorId = findedGift.User.Id,FirstName = findedGift.User.Profile.FirstName,LastName = findedGift.User.Profile.LastName}
                };

                return Task.FromResult(dto);
            }
            else
            {
                return Task.FromResult(default(GiftDto));
            }
            
           
        }

      
    }
}
