using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Net.Http;
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
        private string url = "http://apps.odakgis.com.tr:8282/api/megsis/GetParselWithGeomWktAsync/";
        HttpClientHandler _clientHandler = new HttpClientHandler();
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
                YCoordinate = (string)createTasinmazDto.YCoordinate,
                // Coordinates =createTasinmazDto.Coordinates
                ParselCoordinate = createTasinmazDto.ParselCoordinate
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
      
        [HttpGet("Districts/{id}")]
        public async Task<ActionResult<IEnumerable<Ilce>>> GetDistricts(int id)
        {
            var districts = await _tasinmazRepository.GetAllDistricts(id);
            return Ok(districts);
        }
        

        [HttpGet("Neighbourhood/{id}")]
        public async Task<ActionResult<IEnumerable<Mahalle>>> GetNeighbourhood(int id)
        {
            
            var neighbourhood = await _tasinmazRepository.GetAllNeighbourhood(id);
            return Ok(neighbourhood);
        }

        public List<Object> list = new List<Object>();
         [HttpGet("Parsel/{geomwkt}")]
         public async Task<ActionResult<String>> GetParsel(string geomwkt){
             List<KadastroParselModel> donus = null;
            // DbGeography dbg = DbGeography.FromText(geomwkt);
            using (var httpClient = new HttpClient(_clientHandler)){
               var response = httpClient.GetAsync(url + geomwkt).Result;
               if(response.StatusCode==System.Net.HttpStatusCode.OK){
                
                 donus = JsonConvert.DeserializeObject<List<KadastroParselModel>>(response.Content.ReadAsStringAsync().Result);
               }
            }
            System.Console.WriteLine(list.ToArray());
             return Ok(donus);
        }
    }
}
