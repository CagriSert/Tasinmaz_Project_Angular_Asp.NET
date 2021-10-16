using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Tasinmaz.Repositories.Abstract;
using Tasinmaz.Data;
using Tasinmaz.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Tasinmaz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserRepository _userRepository;


        public UserProfileController(IUserRepository userRepository)
        {
            _userRepository = userRepository;

        }
         
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<Object> GetUserProfile(){
          var claimsIdentity = this.User.Identity as ClaimsIdentity;
          var userId = User.Claims.First(c => c.Type == "UserMenuId").Value;
          int id = Convert.ToInt16(userId);
          var user = await _userRepository.GetUserProfile(id);
          return new
          {
              user.Name,
              user.LastName,
              user.Mail,
              user.RolId
          };
            
        }
    }
}
