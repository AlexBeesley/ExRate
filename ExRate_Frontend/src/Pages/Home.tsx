import Styles from '../Styles/home.module.scss';
import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import Loader from "react-spinners/PropagateLoader";


export default function Home() {
  let root = document.documentElement;

  const [currencies, setCurrencies] = useState<string[]>([]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/Data/currency_codes.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n').slice(1);
        const currencies = rows
          .map(row => row.split(',')[2].trim())
          .filter((currency, index, self) => currency.length > 0 && index === self.indexOf(currency))
          .sort((a, b) => {
            const topCurrencies = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'NZD'];
            const aIndex = topCurrencies.indexOf(a);
            const bIndex = topCurrencies.indexOf(b);
            if (aIndex === -1 && bIndex === -1) {
              return a.localeCompare(b);
            } else if (aIndex === -1) {
              return 1;
            } else if (bIndex === -1) {
              return -1;
            } else {
              return aIndex - bIndex;
            }
          });
        setCurrencies(currencies);
      })
      .catch(error => console.error(error));
  }, []);
  

  useEffect(() => {
    setDropdownOptions(currencies);
  }, [currencies]);

  useEffect(() => {
    if (data) {
      const chartElement = document.getElementById('chart');
      const existingChart = Chart.getChart(chartElement);
      if (existingChart) {
        existingChart.destroy();
      }
      const historicalData = Object.entries(data.historicalData).map(([date, rate]) => ({ x: date, y: rate }));
      const forecastData = Object.entries(data.forecast).map(([date, rate]) => ({ x: date, y: rate }));
      const chartData = {
        datasets: [
          {
            label: 'Historical Rates',
            data: historicalData,
            borderColor: 'green',
            fill: false,
          },
          {
            label: 'Forecast',
            data: forecastData,
            borderColor: 'red',
            fill: false,
          },
        ],
      };
      const options = {
        plugins: {
          title: {
            display: true,
            text: `${baseCurrency} to ${targetCurrency} exchange rate forecast`,
          }
        }
      };      
      const chartConfig = {
        type: 'line',
        data: chartData,
        options: options,
      };
      new Chart(chartElement, chartConfig);
    }
  }, [data]);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = event.target.value;
    if (event.target.id === 'currency1') {
      setBaseCurrency(selectedCurrency);
      setDropdownOptions(currencies.filter(currency => currency !== selectedCurrency));
      // Remove the selected currency from the options in the other dropdown
      if (selectedCurrency === targetCurrency) {
        setTargetCurrency('');
      }
    } else {
      setTargetCurrency(selectedCurrency);
      setDropdownOptions(currencies.filter(currency => currency !== selectedCurrency));
      // Remove the selected currency from the options in the other dropdown
      if (selectedCurrency === baseCurrency) {
        setBaseCurrency('');
      }
    }
  }
  

  const handleButtonClick = async () => {
    setIsLoading(true);
    const response = await fetch(`https://localho.st:7064/api/GetExRateForecast/${baseCurrency}&${targetCurrency}`);
    const jsonData = await response.json();
    setData(jsonData);
    setResult(response.status === 200 ? 'Success!' : 'An error occurred while calling the API.');
    setIsLoading(false);
  };

  const baseCurrencyOptions = baseCurrency ? [baseCurrency, ...dropdownOptions] : ['Select base currency', ...dropdownOptions];
  const targetCurrencyOptions = targetCurrency ? [targetCurrency, ...dropdownOptions] : ['Select target currency', ...dropdownOptions];
  const isButtonDisabled = !baseCurrency || !targetCurrency || isLoading;

  return (
    <>
      <h1>Welcome to ExRate</h1>
      <h2>ExRate is a web app that allows you to get the exchange rate forecast for any currency pair.</h2>
      <div className={Styles.container}>
        <div className={Styles.dropdown}>
          <select id="currency1" value={baseCurrency} onChange={handleCurrencyChange}>
            {baseCurrencyOptions.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <div className={Styles.dropdown}>
          <select id="currency2" value={targetCurrency} onChange={handleCurrencyChange}>
            {targetCurrencyOptions.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <button className={Styles.button} onClick={handleButtonClick} disabled={isButtonDisabled}>Get forecast</button>
      </div>
      <div className={Styles.chart}>
        <div className={Styles.loader} style={{ display: isLoading ? 'block' : 'none' }}>
          <Loader color={root.style.getPropertyValue('--Secondary')} size={15} />
        </div>
        <canvas id="chart" style={{ display: isLoading ? 'none' : 'block' }}></canvas>
      </div>
    </>
    );
}