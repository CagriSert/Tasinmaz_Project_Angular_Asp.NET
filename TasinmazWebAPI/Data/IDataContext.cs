using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Tasinmaz.Models;
using TasinmazWebAPI.Models;

namespace Tasinmaz.Data
{
    public interface IDataContext
    {
        DbSet<Il> Ils { get; set; }
        DbSet<Ilce> Ilces { get; set; }
        DbSet<Mahalle> Mahalles { get; set; }
        DbSet<Rol> Rols{ get; set; }
        DbSet<User> Users { get; set; }
        DbSet<TasinmazRegister> TasinmazRegisters{get; set;}
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
