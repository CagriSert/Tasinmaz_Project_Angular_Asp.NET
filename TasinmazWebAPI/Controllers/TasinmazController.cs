using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
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
        private readonly ITasinmazRepository _tasinmazRepository;
        public TasinmazController(ITasinmazRepository tasinmazRepository)
        {
            _tasinmazRepository = tasinmazRepository;

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TasinmazRegister>> GetUser(int id){
            var tasinmaz = await _tasinmazRepository.Get(id);
            if(tasinmaz == null)
                return NotFound("Bu bilgilerde bir kullanıcı yok");

            return Ok(tasinmaz);
        }

        [HttpGet]   
        public async Task<ActionResult<IEnumerable<TasinmazRegister>>> GetUsers(){
            var tasinmaz = await _tasinmazRepository.GetAll();
            return Ok(tasinmaz);
        }

        [HttpPost]
        [Route("Add")]
        public async Task<ActionResult> CreateTasinmaz(CreateTasinmazDto createTasinmazDto){
            var tasinmaz = new TasinmazRegister{
                IlId =createTasinmazDto.IlId,
                IlceId = createTasinmazDto.IlceId,
                MahalleId = createTasinmazDto.MahalleId,
                Ada = createTasinmazDto.Ada,
                Parsel = createTasinmazDto.Parsel,
                Nitelik = createTasinmazDto.Nitelik
            };
            await _tasinmazRepository.Add(tasinmaz);
            return Ok();
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<ActionResult> DeleteUser(int id){
            await _tasinmazRepository.Delete(id);
            return Ok();
        }



        [HttpPut("Update/{id}")]
        public async Task<ActionResult> UpdateUser(int id,UpdateTasinmazDto updateTasinmazDto){
            TasinmazRegister tasinmaz = new(){
                Id = id,
                IlId =updateTasinmazDto.IlId,
                IlceId = updateTasinmazDto.IlceId,
                MahalleId = updateTasinmazDto.MahalleId,
                Ada = updateTasinmazDto.Ada,
                Parsel = updateTasinmazDto.Parsel,
                Nitelik = updateTasinmazDto.Nitelik
            };
            await _tasinmazRepository.Update(tasinmaz);
            return Ok();
        }

        [HttpGet("Cities")]   
        public async Task<ActionResult<IEnumerable<Il>>> GetCities(){
            var cities = await _tasinmazRepository.GetAllCities();
            return Ok(cities);
        }
        [HttpGet("Cities/Single/{id}")]   
        public async Task<ActionResult<Il>> GetSingleCities(int id){
            var cities = await _tasinmazRepository.GetSingleCities(id);
            return Ok(cities);
        }

        [HttpGet("Districts/{id}")]   
        public async Task<ActionResult<IEnumerable<Ilce>>> GetDistricts(int id){
            var districts = await _tasinmazRepository.GetAllDistricts(id);
            return Ok(districts);
        }
        [HttpGet("Districts/Single/{id}")]   
        public async Task<ActionResult<Ilce>> GetSingleDistricts(int id){
            var districts = await _tasinmazRepository.GetSingleDistricts(id);
            return Ok(districts);
        }

        [HttpGet("Neighbourhood/{id}")]   
        public async Task<ActionResult<IEnumerable<Mahalle>>> GetNeighbourhood(int id){
            var neighbourhood = await _tasinmazRepository.GetAllNeighbourhood(id);
            return Ok(neighbourhood);
        }

        [HttpGet("Neighbourhood/Single/{id}")]   
        public async Task<ActionResult<Mahalle>> GetSingleNeighbourhood(int id){
            var neighbourhood = await _tasinmazRepository.GetSingleNeighbourhood(id);
            return Ok(neighbourhood);
        }


    }
}
