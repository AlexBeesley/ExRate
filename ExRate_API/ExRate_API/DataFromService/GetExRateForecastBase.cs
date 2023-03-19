using ExRate_API.Controllers;
using Newtonsoft.Json;
using System.Diagnostics;

namespace ExRate_API.DataFromService
{
    public class GetExRateForecastBase
    {
        protected readonly ILogger<GetExRateForecastController> _logger;

        public GetExRateForecastBase(ILogger<GetExRateForecastController> logger)
        {
            _logger = logger;
        }
        protected string CombineIntoJson(string output)
        {
            var historicalData = JsonConvert.DeserializeObject<Dictionary<string, object>>(output.Substring(0, output.IndexOf("}") + 1));
            var forecast = JsonConvert.DeserializeObject<Dictionary<string, object>>(output.Substring(output.IndexOf("}") + 1));

            var result = new Dictionary<string, Dictionary<string, object>>
            {
                { "historicalData", historicalData ?? new Dictionary<string, object>() },
                { "forecast", forecast ?? new Dictionary<string, object>() }
            };

            var json = JsonConvert.SerializeObject(result, Formatting.Indented);

            return json;
        }

        protected void processSequence(Process process)
        {
            process.Start();
            process.BeginErrorReadLine();
            process.BeginOutputReadLine();
            process.WaitForExit();
        }
    }
}
