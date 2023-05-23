using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;

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

        [HttpPost("")]
        public async Task<IActionResult> StartProcess([FromQuery] string baseCurrency, [FromQuery] string targetCurrency, [FromQuery] string modelType)
        {
            if (string.IsNullOrWhiteSpace(baseCurrency) || string.IsNullOrWhiteSpace(targetCurrency) || string.IsNullOrWhiteSpace(modelType))
            {
                _logger.LogError("Invalid input parameters.");
                return BadRequest("All input parameters (baseCurrency, targetCurrency, and modelType) are required.");
            }

            _logger.LogInformation($"Request received for {nameof(baseCurrency)}: {baseCurrency} & {nameof(targetCurrency)}: {targetCurrency} with model: {modelType}");

            var token = Guid.NewGuid().ToString();
            var task = _ExRateForecast.GetOutputAsync(baseCurrency, targetCurrency, modelType);
            Task.Run(() => SaveTask(token, task));

            return Ok(new { Token = token });
        }

        [HttpGet("{token}")]
        public async Task<IActionResult> GetResult(string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest("Token cannot be null or empty.");
                }

                var taskExists = Tasks.TryGetValue(token, out var task);

                if (!taskExists)
                {
                    return NotFound("Task not found for token.");
                }

                if (!task.IsCompleted)
                {
                    return NotFound("Task not yet completed.");
                }

                var result = await task;

                if (result == null)
                {
                    return NotFound("Result not found.");
                }

                return Ok(result);
            }
            catch (Exception ex) 
            {
                return StatusCode(503, $"Data from dependant API not available. Please try again later. \nError: {ex}");
            }
        }


        private static readonly ConcurrentDictionary<string, Task<string>> Tasks = new ConcurrentDictionary<string, Task<string>>();

        private void SaveTask(string token, Task<string> task)
        {
            Tasks[token] = task;
        }

        private Task<string> RetrieveTask(string token)
        {
            Tasks.TryRemove(token, out var task);
            return task;
        }
    }
}
