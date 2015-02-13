using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mime;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Mvc;
using GiftKnacksProject.Api.Controllers.ApiResults;
using GiftKnacksProject.Api.Controllers.Models;
using GiftKnacksProject.Api.Dao.AuthUsers;
using GiftKnacksProject.Api.Dao.Repositories;
using GiftKnacksProject.Api.Dto.AuthUsers;
using GiftKnacksProject.Api.Dto.Dtos;
using GiftKnacksProject.Api.EfDao;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Newtonsoft.Json.Linq;

namespace GiftKnacksProject.Api.Controllers.Controllers
{
    [System.Web.Http.RoutePrefix("api/Account")]
    [EnableCors(origins: "http://giftknacksproject.azurewebsites.net", headers: "*", methods: "*")]
    public class AccountController : CustomApiController
    {
        private readonly CustomUserManager _userManager;
        private readonly IProfileRepository _profileRepository;


        public AccountController(CustomUserManager userManager, IProfileRepository profileRepository, IEnviropment environment)
        {
            
            _userManager = userManager;
            _profileRepository = profileRepository;
        }

        // POST api/Account/Register
        [System.Web.Http.AllowAnonymous]
        [System.Web.Http.Route("Register")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1, errorsMessages);
            }


            var user = new ApplicationUser()
            {
                UserName = userModel.Email,
            };

            var result = await _userManager.CreateAsync(user, userModel.Password);

            if (result.Succeeded)
            {

                try
                {
                    var code = await _userManager.GenerateEmailConfirmationTokenAsync(user.Id);
                   
                    var callbackUrl = String.Format("http://localhost:49836/#/login?userId={0}&code={1}&email={2}", user.Id,
                        WebUtility.UrlEncode(code), user.UserName);
                    await _userManager.SendEmailAsync(user.Id, "ConfirmEmail", callbackUrl);
                }
                catch (Exception e)
                {
                    Debug.WriteLine(e);
                }

                return EmptyApiResult();
            }
            else
            {
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                if (!errorsMessages.Any()) return ErrorApiResult(12, "User exist");
                return ErrorApiResult(1, errorsMessages);
            }

        }

        [System.Web.Http.AllowAnonymous]
        [System.Web.Http.Route("VerifyEmail")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> VerifyEmail(VerifyEmailModel model)
        {
          
            if (model.UserId == null || model.Code == null)
            {
                return ErrorApiResult(1, "Нет параметров");
            }

            IdentityResult result = await _userManager.ConfirmEmailAsync(long.Parse(model.UserId), model.Code);

            if (result.Succeeded)
            {
                return EmptyApiResult();
            }
            else
            {
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1, errorsMessages);
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
        [System.Web.Http.Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1, errorsMessages);
            }
            var name = User.Identity.GetUserName();
            var userId = long.Parse(User.Identity.GetUserId());
            var result = await _userManager.ChangePasswordAsync(userId, model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                return EmptyApiResult();
            }
            else
            {
                return ErrorApiResult(2, result.Errors);
            }

        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("GetProfile")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> GetProfile()
        {
            var userId = long.Parse(User.Identity.GetUserId());
            var profile = await _profileRepository.GetProfile(userId);
            if (profile == null)
            {
                return ErrorApiResult(12, "Profile not finded");
            }
            else
            {
                return SuccessApiResult(profile);
            }
        }

        [System.Web.Http.Authorize]
        [System.Web.Http.Route("UpdateProfile")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> UpdateProfile(ProfileDto profileDto)
        {
            var userId = long.Parse(User.Identity.GetUserId());
            profileDto.Id = userId;
            if (profileDto.Image != null)
            {
                var imagestr = profileDto.Image.Result.Split(new char[]{','})[1];
                var filePath = HttpContext.Current.Server.MapPath("~/avatars");
                if (!System.IO.Directory.Exists(filePath))
                {
                    System.IO.Directory.CreateDirectory(filePath);
                }
                var bytes=Convert.FromBase64String(imagestr);
                try
                {
                    using (var fs = new FileStream(filePath+"/"+profileDto.Image.Name, FileMode.OpenOrCreate))
                    {
                        fs.Write(bytes, 0, bytes.Length);
                        fs.Close();
                    }
                }
                catch (Exception e)
                {
                    
                }
                
                
                
            }
            await _profileRepository.UpdateProfile(profileDto);
            dynamic jsonObject = new JObject();
            jsonObject.ProfileProgress = profileDto.ProfileProgress;
       
            return SuccessApiResult(jsonObject);
        }



        [System.Web.Http.Route("RecoverPassword")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> RecoverPassword(RecoverPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1, errorsMessages);
            }
            var user = _userManager.FindByEmailAsync(model.Email);
            var token = await _userManager.GeneratePasswordResetTokenAsync(user.Result.Id);
            var callbackUrl = String.Format("http://localhost:49836/#/recover?email={0}&token={1}", model.Email, WebUtility.UrlEncode(token));
            await _userManager.SendEmailAsync(user.Result.Id, "RecoverPassword", callbackUrl);
            return EmptyApiResult();
        }

        [System.Web.Http.Route("ResetPassword")]
        [System.Web.Http.HttpPost]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1, errorsMessages);
            }
            var user = await _userManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                ModelState.AddModelError("", "No user found.");
                var errorsMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
                return ErrorApiResult(1, errorsMessages);
            }
            IdentityResult result = await _userManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
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

     


    }
}