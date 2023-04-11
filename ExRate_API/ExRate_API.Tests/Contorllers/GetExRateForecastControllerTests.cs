using ExRate_API.Controllers;
using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

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
        public async Task Get_ShouldReturnBadRequest_WhenInputParametersAreInvalid()
        {
            // Arrange
            var baseCurrency = "";
            var targetCurrency = "";
            var modelType = "";

            // Act
            var result = await _controller.Get(baseCurrency, targetCurrency, modelType);

            // Assert
            Assert.IsInstanceOf<BadRequestObjectResult>(result);
        }

        [Test]
        public async Task Get_ShouldReturnOkResult_WhenInputParametersAreValid()
        {
            // Arrange
            var baseCurrency = "USD";
            var targetCurrency = "EUR";
            var modelType = "LSTM";
            var expectedOutput = "{\"key\": \"value\"}";

            _exRateForecastMock.Setup(x => x.GetOutputAsync(baseCurrency, targetCurrency, modelType))
                .ReturnsAsync(expectedOutput);

            // Act
            var result = await _controller.Get(baseCurrency, targetCurrency, modelType);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.AreEqual(expectedOutput, okResult.Value);
        }
    }
}
