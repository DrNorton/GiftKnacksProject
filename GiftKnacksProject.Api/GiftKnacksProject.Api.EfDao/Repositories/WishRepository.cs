using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos;
using GiftKnacksProject.Api.Dto.Dtos.Wishes;
using GiftKnacksProject.Api.EfDao.Base;

namespace GiftKnacksProject.Api.EfDao.Repositories
{
    public class WishRepository:GenericRepository<Wish>, IWishRepository
    {
         public WishRepository(EfContext context)
            : base(context)
        {

        }
        public async Task<IEnumerable<WishDto>> GetUserWishes(long userId)
        {
            return Db.Set<Wish>().Where(x => x.UserId == userId).Select(x => new WishDto()
            {
                Benefit = x.Benefit,
                Category =x.WishCategory.Name,
                City = x.City,
                Country = new CountryDto() { Code = x.Country1.Id,Name = x.Country1.Name},
                Description = x.Description,
                FromDate = x.FromDate,
                ToDate = x.ToDate,
                ImageUrl = x.ImageUrl,
                Location = x.Location,
                Emergency = x.Emergency,
                Name = x.Name
            }).ToList();
        }

        public async Task<EmptyWishDto> GetEmptyDtoWithAdditionalInfo(long userId)
        {
            var profile = Db.Set<Profile>().FirstOrDefault(x=>x.Id==userId);
            var wishCategories = Db.Set<WishCategory>().Select(x=>new WishCategoryDto(){Description = x.Description,Name = x.Name}).ToList();
          
            return new EmptyWishDto(){Country = new CountryDto(){Code = profile.Country1.Id,Name = profile.Country1.Name},
                WishCategories = wishCategories,
                FromDate = DateTime.Now,
                City = profile.City};
        }

        public async void AddWish(long userId,WishDto wish)
        {
            var category = Db.Set<WishCategory>().FirstOrDefault(x => x.Name == wish.Category);
            var country = Db.Set<Country>().FirstOrDefault(x => x.Id == wish.Country.Code);
            base.Insert(new Wish()
            {
                Benefit = wish.Benefit,
                WishCategory = category,
                City = wish.City,
                Country1 = country,
                Description = wish.Description,
                FromDate = wish.FromDate,
                ToDate = wish.ToDate,
                ImageUrl = wish.ImageUrl,
                UserId = userId,
                Emergency = wish.Emergency,
                Name = wish.Name
                
            });
            base.Save();
        }


        public async Task<IEnumerable<WishDto>> GetWishes(Dto.Dtos.Gifts.FilterDto filter)
        {
            IQueryable<Wish> query = Db.Set<Wish>().AsQueryable();
            if (filter != null)
            {

                if (!String.IsNullOrEmpty(filter.Keyword))
                {
                    query = query.Where(x => x.Name.Contains(filter.Keyword));
                }

                if (filter.Country != null)
                {
                    query = query.Where(x => x.Country1.Name == filter.Country.Name);
                }
                if (!String.IsNullOrEmpty(filter.City))
                {
                    query = query.Where(x => x.Country1.Name.Contains(filter.City));
                }

                if (!(filter.From == null && filter.To == null))
                {
                    query.Where(x => (x.FromDate <= filter.To) && (x.FromDate >= filter.From));
                }
            }



            query = query.OrderBy(x => x.Name).Skip(filter.Offset).Take(filter.Length);

            return query.Select(x => new WishDto()
            {
                Country = new CountryDto() { Code = x.Country1.Id, Name = x.Country1.Name },
                City = x.City,
                FromDate = x.FromDate,
                ToDate = x.ToDate,
                Name = x.Name,
                Id = x.Id

            }).ToList();
        }

        public Task<WishDto> GetWish(long id)
        {
            var findedGift = Db.Set<Wish>().Find(id);
            if (findedGift != null)
            {
                var dto = new WishDto()
                {
                    Country = new CountryDto() { Code = findedGift.Country1.Id, Name = findedGift.Country1.Name },
                    Description = findedGift.Description,
                    Benefit = findedGift.Benefit,
                    City = findedGift.City,
                    FromDate = findedGift.FromDate,
                    ToDate = findedGift.ToDate,
                    Location = findedGift.Location,
                    Name = findedGift.Name,
                    Emergency = findedGift.Emergency,
                    ImageUrl = findedGift.ImageUrl,
                    Category = findedGift.WishCategory.Name,
                    Creator = new CreatorDto() { AvatarUrl = findedGift.User.Profile.AvatarUrl, CreatorId = findedGift.User.Id, FirstName = findedGift.User.Profile.FirstName, LastName = findedGift.User.Profile.LastName }
                };

                return Task.FromResult(dto);
            }
            else
            {
                return Task.FromResult(default(WishDto));
            }
            
        }
    }
}
