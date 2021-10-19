using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tasinmaz.Data;
using TasinmazWebAPI.Dtos;
using TasinmazWebAPI.Models;
using TasinmazWebAPI.Repositories.Abstract;

namespace TasinmazWebAPI.Repositories.Concreate
{
    public class  LoggerRepository : ILoggerRepository
    {
        
        private readonly IDataContext _context;
        public LoggerRepository(IDataContext context)
        {
            _context = context;
        }

        public async Task Add(Log log)
        {
            _context.Logs.Add(log);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Log>> GetAll()
        {
            return await _context.Logs.ToListAsync();
        }
    }
}