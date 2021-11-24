using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Tasinmaz.Data;
using Tasinmaz.Dtos;
using Tasinmaz.Models;
using Microsoft.Extensions.Options;
using Tasinmaz.Repositories.Abstract;
using TasinmazWebAPI.Common;
using TasinmazWebAPI.Security.Hashing;

namespace Tasinmaz.Repositories.Concreate
{
    public class UserRepository : IUserRepository
    {
        private readonly IDataContext _context;
        
        private readonly ApplicationSettings _appSettings;
        public UserRepository(IDataContext context,IOptions<ApplicationSettings> appSettings)
        {
            _context = context;
            _appSettings = appSettings.Value;
        }
        public async Task Add(User user)
        {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
        }
        public async Task<User> UserNameValidate(User user){
            return await _context.Users.SingleOrDefaultAsync(x=>x.Mail == user.Mail);
        }
        public async Task<User> Login(LoginUserDto loginUserDto)
        {
            return await _context.Users.SingleOrDefaultAsync(x => x.Mail == loginUserDto.Mail);
        }
       public async Task Delete(int id)
        {
            var itemToDelete = await _context.Users.FindAsync(id);
            if (itemToDelete == null)
                throw new NullReferenceException();

            _context.Users.Remove(itemToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<User> Get(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return await _context.Users.OrderByDescending(x=>x.Id).ToListAsync();
        }

        public async Task Update(User user)
        {
            var itemToUpdate = await _context.Users.FindAsync(user.Id);
            if(itemToUpdate == null)
                throw new NullReferenceException();

            itemToUpdate.Name = user.Name;
            itemToUpdate.LastName = user.LastName;
            itemToUpdate.Mail = user.Mail;
            itemToUpdate.RolId = user.RolId;
            itemToUpdate.PasswordHash = user.PasswordHash;           
            itemToUpdate.PasswordSalt = user.PasswordSalt;           
            await _context.SaveChangesAsync();
                
        }
        public async Task<IEnumerable<Rol>> GetAllRoles()
        {
            return await _context.Rols.ToListAsync();
        }

        public async Task<User> GetUserProfile(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }
    }
}
