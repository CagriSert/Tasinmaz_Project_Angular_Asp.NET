using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
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
using TasinmazWebAPI.Security.Hashing;

namespace Tasinmaz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController:ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly ApplicationSettings _appSettings;
        public UsersController(IUserRepository userRepository,IOptions<ApplicationSettings> appSettings)
        {
            _userRepository = userRepository;
            _appSettings = appSettings.Value;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id){
            var user = await _userRepository.Get(id);
            if(user == null)
                return NotFound("Bu bilgilerde bir kullanıcı yok");

            return Ok(user);
        }

        [HttpGet]   
        public async Task<ActionResult<IEnumerable<User>>> GetUsers(){
            var users = await _userRepository.GetAll();
            return Ok(users);
        }

        [HttpPost]
        [Route("Login")]
        //form body kaldırıp bir
        public async Task<ActionResult<User>> Authenticate(LoginUserDto loginUserDto)
        {
            var user = await _userRepository.Login(loginUserDto);
            if(HashingHelper.VerifyPassword(loginUserDto.Password,user.PasswordHash,user.PasswordSalt))
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserMenuId", user.Id.ToString())
                    }),

                    Expires=DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)),SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);

                return Ok(new {token});
            }
            else
                return BadRequest(new { message = "Mail veya şifre hatalı!" }) ;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<ActionResult> CreateUsers(CreateUserDto createUserDto){
            byte[] passwordHash,passwordSalt;
            HashingHelper.CreatePasswordHash(createUserDto.Password,out passwordHash, out passwordSalt);
            var user = new User{
                RolId=createUserDto.RolId,
                Name = createUserDto.Name,
                LastName = createUserDto.LastName,
                Mail = createUserDto.Mail,
                PasswordHash = passwordHash,
                PasswordSalt=passwordSalt

            };
            var userControl = await _userRepository.UserNameValidate(user);
            if(userControl==null){
                await _userRepository.Add(user);
                return Ok();
            }else
                return BadRequest(new { message = "Mail Adresi zaten kullanılıyor!" }) ;

            
        }


        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<ActionResult> DeleteUser(int id){
            await _userRepository.Delete(id);
            return Ok();
        }



        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdateUser(int id,UpdateUserDto updateUserDto){
            User user = new(){
                Id = id,
                Name = updateUserDto.Name,
                LastName = updateUserDto.LastName,
                Mail = updateUserDto.Mail,
                Password = updateUserDto.Password
            };
            await _userRepository.Update(user);
            return Ok();
        }


        
        [HttpGet("Roles")]   
        public async Task<ActionResult<IEnumerable<Rol>>> GetRoles(){
            var role = await _userRepository.GetAllRoles();
            return Ok(role);
        }
        
        
    }
}