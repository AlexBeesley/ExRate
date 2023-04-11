using ExRate_API.Controllers;
using ExRate_API.DataFromService;
using Microsoft.Extensions.Logging;

namespace ExRate_API.Tests.TestHelpers
{
    internal class TestHelperForGetExRateForecastBase : GetExRateForecastBase
    {
        private string? _runProcessAsyncOutput;
        protected TestHelperForGetExRateForecastBase? _testHelper;

        public TestHelperForGetExRateForecastBase(ILogger<GetExRateForecastController> logger) : base(logger)
        {
        }


        public void SetTestHelper(TestHelperForGetExRateForecastBase testHelper)
        {
            _testHelper = testHelper;
        }


        public void SetRunProcessAsync(string output)
        {
            _runProcessAsyncOutput = output;
        }

        public string CallCombineIntoJson(string output)
        {
            return CombineIntoJson(output);
        }

        protected override Task<string> RunProcessAsync(string fileName, string scriptPath, string scriptDirectory, string targetCurrency, string baseCurrency, string modelType)
        {
            if (_runProcessAsyncOutput == null)
            {
                throw new NullReferenceException();
            }
            return Task.FromResult(_runProcessAsyncOutput);
        }
    }
}
