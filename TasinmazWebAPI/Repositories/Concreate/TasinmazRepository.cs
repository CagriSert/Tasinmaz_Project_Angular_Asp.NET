using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Tasinmaz.Data;
using Tasinmaz.Models;
using TasinmazWebAPI.Models;
using TasinmazWebAPI.Repositories.Abstract;

namespace TasinmazWebAPI.Repositories.Concreate
{
    public class TasinmazRepository : ITasinmazRepository
    {
        private readonly IDataContext _context;
        public TasinmazRepository(IDataContext context)
        {
            _context = context;
        }
        public async Task Add(TasinmazRegister tasinmazRegister)
        {
            _context.TasinmazRegisters.Add(tasinmazRegister);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(int id)
        {
            var itemToDelete = await _context.TasinmazRegisters.FindAsync(id);
            if (itemToDelete == null)
                throw new NullReferenceException();

            _context.TasinmazRegisters.Remove(itemToDelete);
            await _context.SaveChangesAsync();
        }

        public async Task<TasinmazRegister> Get(int id)
        {
            return await _context.TasinmazRegisters.FindAsync(id);
        }

        public async Task<IEnumerable<TasinmazRegister>> GetAll()
        {
            return await _context.TasinmazRegisters.ToListAsync();
        }

        public async Task<IEnumerable<Il>> GetAllCities()
        {
            return await _context.Ils.ToListAsync();
        }

        public async Task<IEnumerable<Ilce>> GetAllDistricts(int id)
        {
            return await _context.Ilces.Where(x=>x.IlId == id).ToListAsync();

        }

        public async Task<IEnumerable<Mahalle>> GetAllNeighbourhood(int id)
        {
            return await _context.Mahalles.Where(x=>x.IlceId == id).ToListAsync();
        }

        public async Task<Il> GetSingleCities(int id)
        {
            return await _context.Ils.FindAsync(id);
        }

        public async Task<Ilce> GetSingleDistricts(int id)
        {
            return await _context.Ilces.FindAsync(id);
        }

        public async Task<Mahalle> GetSingleNeighbourhood(int id)
        {
            return await _context.Mahalles.FindAsync(id);
        }

        public async Task Update(TasinmazRegister tasinmazRegister)
        {
            var itemToUpdate = await _context.TasinmazRegisters.FindAsync(tasinmazRegister.Id);
            if(itemToUpdate == null)
                throw new NullReferenceException();

            itemToUpdate.IlId= tasinmazRegister.IlId;
            itemToUpdate.IlceId = tasinmazRegister.IlceId;
            itemToUpdate.MahalleId = tasinmazRegister.MahalleId;
            itemToUpdate.Ada = tasinmazRegister.Ada;
            itemToUpdate.Parsel = tasinmazRegister.Parsel;
            itemToUpdate.Nitelik = tasinmazRegister.Nitelik;
            await _context.SaveChangesAsync();
        }
    }
}