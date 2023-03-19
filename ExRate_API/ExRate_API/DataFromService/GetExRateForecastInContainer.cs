using ExRate_API.Controllers;
using System.Diagnostics;

namespace ExRate_API.DataFromService
{
    public class GetExRateForecastInContainer : GetExRateForecastBase, IGetExRateForecast
    {
        public GetExRateForecastInContainer(ILogger<GetExRateForecastController> logger) : base(logger)
        {
        }

        public string getOutput(string targetCurrency, string baseCurrency)
        {
            var fileName = "/usr/bin/python3.9";
            var scriptPath = "/app/ExRate_Service/Program.py";
            var scriptDirectory = "/app/ExRate_Service/";

            return RunProcess(fileName, scriptPath, scriptDirectory, targetCurrency, baseCurrency);
        }
    }
}
