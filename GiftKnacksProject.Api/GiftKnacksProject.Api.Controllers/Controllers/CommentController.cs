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
using GiftKnacksProject.Api.Services.Services.NotificationsType;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/Comment")]
    public class CommentController : CustomApiController
    {
        private readonly ICommentRepository _commentRepository;
        private readonly INotificationService _service;
        private readonly INotificationService _notificationService;

        public CommentController(ICommentRepository commentRepository,INotificationService service,INotificationService notificationService)
        {
            _commentRepository = commentRepository;
            _service = service;
            _notificationService = notificationService;
        }

        //[System.Web.Http.Authorize]
        [System.Web.Http.Route("addtoWish")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> AddCommentToWish(AddCommentToWishDto model)
        {
            var userId = long.Parse(User.Identity.GetUserId());
            var insertedComment=await  _commentRepository.AddCommentToWish(model.WishId, userId, model.Text, model.ParentCommentId);
           
            await
                _notificationService.SentNotificationToQueue(new AddCommentToWishNotification()
                {
                    TargetId = model.WishId,
                    CreatorId = userId,
                    CommentId=insertedComment.Id
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
