using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Tasinmaz.Models;
using TasinmazWebAPI.Dtos;
using TasinmazWebAPI.Models;
using TasinmazWebAPI.Repositories.Abstract;

namespace Tasinmaz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasinmazController : ControllerBase
    {
        private readonly ILoggerRepository _logger;
        private readonly ITasinmazRepository _tasinmazRepository;
        public TasinmazController(ITasinmazRepository tasinmazRepository,ILoggerRepository logger)
        {
            _tasinmazRepository = tasinmazRepository;
            _logger = logger;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TasinmazRegister>> GetUser(int id)
        {
            var tasinmaz = await _tasinmazRepository.Get(id);
            if (tasinmaz == null)
                return NotFound("Bu bilgilerde bir kullanıcı yok");

            return Ok(tasinmaz);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TasinmazRegister>>> GetTasinmaz()
        {
            var tasinmaz = await _tasinmazRepository.GetAll();
            return Ok(tasinmaz);
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult> CreateTasinmaz(CreateTasinmazDto createTasinmazDto)
        {

     var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserMenuId").Value);

            
             await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Başarılı",
                          Aciklama ="Taşınmaz Ekleme Başarılı bir şekilde gerçekleşti",
                          IslemTipi="Taşınmaz Ekleme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );        
            var tasinmaz = new TasinmazRegister
            {
                IlId = createTasinmazDto.IlId,
                IlceId = createTasinmazDto.IlceId,
                MahalleId = createTasinmazDto.MahalleId,
                Ada = createTasinmazDto.Ada,
                Parsel = createTasinmazDto.Parsel,
                Nitelik = createTasinmazDto.Nitelik,
                XCoordinate = (string)createTasinmazDto.XCoordinate,
                YCoordinate = (string)createTasinmazDto.YCoordinate
                // Coordinates =createTasinmazDto.Coordinates
            };
            await _tasinmazRepository.Add(tasinmaz);
            return Ok();
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var claimsIdentity = this.User.Identity as ClaimsIdentity;
            var userId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserMenuId").Value);
            await _tasinmazRepository.Delete(id);
            await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Başarılı",
                          Aciklama ="Taşınmaz Silme Başarılı bir şekilde gerçekleşti",
                          IslemTipi="Taşınmaz Silme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );    
            return Ok();
        }



        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdateTasinmaz(int id, UpdateTasinmazDto updateTasinmazDto)
        {
            var userId = Convert.ToInt32(User.Claims.First(c => c.Type == "UserMenuId").Value);

            TasinmazRegister tasinmaz = new()
            {
                Id = id,
                IlId = updateTasinmazDto.IlId,
                IlceId = updateTasinmazDto.IlceId,
                MahalleId = updateTasinmazDto.MahalleId,
                Ada = updateTasinmazDto.Ada,
                Parsel = updateTasinmazDto.Parsel,
                Nitelik = updateTasinmazDto.Nitelik
            };
            await _logger.Add(
                      new Log{
                          UserId= userId,
                          Durum="Başarılı",
                          Aciklama ="Taşınmaz Güncelleme Başarılı bir şekilde gerçekleşti",
                          IslemTipi="Taşınmaz Güncelleme",
                          DateTime= DateTime.Now.ToString("yyyy-MM-dd h:mm:ss tt"),
                          UserIp = HttpContext.Connection.RemoteIpAddress?.ToString(),
                        }
                  );  
            await _tasinmazRepository.Update(tasinmaz);
            return Ok();
        }

        [HttpGet("Cities")]
        public async Task<ActionResult<IEnumerable<Il>>> GetCities()
        {
            var cities = await _tasinmazRepository.GetAllCities();
            return Ok(cities);
        }
        [HttpGet("Cities/Single/{id}")]
        public async Task<ActionResult<Il>> GetSingleCities(int id)
        {
            var cities = await _tasinmazRepository.GetSingleCities(id);
            return Ok(cities);
        }

        [HttpGet("Districts/{id}")]
        public async Task<ActionResult<IEnumerable<Ilce>>> GetDistricts(int id)
        {
            var districts = await _tasinmazRepository.GetAllDistricts(id);
            return Ok(districts);
        }
        [HttpGet("Districts/Single/{id}")]
        public async Task<ActionaResult<Ilce>> GetSingleDistricts(int id)
        {
            var districts = await _tasinmazRepository.GetSingleDistricts(id);
            return Ok(districts);
        }

        [HttpGet("Neighbourhood/{id}")]
        public async Task<ActionResult<IEnumerable<Mahalle>>> GetNeighbourhood(int id)
        {
            var neighbourhood = await _tasinmazRepository.GetAllNeighbourhood(id);
            return Ok(neighbourhood);
        }

        [HttpGet("Neighbourhood/Single/{id}")]
        public async Task<ActionResult<Mahalle>> GetSingleNeighbourhood(int id)
        {
            var neighbourhood = await _tasinmazRepository.GetSingleNeighbourhood(id);
            return Ok(neighbourhood);
        }


    }
}
