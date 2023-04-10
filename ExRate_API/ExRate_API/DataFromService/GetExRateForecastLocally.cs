using ExRate_API.Controllers;

namespace ExRate_API.DataFromService
{
    public class GetExRateForecastLocally : GetExRateForecastBase, IGetExRateForecast
    {
        public GetExRateForecastLocally(ILogger<GetExRateForecastController> logger) : base(logger)
        {
        }

        public string GetOutput(string targetCurrency, string baseCurrency, string modelType)
        {
            var fileName = "C:\\Users\\david\\AppData\\Local\\Programs\\Python\\Python310\\python.exe"; //Replace with local python executable.
            var scriptPath = @"C:\dev\ExRate\ExRate_Service" + @"\Program.py";
            var scriptDirectory = Path.GetDirectoryName(scriptPath) ?? string.Empty;

            return RunProcess(fileName, scriptPath, scriptDirectory, targetCurrency, baseCurrency, modelType);
        }
    }
}
