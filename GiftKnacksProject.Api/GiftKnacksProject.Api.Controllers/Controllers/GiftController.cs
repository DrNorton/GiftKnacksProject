using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Controllers.Models;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;
using GiftKnacksProject.Api.EfDao;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/gift")]
    [EnableCors(origins: "http://giftknacksproject.azurewebsites.net", headers: "*", methods: "*")]
    public class GiftController:CustomApiController
    {
        private readonly IGiftRepository _giftRepository;

        public GiftController(IGiftRepository giftRepository)
        {
            _giftRepository = giftRepository;
        }

        //[System.Web.Http.Authorize]
        [System.Web.Http.Route("Getall")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetAll(FilterDto filter)
        {
            var result=await _giftRepository.GetGifts(filter);
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
            var result = await _giftRepository.GetGift(id.Id);
            if (result == null)
            {
                return ErrorApiResult(300, "Не найден");
            }
            return SuccessApiResult(result);
        }


        [System.Web.Http.Route("Insert100")]
        [System.Web.Http.HttpGet]

        public async Task<IHttpActionResult> Insert100()
        {
            var userId = 167;
            for (int i = 0; i < 200; i++)
            {
                _giftRepository.AddGift(userId, new GiftDto() { Benefit = "1232", City = "Pechora City", Country = new CountryDto() { Code = "RU" }, Description = "test", FromDate = DateTime.Now, ToDate = DateTime.Now.AddHours(15), Location = "here", Name = "test"+i});
                Debug.WriteLine(i);
            }
           
            return EmptyApiResult();
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("GetEmptyGift")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetEmptyGift()
        {
            var userId = long.Parse(User.Identity.GetUserId());
            var emptyWish = await _giftRepository.GetEmptyDtoWithAdditionalInfo(userId);

            return SuccessApiResult(emptyWish);
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("AddGift")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> AddGift(GiftDto gift)
        {
            var userId = long.Parse(User.Identity.GetUserId());
         
             _giftRepository.AddGift(userId, gift);
            return EmptyApiResult();
        }
    }
}
