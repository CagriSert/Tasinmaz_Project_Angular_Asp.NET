using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tasinmaz.Dtos;
using Tasinmaz.Models;

namespace Tasinmaz.Repositories.Abstract
{
    public interface IUserRepository
    {
        Task<User> Get(int id);
        Task<User> GetUserProfile(int id);
        Task<IEnumerable<User>> GetAll();
        Task<IEnumerable<Rol>> GetAllRoles();
        Task Add(User user);
        Task<User> Login(LoginUserDto loginUserDto);
        Task<User> UserNameValidate(User user);
        Task Delete(int id);
        Task Update(User user);

    }
}
