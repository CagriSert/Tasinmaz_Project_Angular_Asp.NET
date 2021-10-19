using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TasinmazWebAPI.Dtos;
using TasinmazWebAPI.Models;
using TasinmazWebAPI.Repositories.Abstract;

namespace Tasinmaz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoggerController : ControllerBase
    {
        private readonly ILoggerRepository _loggerService;
        public LoggerController(ILoggerRepository loggerService)
        {
            _loggerService = loggerService;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Log>>> Get()
        {
            var logger = await _loggerService.GetAll();
            return Ok(logger);
        }

        [HttpPost("Add")]
        public async Task<ActionResult> CreateTasinmaz(CreateLogDto createLogDto)
        {
            var log = new Log
            {
                UserId = createLogDto.UserId,
                Durum = createLogDto.Durum,
                IslemTipi = createLogDto.IslemTipi,
                Aciklama = createLogDto.Aciklama,
                DateTime = createLogDto.DateTime,
                UserIp = createLogDto.UserIp               
            };
            await _loggerService.Add(log);
            return Ok();
        }
    }
}
