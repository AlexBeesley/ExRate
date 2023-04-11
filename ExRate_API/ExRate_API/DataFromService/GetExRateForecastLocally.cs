using ExRate_API.Configs;
using ExRate_API.Controllers;
using Microsoft.Extensions.Options;


namespace ExRate_API.DataFromService
{
    public class GetExRateForecastLocally : GetExRateForecastBase, IGetExRateForecast
    {
        private readonly LocalConfig _config;

        public GetExRateForecastLocally(ILogger<GetExRateForecastController> logger, IOptions<LocalConfig> config) : base(logger)
        {
            _config = config.Value;
        }

        public async Task<string> GetOutputAsync(string targetCurrency, string baseCurrency, string modelType)
        {
            var fileName = _config.PythonExecutablePath;
            var scriptPath = _config.ScriptPath;
            var scriptDirectory = Path.GetDirectoryName(scriptPath) ?? string.Empty;

            return await RunProcessAsync(fileName, scriptPath, scriptDirectory, targetCurrency, baseCurrency, modelType);
        }
    }
}
