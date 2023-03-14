using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;

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

            var pythonListener = new GetExRateForecast(_logger);
            string output;
            if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER")))
            {
                output = pythonListener.getOutputLocally(baseCurrency, targetCurrency);
            }
            else
            {
                output = pythonListener.getOutputInContainer(baseCurrency, targetCurrency);
            }

            _logger.LogInformation($"Response sent for baseCurrency: {baseCurrency}, targetCurrency: {targetCurrency}");

            return Ok(output);
        }
    }
}
