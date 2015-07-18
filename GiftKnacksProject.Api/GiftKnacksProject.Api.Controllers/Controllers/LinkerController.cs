using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/linker")]
    [EnableCors(origins: "http://giftknacksproject.azurewebsites.net", headers: "*", methods: "*")]
    public class LinkerController:CustomApiController
    {
        private readonly ILinkRepository _linkRepository;

        public LinkerController(ILinkRepository linkRepository)
        {
            _linkRepository = linkRepository;
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("link")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> LinkWithGift(WishGiftLinkDto participantDto)
        {
            var userId = long.Parse(User.Identity.GetUserId());
            await _linkRepository.LinkWithGift(userId, participantDto.WishId,participantDto.GiftId);
            return EmptyApiResult();
        }

       
    }
}
