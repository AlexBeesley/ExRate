namespace ExRate_API.DataFromService
{
    public interface IGetExRateForecast
    {
        string getOutputLocally(string targetCurrency, string baseCurrency);
        string getOutputInContainer(string targetCurrency, string baseCurrency);
    }
}
