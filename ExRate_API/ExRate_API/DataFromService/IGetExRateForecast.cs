namespace ExRate_API.DataFromService
{
    public interface IGetExRateForecast
    {
        string getOutput(string targetCurrency, string baseCurrency);
    }
}
