﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;
using GiftKnacksProject.Api.Services.Interfaces;
using GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/linker")]
    [EnableCors(origins: "http://giftknackapi.azurewebsites.net", headers: "*", methods: "*")]
    public class LinkerController:CustomApiController
    {
        private readonly ILinkRepository _linkRepository;
        private readonly IFeedService _feedService;

        public LinkerController(ILinkRepository linkRepository,IFeedService feedService)
        {
            _linkRepository = linkRepository;
            _feedService = feedService;
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("link")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> LinkWithGift(WishGiftLinkDto participantDto)
        {
            var userId = long.Parse(User.Identity.GetUserId());
            var ownerWish=await _linkRepository.LinkWithGift(userId, participantDto.WishId,participantDto.GiftId);
            await
              _feedService.AddActivityFeed(new JoinActivity()
              {
                  AuthorId = userId,
                  EntityId = participantDto.WishId,
                  FeedId = ownerWish,
                  TargetType = "gift"
              });
            return EmptyApiResult();
        }

       
    }
}
