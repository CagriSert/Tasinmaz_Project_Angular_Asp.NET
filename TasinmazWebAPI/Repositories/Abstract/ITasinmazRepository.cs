using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tasinmaz.Models;
using TasinmazWebAPI.Models;

namespace TasinmazWebAPI.Repositories.Abstract
{
    public interface ITasinmazRepository
    {
        Task<IEnumerable<TasinmazRegister>> GetAll();
        Task<IEnumerable<Il>> GetAllCities();
        Task<IEnumerable<Ilce>> GetAllDistricts(int id);
        Task<IEnumerable<Mahalle>> GetAllNeighbourhood(int id);
        Task Add(TasinmazRegister tasinmazRegister);
        Task Delete(int id);
        Task<TasinmazRegister> Get(int id);
        Task Update(TasinmazRegister tasinmazRegister);
    }
}