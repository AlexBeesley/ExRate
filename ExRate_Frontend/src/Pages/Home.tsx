import { useState, useEffect } from 'react';
import Styles from '../Styles/main.module.scss';

export default function Home() {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch the CSV data and extract the currency abbreviations
    fetch('/Data/currency_codes.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n').slice(1); // Ignore header row
        const currencies = rows.map(row => row.split(',')[2].trim()).filter((currency, index, self) => currency.length === 3 && index === self.indexOf(currency)); // Filter out duplicates and entries longer than 3 characters
        currencies.sort((a, b) => {
          if (a === 'USD' || a === 'GBP' || a === 'EUR') {
            return -1; // a is higher priority
          } else if (b === 'USD' || b === 'GBP' || b === 'EUR') {
            return 1; // b is higher priority
          } else {
            return a.localeCompare(b); // compare alphabetically
          }
        });
        setCurrencies(currencies);
      })
      .catch(error => console.error(error));
  }, []);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Handle changes to currency dropdown values
    const selectedCurrency = event.target.value;
    if (event.target.id === 'currency1') {
      setBaseCurrency(selectedCurrency);
    } else {
      setTargetCurrency(selectedCurrency);
    }
  }
  

  const handleButtonClick = async () => {
    // Call the API with the selected currencies and display the result
    setIsLoading(true);
    try {
      const response = await fetch(`https://localho.st:7064/api/GetExRateForecast/${baseCurrency}&${targetCurrency}`);
      console.log(response);
      const data = await response.text();
      console.log(data);
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult('An error occurred while calling the API.');
    }
    setIsLoading(false);
  }
  

  const isButtonDisabled = !baseCurrency || !targetCurrency || isLoading;

  return (
    <div className={Styles.title}>
      <h1>Welcome to ExRate</h1>
      <h3>This is a work in progress React App</h3>

      <div>
        <label htmlFor="currency1">Please select a base currency:</label>
        <select id="currency1" name="currency1" onChange={handleCurrencyChange}>
          <option value="">Select currency</option>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="currency2">Please select a target currency:</label>
        <select id="currency2" name="currency2" onChange={handleCurrencyChange}>
          <option value="">Select currency</option>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>

      <button onClick={handleButtonClick} disabled={isButtonDisabled}>Get exchange rate forecast</button>

      {isLoading && <p>Loading...</p>}
      {!isLoading && result && <textarea value={result} readOnly></textarea>}
    </div>
  );
}