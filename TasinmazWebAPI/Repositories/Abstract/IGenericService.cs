using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Tasinmaz.Repositories.Abstract
{
    public interface IGenericService<T>
    {
        Task<IEnumerable<T>> GetAll();
        Task Add(T item);
        Task Delete(int id);
        Task<T> Get(int id);
        Task Update(T item);
    }
}
