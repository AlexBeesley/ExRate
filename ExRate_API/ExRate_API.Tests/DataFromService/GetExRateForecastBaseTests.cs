using ExRate_API.Controllers;
using ExRate_API.DataFromService;
using ExRate_API.Tests.TestHelpers;
using Microsoft.Extensions.Logging;
using Moq;

namespace ExRate_API.Tests.DataFromService
{
    [TestFixture]
    public class GetExRateForecastBaseTests
    {
        private Mock<ILogger<GetExRateForecastController>> _loggerMock;
        private TestHelperForGetExRateForecastBase _testHelperForGetExRateForecastBase;

        [SetUp]
        public void Setup()
        {
            _loggerMock = new Mock<ILogger<GetExRateForecastController>>();
            _testHelperForGetExRateForecastBase = new TestHelperForGetExRateForecastBase(_loggerMock.Object);
        }

        [Test]
        public void CombineIntoJson_ShouldThrowJsonReaderException_WhenInvalidJsonProvided()
        {
            // Arrange
            var invalidJson = "invalidJson";

            // Act & Assert
            Assert.Throws<Newtonsoft.Json.JsonReaderException>(() => _testHelperForGetExRateForecastBase.CallCombineIntoJson(invalidJson));
        }

        [Test]
        public void CombineIntoJson_ShouldReturnCombinedJson_WhenValidJsonProvided()
        {
            // Arrange
            var validJson = "{\"date\": \"2023-01-01\"}{\"date\": \"2023-02-01\"}";
            var expectedResult = "{\r\n  \"historicalData\": {\r\n    \"date\": \"2023-01-01\"\r\n  },\r\n  \"forecast\": {\r\n    \"date\": \"2023-02-01\"\r\n  }\r\n}";

            // Act
            var result = _testHelperForGetExRateForecastBase.CallCombineIntoJson(validJson);

            // Assert
            Assert.AreEqual(expectedResult, result);
        }
    }
}
