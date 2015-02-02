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

using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.Users;
using Microsoft.AspNet.Identity;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/Account")]
    [EnableCors(origins: "http://giftknacksproject.azurewebsites.net", headers: "*", methods: "*")]
    public class AccountController : CustomApiController
    {
        private readonly IAuthRepository _authRepository;
       

        public AccountController(IAuthRepository authRepository)
        {
            if (authRepository == null) throw new ArgumentNullException("authRepository");
            _authRepository = authRepository;
         
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

            IdentityResult result = await _authRepository.RegisterUser(new CreateUserDto(userModel.Email, userModel.Password));

            if (result == IdentityResult.Success)
            {
                //отправляем мыльцо
                try
                {
                    //_emailService.VerificationEmail(new EmailModel()
                    //{
                    //    Body = userModel.Email,
                    //    From = "dimaivanov1@mail.ru",
                    //    Subject = "Test",
                    //    To = userModel.Email
                    //});
                }
                    
                catch (Exception e)
                {
                  Debug.Write(e);  
                }
                
            }
            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return EmptyApiResult();
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

            var identity = (ClaimsIdentity)User.Identity;
            var email = identity.Claims.FirstOrDefault(x => x.Type == "sub").Value;
            IdentityResult result = await _authRepository.ChangePassword(email,model.NewPassword,model.OldPassword);
            IHttpActionResult errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return EmptyApiResult();
            // _authRepository.ChangePassword();


        }
    }
}