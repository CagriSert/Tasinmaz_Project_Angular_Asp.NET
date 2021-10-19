using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tasinmaz.Models;
using TasinmazWebAPI.Models;

namespace Tasinmaz.Data
{
    public class DataContext:DbContext,IDataContext
    {
        public DataContext(DbContextOptions<DataContext> options):base(options)
        {

        }
        public DbSet<Log> Logs { get; set; }
        public DbSet<Il> Ils { get; set; }
        public DbSet<Ilce> Ilces { get; set; }
        public DbSet<Mahalle> Mahalles { get; set; }
        public DbSet<Rol> Rols { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<TasinmazRegister> TasinmazRegisters { get; set; }
    }
}
