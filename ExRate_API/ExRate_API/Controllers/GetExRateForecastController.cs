using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ExRate_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GetExRateForecastController : ControllerBase
    {
        private readonly ILogger<GetExRateForecastController> _logger;
        public GetExRateForecastController(ILogger<GetExRateForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet("{baseCurrency}&{targetCurrency}")]
        public IActionResult Get(string baseCurrency, string targetCurrency)
        {
            _logger.LogInformation($"Request received for baseCurrency: {baseCurrency}, targetCurrency: {targetCurrency}");

            var pythonListener = new GetExRateForecast();
            var output = pythonListener.getOutput(baseCurrency, targetCurrency);

            _logger.LogInformation($"Response sent for baseCurrency: {baseCurrency}, targetCurrency: {targetCurrency}");

            return Ok(output);
        }
    }
}
