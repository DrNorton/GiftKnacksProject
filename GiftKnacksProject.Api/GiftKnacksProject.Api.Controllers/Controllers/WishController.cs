using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Dao.Repositories;
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
    }
}
