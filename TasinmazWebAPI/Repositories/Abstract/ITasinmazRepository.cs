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
        Task<Il> GetSingleCities(int id);
        Task<IEnumerable<Ilce>> GetAllDistricts(int id);
        Task<Ilce> GetSingleDistricts(int id);
        Task<IEnumerable<Mahalle>> GetAllNeighbourhood(int id);
        Task<Mahalle> GetSingleNeighbourhood(int id);
        Task Add(TasinmazRegister tasinmazRegister);
        Task Delete(int id);
        Task<TasinmazRegister> Get(int id);
        Task Update(TasinmazRegister tasinmazRegister);
    }
}