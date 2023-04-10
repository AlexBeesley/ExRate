using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;

namespace ExRate_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GetExRateForecastController : ControllerBase
    {
        private readonly ILogger<GetExRateForecastController> _logger;
        private readonly IGetExRateForecast _ExRateForecast;

        public GetExRateForecastController(ILogger<GetExRateForecastController> logger, IGetExRateForecast ExRateForecast)
        {
            _logger = logger;
            _ExRateForecast = ExRateForecast;
        }

        [HttpGet("forecast")]
        public IActionResult Get([FromQuery] string baseCurrency, [FromQuery] string targetCurrency, [FromQuery] string modelType)
        {
            _logger.LogInformation($"Request received for {nameof(baseCurrency)}: {baseCurrency} & {nameof(targetCurrency)}: {targetCurrency} with model: {modelType}");

            var output = _ExRateForecast.GetOutput(baseCurrency, targetCurrency, modelType);

            _logger.LogInformation($"Response sent for {nameof(baseCurrency)}: {baseCurrency} & {nameof(targetCurrency)}: {targetCurrency} with model: {modelType}");

            return Ok(output);
        }
    }
}
