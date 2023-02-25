using ExRate_API.Controllers;
using ExRate_API.DataFromService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace ExRate_API.Tests.Controllers
{
    public class GetExRateForecastControllerTests
    {
        private GetExRateForecastController _controller;
        private Mock<ILogger<GetExRateForecastController>> _loggerMock;
        private Mock<IGetExRateForecast> _getExRateForecastMock;

        [SetUp]
        public void Setup()
        {
            _loggerMock = new Mock<ILogger<GetExRateForecastController>>();
            _getExRateForecastMock = new Mock<IGetExRateForecast>();
            _controller = new GetExRateForecastController(_loggerMock.Object);
        }

        [Test]
        public void Get_Returns_JsonObject_With_HistoricalData_And_Forecast()
        {
            // Arrange
            var baseCurrency = "USD";
            var targetCurrency = "EUR";

            var expectedOutput = new
            {
                historicalData = new Dictionary<DateTime, decimal>(),
                forecast = new Dictionary<DateTime, decimal>()
            };

            _getExRateForecastMock.Setup(pl => pl.getOutput(baseCurrency, targetCurrency)).Returns(expectedOutput.ToString() ?? string.Empty);

            // Act
            var result = _controller.Get(baseCurrency, targetCurrency);

            // Assert
            var okResult = (OkObjectResult)result;
            dynamic output = okResult.Value ?? new object();
            Assert.IsInstanceOf<OkObjectResult>(result);
            Assert.IsNotNull(output);
        }


        [Test]
        public void Get_Logs_Debug_Message()
        {
            // Arrange
            var baseCurrency = "USD";
            var targetCurrency = "EUR";

            // Act
            var result = _controller.Get(baseCurrency, targetCurrency);

            // Assert
            _loggerMock.Verify(
                logger => logger.Log(
                    LogLevel.Debug,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, t) => o.ToString().Contains($"Request received for baseCurrency: {baseCurrency}, targetCurrency: {targetCurrency}")),
                    o => null,
                    It.IsAny<Func<It.IsAnyType, Exception, string>>()
                ),
                Times.Once
            );

        }
    }
}
