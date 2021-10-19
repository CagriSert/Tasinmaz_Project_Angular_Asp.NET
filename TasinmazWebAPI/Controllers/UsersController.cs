using System.Net;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Tasinmaz.Data;
using Tasinmaz.Dtos;
using Tasinmaz.Models;
using Tasinmaz.Repositories.Abstract;
using TasinmazWebAPI.Common;
using TasinmazWebAPI.Models;
using TasinmazWebAPI.Security.Hashing;
using Microsoft.AspNetCore.Http;
using TasinmazWebAPI.Repositories.Abstract;

namespace Tasinmaz.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ApplicationSettings _appSettings;
        private readonly ILoggerRepository _logger;

        public UsersController(IUserRepository userRepository,
         IOptions<ApplicationSettings> appSettings,
         ILoggerRepository logger)
        {
            _userRepository = userRepository;
            _appSettings = appSettings.Value;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var rolId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserRolId").Value);

            if (rolId == 1)
            {
            var user = await _userRepository.Get(id);
            if (user == null)
                return NotFound("Bu bilgilerde bir kullanıcı yok");

            return Ok(user);
            }else return Forbid();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var rolId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserRolId").Value);

            if (rolId == 1)
            {
            var users = await _userRepository.GetAll();
            return Ok(users);
            } else
                return Forbid();
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("Login")]
        //form body kaldırıp bir
        public async Task<ActionResult<User>> Authenticate(LoginUserDto loginUserDto)
        {
            var user = await _userRepository.Login(loginUserDto);
            if (HashingHelper.VerifyPassword(loginUserDto.Password, user.PasswordHash, user.PasswordSalt))
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserMenuId", user.Id.ToString()),
                        new Claim("UserRolId", user.RolId.ToString()),
                    }),

                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);

                return Ok(new { token });
            }
            else
                return BadRequest(new { message = "Mail Adresi zaten kullanılıyor!" });

        }

        [HttpPost]
        [Route("Register")]
        public async Task<ActionResult> CreateUsers(CreateUserDto createUserDto)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var rolId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserRolId").Value);
            var userId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserMenuId").Value);

            if (rolId == 1)
            {
                byte[] passwordHash, passwordSalt;
                HashingHelper.CreatePasswordHash(createUserDto.Password, out passwordHash, out passwordSalt);
                var user = new User
                {
                    RolId = createUserDto.RolId,
                    Name = createUserDto.Name,
                    LastName = createUserDto.LastName,
                    Mail = createUserDto.Mail,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt

                };
                var userControl = await _userRepository.UserNameValidate(user);
                if (userControl == null)
                {
                
                await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Başarılı",
                          Aciklama ="Kullanıcı Ekleme Başarılı bir şekilde gerçekleşti",
                          IslemTipi="Kullanıcı Ekleme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );
                    await _userRepository.Add(user);
                    return Ok();
                }
                else{
                    await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Hata",
                          Aciklama ="Kullanıcı Ekleme gerçekleştirilemedi",
                          IslemTipi="Kullanıcı Ekleme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );
                    return BadRequest(new { message = "Mail Adresi zaten kullanılıyor!" });
                
                }
            }
            else{
                await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Hata",
                          Aciklama ="Yetkisiz Giriş Gerçekleşti",
                          IslemTipi="Kullanıcı Ekleme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );
                return Forbid();
            }

        }


        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var rolId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserRolId").Value);
            var userId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserMenuId").Value);


            if (rolId == 1)
            {
              await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Başarılı",
                          Aciklama ="Kullanıcı Silme Başarılı bir şekilde gerçekleşti",
                          IslemTipi="Kullanıcı Silme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );
              await _userRepository.Delete(id);
              return Ok();
            }
            else{
                await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Hata",
                          Aciklama ="Yetkisiz Giriş Gerçekleşti",
                          IslemTipi="Kullanıcı Silme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );
                return Forbid();
            }
        }

        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdateUser(int id, UpdateUserDto updateUserDto)
        {
            
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var rolId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserRolId").Value);
            var userId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserMenuId").Value);

            if (rolId == 1)
            {
                
                byte[] passwordHash, passwordSalt;
                HashingHelper.CreatePasswordHash(updateUserDto.Password, out passwordHash, out passwordSalt);
                User user = new()
                {
                    Id = id,
                    RolId = updateUserDto.RolId,
                    Name = updateUserDto.Name,
                    LastName = updateUserDto.LastName,
                    Mail = updateUserDto.Mail,
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt
                };

                 await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Başarılı",
                          Aciklama ="Kullanıcı Güncelleme Başarılı bir şekilde gerçekleşti",
                          IslemTipi="Kullanıcı Güncelleme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );
            await _userRepository.Update(user);
            return Ok();
            }
                 else{
                await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Hata",
                          Aciklama ="Yetkisiz Giriş Gerçekleşti",
                          IslemTipi="Kullanıcı Güncelleme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );
                return Forbid();
            }
        }



        [HttpGet("Roles")]
        public async Task<ActionResult<IEnumerable<Rol>>> GetRoles()
        {
            var role = await _userRepository.GetAllRoles();
            return Ok(role);
        }

    }
}