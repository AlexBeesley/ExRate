using ExRate_API.Controllers;
using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using System.Threading.Tasks;

namespace ExRate_API.Tests.Controllers
{
    [TestFixture]
    public class GetExRateForecastControllerTests
    {
        private Mock<ILogger<GetExRateForecastController>> _loggerMock;
        private Mock<IGetExRateForecast> _exRateForecastMock;
        private GetExRateForecastController _controller;

        [SetUp]
        public void Setup()
        {
            _loggerMock = new Mock<ILogger<GetExRateForecastController>>();
            _exRateForecastMock = new Mock<IGetExRateForecast>();
            _controller = new GetExRateForecastController(_loggerMock.Object, _exRateForecastMock.Object);
        }

        [Test]
        public async Task StartProcess_ShouldReturnBadRequest_WhenInputParametersAreInvalid()
        {
            // Arrange
            var baseCurrency = "";
            var targetCurrency = "";
            var modelType = "";

            // Act
            var result = await _controller.StartProcess(baseCurrency, targetCurrency, modelType);

            // Assert
            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task StartProcess_ShouldReturnOkResult_WhenInputParametersAreValid()
        {
            // Arrange
            var baseCurrency = "USD";
            var targetCurrency = "EUR";
            var modelType = "LSTM";
            var expectedOutput = "{\"key\": \"value\"}";

            _exRateForecastMock.Setup(x => x.GetOutputAsync(baseCurrency, targetCurrency, modelType))
                .ReturnsAsync(expectedOutput);

            // Act
            var result = await _controller.StartProcess(baseCurrency, targetCurrency, modelType);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsInstanceOf<OkObjectResult>(result);
            var token = okResult.Value.GetType().GetProperty("Token").GetValue(okResult.Value, null);
            Assert.IsNotNull(token);
            var getResult = await _controller.GetResult(token.ToString());
            Assert.IsInstanceOf<OkObjectResult>(getResult);
            var getResultValue = (getResult as OkObjectResult).Value;
            Assert.AreEqual(expectedOutput, getResultValue);
        }
    }
}
