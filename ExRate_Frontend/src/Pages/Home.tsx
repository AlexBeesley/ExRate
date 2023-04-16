import React from "react";
import Styles from "../Styles/home.module.scss";
import { useState, useEffect } from "react";
import CurrencyDropdown from "../Components/CurrencyDropdown";
import ForecastButton from "../Components/ForecastButton";
import Loading from "../Components/Loading";
import ErrorBox from "../Components/ErrorBox";
import ChartComponent from "../Components/ChartComponent";
import UseLoadingMessages from "../Hooks/Useloadingmessages";

export default function Home() {
  let root = document.documentElement;

  const [currencies, setCurrencies] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [baseCurrency, setBaseCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [modelType, setModelType] = useState("");
  const [dropdownOptionsForCurrencies, setDropdownOptionsForCurrencies] = useState<string[]>([]);
  const [dropdownOptionsForModels, setDropdownOptionsForModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState("unset");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNH', 'HKD', 'NZD'];
    const models = ['LSTM', 'FCNN'];
    setCurrencies(currencies);
    setModels(models);
  }, []);

  useEffect(() => {
    setDropdownOptionsForCurrencies(currencies);
  }, [currencies]);

  useEffect(() => {
    setDropdownOptionsForModels(models);
  }, [models]);

  const handleModelChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setModelType(event.target.value);
  };

  const handleButtonClick = async () => {
    console.log('Button clicked');
    setIsLoading("true");
    try {
      const postResponse = await fetch(
        `https://exrate.azurewebsites.net/api/GetExRateForecast?baseCurrency=${baseCurrency}&targetCurrency=${targetCurrency}&modelType=${modelType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log('POST response:', postResponse);

      if (postResponse.status !== 200) {
        setIsLoading("failed");
        throw new Error("Failed to fetch forecast data");
      }

      const postJsonData = await postResponse.json();
      const token = postJsonData.token;
      console.log('Token:', token);

      const getResponse = await fetchWithRetry(
        `https://exrate.azurewebsites.net/api/GetExRateForecast/${token}`,
        30000,
        600000
      );
      console.log('GET response:', getResponse);

      if (getResponse.status !== 200) {
        setIsLoading("failed");
        throw new Error("Failed to fetch forecast data");
      }

      const getJsonData = await getResponse.json();
      setData(getJsonData);
      setIsLoading("false");
    } catch (error) {
      console.error(error);
      setIsLoading("failed");
    }
  };

  const fetchWithRetry = async (url, interval, maxDuration) => {
    console.log('Fetching:', url);
    const maxAttempts = Math.floor(maxDuration / interval);
    let attempts = 0;

    while (attempts < maxAttempts) {
      const response = await fetch(url);
      console.log('Retry attempt:', attempts + 1, 'Response:', response);
      if (response.status !== 404) {
        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        return response;
      }
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error("Failed to fetch data after 5 minutes");
  };

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCurrency = event.target.value;
    if (event.target.id === 'currency1') {
      setBaseCurrency(selectedCurrency);
      setDropdownOptionsForCurrencies(currencies.filter(currency => currency !== selectedCurrency));
      if (selectedCurrency === targetCurrency) {
        setTargetCurrency('');
      }
    } else {
      setTargetCurrency(selectedCurrency);
      setDropdownOptionsForCurrencies(currencies.filter(currency => currency !== selectedCurrency));
      if (selectedCurrency === baseCurrency) {
        setBaseCurrency('');
      }
    }
  };

  const loadingMessages = [
    "Hang tight, this can take a while",
    "Initialising",
    "Loading currencies data",
    "Preprocessing data",
    "Loading model",
    "Building model",
    "Training model",
    "Predicting"
  ];
  const currentLoadingMessage = useLoadingMessages(loadingMessages);

  const baseCurrencyOptions = baseCurrency
    ? [baseCurrency, ...dropdownOptionsForCurrencies]
    : ["Select base currency", ...dropdownOptionsForCurrencies];
  const targetCurrencyOptions = targetCurrency
    ? [targetCurrency, ...dropdownOptionsForCurrencies]
    : ["Select target currency", ...dropdownOptionsForCurrencies];
  const modelOptions = modelType
    ? [modelType, ...dropdownOptionsForModels]
    : ["Select model", ...dropdownOptionsForModels];
  const isButtonDisabled =
    !baseCurrency || !targetCurrency || !modelType || isLoading === "true";

  if (isLoading !== "unset") {
    let container = document.getElementById("container");
    if (container !== null) {
      container.style.marginBottom = "0";
    }
  }

  return (
    <div className={Styles.homeContent}>
      <div className={Styles.title}>
        <h1>Welcome to ExRate</h1>
        <h2>
          This is a web app that allows you to get an exchange rate forecast
          for popular currency pairs.
        </h2>
      </div>
      <div className={Styles.container} id="container">
        <div className={Styles.dropdowns}>
          <CurrencyDropdown
            id="currency1"
            value={baseCurrency}
            options={baseCurrencyOptions}
            onChange={handleCurrencyChange}
          />
          <CurrencyDropdown
            id="currency2"
            value={targetCurrency}
            options={targetCurrencyOptions}
            onChange={handleCurrencyChange}
          />
          <CurrencyDropdown
            id="model"
            value={modelType}
            options={modelOptions}
            onChange={handleModelChange}
          />
        </div>
        <ForecastButton
          disabled={isButtonDisabled}
          onClick={handleButtonClick}
        />
      </div>
      <div className={Styles.result}>
        {isLoading === "unset" && <></> || (
          <>
            {isLoading === "true" && (
              <>
                <Loading
                  color={root.style.getPropertyValue("--secondary")}
                  size={120}
                />
                <p>{currentLoadingMessage}</p>
              </>
            )}
            {isLoading === "false" && (
              <ChartComponent
                baseCurrency={baseCurrency}
                targetCurrency={targetCurrency}
                data={data}
              />
            )}
            {isLoading === "failed" && <ErrorBox />}
          </>
        )}
      </div>
    </div>
  );
}