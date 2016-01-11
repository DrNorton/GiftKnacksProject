using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos.Profile;
using GiftKnacksProject.Api.Dto.Dtos.Reference;
using GiftKnacksProject.Api.EfDao.Base;

namespace GiftKnacksProject.Api.EfDao.Repositories
{
    public class ReferenceRepository: GenericRepository<Reference>, IReferenceRepository
    {
        private readonly EfContext _context;

        public ReferenceRepository(EfContext context)
            :base(context)
        {
            _context = context;
        }

        public async Task<long> AddReference(long ownerId, long replyerId,byte rate,string text)
        {
            var newReference = new Reference() {OwnerId = ownerId, ReplyerId = replyerId, Text = text, Rate = rate};
            base.Insert(newReference);
            await _context.SaveChangesAsync();
            return newReference.Id;
        }

        public async Task<List<ReferenceDto>> GetByOwnerId(long ownerId)
        {
          
            return (await
                _context.Set<Reference>()
                    .Where(x => x.OwnerId == ownerId).ToListAsync())
                .Select(
                    x =>
                        new ReferenceDto()
                        {
                            OwnerId = x.OwnerId,
                            Rate = x.Rate,
                            ReferenceText = x.Text,
                            Replyer =
                                new TinyProfileDto()
                                {
                                    Id = x.User1.Id,
                                    AvatarUrl = x.User1.Profile.AvatarUrl,
                                    FirstName = x.User1.Profile.FirstName,
                                    LastName = x.User1.Profile.LastName,
                                    AvgRate = CalculateAvg(x.User1.Id),
                                    TotalClosed = Db.Set<Wish>().Count(y => y.WishUserCloserId == x.User1.Id)
                                }
                        }).ToList();

        }

        public Task<ReferenceDto> GetById(long referenceId)
        {
           
                return _context.Set<Reference>()
                    .Where(x => x.Id == referenceId).Select(
                    x =>
                        new ReferenceDto()
                        {
                            OwnerId = x.OwnerId,
                            Rate = x.Rate,
                            ReferenceText = x.Text,
                            Replyer =
                                new TinyProfileDto()
                                {
                                    Id = x.User1.Id,
                                    AvatarUrl = x.User1.Profile.AvatarUrl,
                                    FirstName = x.User1.Profile.FirstName,
                                    LastName = x.User1.Profile.LastName,
                                }
                        }).FirstOrDefaultAsync();
        }

        private double CalculateAvg(long userId)
        {
            var references = Db.Set<Reference>().Where(x => x.OwnerId == userId).ToList();
            if (references.Any())
            {
                var sum = references.Sum(x => x.Rate);
                if (sum != null)
                {

                    double db = (double)sum.Value / (double)references.Count;
                    return db;
                }
                else
                {
                    return 0;
                }

            }
            else
            {
                return 0;
            }

        }
    }
}
