import Styles from '../Styles/home.module.scss';
import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import Loader from "react-spinners/PuffLoader";


export default function Home() {
  let root = document.documentElement;

  const [currencies, setCurrencies] = useState<string[]>([]);
  const [baseCurrency, setBaseCurrency] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState('unset');
  const [data, setData] = useState<any>(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNH', 'HKD', 'NZD'];
    setCurrencies(currencies);
  }, []);

  useEffect(() => {
    setDropdownOptions(currencies);
  }, [currencies]);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        const chartElement = canvasRef.current;
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
              responsive: true,
              maintainAspectRatio: false,
            }
          }
        };
        const chartConfig = {
          type: 'line',
          data: chartData,
          options: options,
        };
        const myChart = new Chart(chartElement, chartConfig);

        const resizeChart = () => {
          myChart.resize();
        };

        window.addEventListener('resize', resizeChart);

        return () => {
          window.removeEventListener('resize', resizeChart);
        };

      }, 10);
    }
  }, [data]);


  const handleButtonClick = async () => {
    setIsLoading('true');
    try {
      const response = await fetch(`https://exrate.azurewebsites.net/api/GetExRateForecast/${baseCurrency}&${targetCurrency}`);
      const jsonData = await response.json();
      setData(jsonData);
      setResult(response.status === 200 ? 'Success!' : 'An error occurred while calling the API. Status code: ' + response.status);
      console.log(result);
      setIsLoading('false');
    }
    catch (error) {
      console.error(error);
      setIsLoading('failed');
    }
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = event.target.value;
    if (event.target.id === 'currency1') {
      setBaseCurrency(selectedCurrency);
      setDropdownOptions(currencies.filter(currency => currency !== selectedCurrency));
      if (selectedCurrency === targetCurrency) {
        setTargetCurrency('');
      }
    } else {
      setTargetCurrency(selectedCurrency);
      setDropdownOptions(currencies.filter(currency => currency !== selectedCurrency));
      if (selectedCurrency === baseCurrency) {
        setBaseCurrency('');
      }
    }
  }


  const baseCurrencyOptions = baseCurrency ? [baseCurrency, ...dropdownOptions] : ['Select base currency', ...dropdownOptions];
  const targetCurrencyOptions = targetCurrency ? [targetCurrency, ...dropdownOptions] : ['Select target currency', ...dropdownOptions];
  const isButtonDisabled = !baseCurrency || !targetCurrency || isLoading === 'true';


  //dirty style hack I know...
  if (isLoading !== 'unset') {
    let container = document.getElementById('container');
    if (container !== null) {
      container.style.marginBottom = '0';
    }
  }

  return (
    <div className={Styles.homeContent}>
      <div className={Styles.title}>
        <h1>Welcome to ExRate</h1>
        <h2>ExRate is a web app that allows you to get the exchange rate forecast for any currency pair.</h2>
      </div>
      <div className={Styles.container} id="container">
        <div className={Styles.dropdowns}>
          <select id="currency1" value={baseCurrency} onChange={handleCurrencyChange}>
            {baseCurrencyOptions.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
          <select id="currency2" value={targetCurrency} onChange={handleCurrencyChange}>
            {targetCurrencyOptions.map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </div>
        <button className={Styles.button} onClick={handleButtonClick} disabled={isButtonDisabled}>Get forecast</button>
      </div>
      <div className={Styles.result}>
        {isLoading === 'unset' && (
          <></>
        ) || isLoading === 'true' && (
          <div className={Styles.loader}>
            <Loader color={root.style.getPropertyValue('--secondary')} size={120} />
          </div>
        ) || isLoading === 'false' && (
          <div className={Styles.chartContainer}>
            <canvas className={Styles.chart} id="Chart" ref={canvasRef} />
          </div>
        ) || isLoading === 'failed' && (
          <div className={Styles.error}>
            <h3>Oops! Something went wrong.</h3>
            <p>Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
}