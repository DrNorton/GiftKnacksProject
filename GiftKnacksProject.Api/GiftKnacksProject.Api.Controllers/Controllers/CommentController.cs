using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Controllers.Models;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Dtos.Comments;
using GiftKnacksProject.Api.Services.Interfaces;
using GiftKnacksProject.Api.Services.Services.FeedService.InsertActivities;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/Comment")]
    public class CommentController : CustomApiController
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IFeedService _service;
        private readonly IFeedService _feedService;

        public CommentController(ICommentRepository commentRepository,IFeedService service,IFeedService feedService)
        {
            _commentRepository = commentRepository;
            _service = service;
            _feedService = feedService;
        }

        //[System.Web.Http.Authorize]
        [System.Web.Http.Route("addtoWish")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> AddCommentToWish(AddCommentToWishDto model)
        {
            var userId = long.Parse(User.Identity.GetUserId());
            var insertedComment=await  _commentRepository.AddCommentToWish(model.WishId, userId, model.Text, model.ParentCommentId);
            var wishOwner = await _commentRepository.GetOwnerWish(model.WishId);
            await
                _feedService.AddActivityFeed(new InsertCommentToEntityInActivity()
                {
                    CommentUserId = userId,
                    Id = model.WishId,
                    FeedId = wishOwner,
                    TargetType = "wish"
                });
            return SuccessApiResult(insertedComment);
        }

        

        [System.Web.Http.Route("addtoGift")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> AddCommentToGift(AddCommentToGiftDto model)
        {
            var userId = long.Parse(User.Identity.GetUserId());
            var insertedComment = await _commentRepository.AddCommentToGift(model.GiftId, userId, model.Text, model.ParentCommentId);
            var ownerId= await _commentRepository.GetOwnerGift(model.GiftId);
            await
              _feedService.AddActivityFeed(new InsertCommentToEntityInActivity()
              {
                  CommentUserId = userId,
                  Id = model.GiftId,
                  FeedId = ownerId,
                  TargetType = "gift"
              });
            return SuccessApiResult(insertedComment);
        }

        [System.Web.Http.Route("getbywishid")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetByWishId(GetCommentsDto idModel)
        {
           return SuccessApiResult(await _commentRepository.GetCommentListByWishId(idModel));
        }

        [System.Web.Http.Route("getbygiftid")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetByGiftId(GetCommentsDto idModel)
        {
            return SuccessApiResult(await _commentRepository.GetCommentListByGiftId(idModel));
        }

    }
}
