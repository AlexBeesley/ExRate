using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;

namespace ExRate_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GetExRateForecastController : ControllerBase
    {
        [HttpGet("{baseCurrency}&{targetCurrency}")]
        public IActionResult Get(string baseCurrency, string targetCurrency)
        {
            var pythonListener = new GetExRateForecast();
            var output = pythonListener.getOutput(baseCurrency, targetCurrency);
            return Ok(output);
        }
    }
}