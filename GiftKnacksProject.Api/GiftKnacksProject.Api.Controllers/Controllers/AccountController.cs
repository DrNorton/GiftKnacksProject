using System;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Mvc;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Controllers.Models;
using GiftKnacksProject.Api.Dao.AuthUsers;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Users;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/Account")]
    [EnableCors(origins: "http://giftknacksproject.azurewebsites.net", headers: "*", methods: "*")]
    public class AccountController : CustomApiController
    {
        private readonly CustomUserManager _userManager;


        public AccountController(CustomUserManager userManager)
        {
            _userManager = userManager;
        }

        // POST api/Account/Register
        [System.Web.Http.AllowAnonymous]
        [System.Web.Http.Route("Register")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                var errorsMessages=ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1,errorsMessages);
            }


            var user = new ApplicationUser()
            {
                UserName = userModel.Email,
            };

            var result = await _userManager.CreateAsync(user, userModel.Password);

            if (result.Succeeded)
            {
                return EmptyApiResult();
            }
            else
            {
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1, errorsMessages);
            }
            
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("GetOrders")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetOrders()
        {
            return EmptyApiResult();
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _userManager.Dispose();
            }

            base.Dispose(disposing);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return ErrorApiResult(1, "Bad request");
                }
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));

                return ErrorApiResult(100, errorsMessages);
            }

            return null;
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("Profile")]
        [System.Web.Http.HttpGet]
        public async Task<IHttpActionResult> Profile()
        {
            return SuccessApiResult(new UserDto() { 
                AvatarUrl = @"http://forum.navi-gaming.com/avatarz/avatar_31901_1340598250.png",
                DisplayName = "Андрей Козак",
                Email = "dimaivanov1@mail.ru",
            FirstName = "Андрей",
            LastName = "Козак",
            Phone = "+79166728879"});
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1, errorsMessages);
            }
            var name = User.Identity.GetUserName();
            var userId =long.Parse(User.Identity.GetUserId());
           var result=await _userManager.ChangePasswordAsync(userId, model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                return EmptyApiResult();
            }
            else
            {
                return ErrorApiResult(2, result.Errors);
            }
            
            // _authRepository.ChangePassword();


        }
    }
}