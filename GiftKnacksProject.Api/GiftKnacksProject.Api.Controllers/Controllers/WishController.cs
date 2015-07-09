using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Controllers.Models;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;
using GiftKnacksProject.Api.Dto.Dtos.Wishes;
using GiftKnacksProject.Api.EfDao.Base;
using GiftKnacksProject.Api.Services.Interfaces;
using GiftKnacksProject.Api.Services.Services;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/Wish")]
    [EnableCors(origins: "http://giftknacksproject.azurewebsites.net", headers: "*", methods: "*")]
    public class WishController : CustomApiController
    {
        private readonly IWishRepository _wishRepository;
 
        private readonly IFileService _fileService;

        public WishController(IWishRepository wishRepository,ICountryRepository countryRepository,IFileService fileService)
        {
            _wishRepository = wishRepository;
            _fileService = fileService;
        }

        [System.Web.Http.Route("Getall")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetAll(FilterDto filter)
        {
            var result = await _wishRepository.GetWishes(filter);
            return SuccessApiResult(result);
        }

        [System.Web.Http.Route("Get")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> Get(IdModel id)
        {
            if (id == null)
            {
                return ErrorApiResult(300, "Не передан id.Либо левый формат");
            }
            var result = await _wishRepository.GetWish(id.Id);
            if (result == default(WishDto))
            {
                return ErrorApiResult(300, "Не найден");
            }
            return SuccessApiResult(result);
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("GetMyWishes")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetMyWishes()
        {
            var userId = long.Parse(User.Identity.GetUserId());
            var wishes=await _wishRepository.GetUserWishes(userId);
            return SuccessApiResult(wishes);
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("GetEmptyWish")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetEmptyWish()
        {
            var userId = long.Parse(User.Identity.GetUserId());
            var emptyWish = await _wishRepository.GetEmptyDtoWithAdditionalInfo(userId);
            
            return SuccessApiResult(emptyWish);
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("AddWish")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> AddWish(ImagedWishDto wish)
        {
            var userId = long.Parse(User.Identity.GetUserId());
            if (wish.Image != null)
            {
                wish.ImageUrl = _fileService.SaveBase64FileReturnUrl(FileType.Image, wish.Image.Type, wish.Image.Result);
            }
             _wishRepository.AddWish(userId,wish);
            return EmptyApiResult();
        }


        [System.Web.Http.Authorize]
        [System.Web.Http.Route("addparticipant")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> AddParticipant(WishIdDto participantDto)
        {
            var userId = long.Parse(User.Identity.GetUserId());
            await _wishRepository.AddParticipiantToGift(userId, participantDto.WishId);
            return EmptyApiResult();
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("getallparticipiants")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetAllParticipiants(WishIdDto participantDto)
        {
            var userId = long.Parse(User.Identity.GetUserId());
            var participiants=await _wishRepository.GetParticipiants(participantDto.WishId);
            return SuccessApiResult(participiants);
        }
    }
}
