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
            _logger.LogInformation($"Request received for {nameof(baseCurrency)}: {baseCurrency} & {nameof(targetCurrency)}: {targetCurrency}");


            var ExRateForecast = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == null
                ? new GetExRateForecastLocally(_logger)
                : (IGetExRateForecast)new GetExRateForecastInContainer(_logger);

            var output = ExRateForecast.getOutput(baseCurrency, targetCurrency);


            _logger.LogInformation($"Response sent for {nameof(baseCurrency)}: {baseCurrency} & {nameof(targetCurrency)}: {targetCurrency}");

            return Ok(output);
        }
    }
}
