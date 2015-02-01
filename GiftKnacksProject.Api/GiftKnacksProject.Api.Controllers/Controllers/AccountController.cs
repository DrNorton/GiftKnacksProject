using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Controllers.Entities;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Users;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : CustomApiController
    {
        private readonly IAuthRepository _authRepository;

        public AccountController(IAuthRepository authRepository)
        {
            if (authRepository == null) throw new ArgumentNullException("authRepository");
            _authRepository = authRepository;
        }

        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
         [HttpPost]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                var errorsMessages=ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1,errorsMessages);
            }

            IdentityResult result = await _authRepository.RegisterUser(new CreateUserDto(userModel.Email, userModel.Password));

            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return EmptyApiResult();
        }

        //[AllowAnonymous]
        //public async Task<IHttpActionResult> ConfirmEmail(string Token, string Email)
        //{
        //    ApplicationUser user = this.UserManager.FindById(Token);
        //    if (user != null)
        //    {
        //        if (user.Email == Email)
        //        {
        //            user.ConfirmedEmail = true;
        //            await UserManager.UpdateAsync(user);
        //            await SignInAsync(user, isPersistent: false);
        //            return RedirectToAction("Index", "Home", new { ConfirmedEmail = user.Email });
        //        }
        //        else
        //        {
        //            return RedirectToAction("Confirm", "Account", new { Email = user.Email });
        //        }
        //    }
        //    else
        //    {
        //        return RedirectToAction("Confirm", "Account", new { Email = "" });
        //    }

        //} 

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _authRepository.Dispose();
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

                return ErrorApiResult(100, ModelState.ToString());
            }

            return null;
        }

        [Authorize]
        [Route("Profile")]
        [HttpGet]
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
    }
}