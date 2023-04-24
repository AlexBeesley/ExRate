using ExRate_API.Controllers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.Linq.Expressions;
using System.Text;

namespace ExRate_API.DataFromService
{
    public class GetExRateForecastBase
    {
        protected readonly ILogger<GetExRateForecastController> _logger;

        public GetExRateForecastBase(ILogger<GetExRateForecastController> logger)
        {
            _logger = logger;
        }

        protected virtual async Task<string> RunProcessAsync(string fileName, string scriptPath, string scriptDirectory, string targetCurrency, string baseCurrency, string modelType)
        {
            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = fileName,
                    Arguments = scriptPath + $" -b {targetCurrency} -t {baseCurrency} -m {modelType}",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    WorkingDirectory = scriptDirectory
                },
                EnableRaisingEvents = true
            };

            string? errorMessage = null;
            StringBuilder outputBuilder = new StringBuilder();
            process.ErrorDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    _logger.LogError($"Error from process: {e.Data}");
                    errorMessage = e.Data;
                }
            };
            process.OutputDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    outputBuilder.Append(e.Data);
                }
            };

            await ProcessSequenceAsync(process);

            if (errorMessage != null)
            {
                throw new Exception(errorMessage);
            }

            return CombineIntoJson(outputBuilder.ToString());
        }

        protected virtual string CombineIntoJson(string output)
        {
            int firstBracketIndex = output.IndexOf('{');
            int secondBracketIndex = output.IndexOf('{', firstBracketIndex + 1);

            if (firstBracketIndex < 0 || secondBracketIndex < 0)
            {
                throw new JsonReaderException("Invalid JSON provided.");
            }

            string combinedJson = output.Substring(firstBracketIndex);

            JObject historicalData = JObject.Parse(combinedJson.Substring(0, secondBracketIndex - firstBracketIndex));
            JObject forecast = JObject.Parse(combinedJson.Substring(secondBracketIndex - firstBracketIndex));

            if (historicalData != null && forecast != null) {
                var result = new Dictionary<string, object>
                {
                    { "historicalData", historicalData.ToObject<Dictionary<string, object>>() },
                    { "forecast", forecast.ToObject<Dictionary<string, object>>() }
                };

                using (var writer = new StringWriter())
                {
                    using (var jsonWriter = new JsonTextWriter(writer))
                    {
                        jsonWriter.Formatting = Formatting.Indented;
                        new JsonSerializer().Serialize(jsonWriter, result);
                    }

                    return writer.ToString();
                }
            }

            throw new JsonReaderException("No JSON provided.");
        }

        private async Task ProcessSequenceAsync(Process process)
        {
            process.Start();
            process.BeginErrorReadLine();
            process.BeginOutputReadLine();
            await process.WaitForExitAsync();
        }
    }
}
