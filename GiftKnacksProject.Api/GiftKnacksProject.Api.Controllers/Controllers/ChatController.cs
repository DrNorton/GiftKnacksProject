using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using GiftKnackProject.NotificationTypes.Chat;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Dto.Dtos.Chat;
using GiftKnacksProject.Api.Dto.Dtos.Gifts;
using GiftKnacksProject.Api.Services.Interfaces;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/Chat")]
    [EnableCors(origins: "http://giftknackapi.azurewebsites.net", headers: "*", methods: "*")]
    public class ChatController : CustomApiController
    {
        private readonly IChatMessageService _chatMessageService;

        public ChatController(IChatMessageService chatMessageService)
        {
            _chatMessageService = chatMessageService;
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("send")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> Send(SendToChatMessageDto newChatMessage)
        {
            var currentUser = long.Parse(User.Identity.GetUserId());
            newChatMessage.From = currentUser;
            await
                _chatMessageService.SendMessageToQueue(new ChatMqMessage()
                {
                    From = newChatMessage.From,
                    Message = newChatMessage.Message,
                    To = newChatMessage.To
                });

            return SuccessApiResult(currentUser);
        }

    }
}
