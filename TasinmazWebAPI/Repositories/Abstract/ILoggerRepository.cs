using System.Collections.Generic;
using System.Threading.Tasks;
using TasinmazWebAPI.Models;

namespace TasinmazWebAPI.Repositories.Abstract
{
    public interface ILoggerRepository
    {
        Task<IEnumerable<Log>> GetAll();
        Task Add(Log log);

    }
}