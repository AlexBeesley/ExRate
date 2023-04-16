# ExRate ~ CI601 The Computing Project
2022 Semesters 1 and 2

This project aims to answer the following academic question:
'Can Machine Learning forecast exchange rates within a 5% margin of error?'

The three components of this project are the following:
- ExRate Service - A Python script which gets exchange rates from a third-party API and uses this data to train an LSTM model via TensorFlow and Keras.
- ExRate API - A .NET API which calls the Service script to get exchange rate forecast data which is returned as JSON.
- ExRate Frontend - A React SPA which is built with TypeScript and WebPack. It consumes the ExRate API and demonstrates how it can be used.

While the purpose of this project is to answer the academic question, this project was built using Agile industry-standard software development techniques and demonstrates the understanding of the candidate across a variety of frameworks, languages and technologies.

# ExRate Service

This service is responsible for collecting exchange rate data, this data is collected from apilayer.com and its documentation is available [here](https://apilayer.com/marketplace/exchangerates_data-api?live_demo=show).

This service offers two types of models, a Fully Connected Neural Network (FCNN) and a Long Short-Term Memory (LSTM) model, for the prediction task.

## Requirments

| Package Name  | Required Version |
|---------------|------------------|
| Python        | >= 3.10.9        |
| numpy         | >= 1.23.4        |
| pandas        | >= 1.5.1         |
| requests      | >= 2.28.1        |
| python-dotenv | >= 0.21.0        |
| tensorflow    | >= 2.8.0         |
| scikit-learn  | >= 1.2.0         |
| keras         | >= 2.11.0        |
| matplotlib    | >= 3.6.1         |


Use `pip install [Package Name]==[Required Version]` to install the required packages.

## Usage
First, make sure to obtain an API key for the exchange rates data from a service like apilayer. Add your API key to a `.env` file in the project's root directory:

```
API_KEY=YOUR_API_KEY_HERE
```

Run the `Program.py` script with the required arguments:

```cmd
python Program.py -b BASE_CURRENCY -t TARGET_CURRENCY -m MODEL_TYPE
```

- `BASE_CURRENCY`: The 3-letter code for the base currency (e.g., USD, GBP, EUR).
- `TARGET_CURRENCY`: The 3-letter code for the target currency (e.g., USD, GBP, EUR).
- `MODEL_TYPE`: The type of model to use for prediction. Use `FCNN` for Fully Connected Neural Network or `LSTM` for Long Short-Term Memory model.

For example:

```cmd
python Program.py -b USD -t EUR -m FCNN
```

Alternatively, you can run the `Program.py` script without arguments and provide the required information when prompted:

```cmd
python Program.py
```

```
Welcome to ExRate
Please provide a base currency: USD
Please provide a target currency: EUR
Please provide a model type (FCNN or LSTM): FCNN
```
The script will display the historical exchange rates data, the predicted exchange rates for the next week, and the model's accuracy. If running without command line arguments, a graph will also be displayed showing the historical data and the predicted values.

# ExRate API
This component is responsible for running the ExRate_Service Python script and returning the result as JSON. It is a .NET 6 API service which is set up to run locally or inside a Docker container.
## Running locally
### Requirments
- .NET 6 SDK
### Setup
First open the `appsettings.json` file, then replace the paths with the following:

```json
  "LocalConfig": {
    "PythonExecutablePath": "/path/to/your/python3.9",
    "ScriptPath": "/path/to/your/ExRate/ExRate_Service/Program.py"
  }
```

To start the API server, run the following commands from the `/ExRate_API/ExRate_API` directory:
```
dotnet restore

dotnet run
```
## Running inside a Docker container
### Requirments
- Docker 20.10.21 or higher
### Setup
Before building the container, ensure you have Docker installed and Docker Desktop running.

From the root folder, build the container with the following command:

`docker build -t exrate .`

then run the following command to start the container:

`docker run -ti --rm -p PORT:80 exrate`

Where `PORT` is the port number you want to expose. Then the API will be accessible on `http://localhost:PORT` (e.g http://localhost:8080)

## API Endpoints
```
POST /api/GetExRateForecast
```
With the following query parameters:
- `baseCurrency` - the base currency (e.g. `USD`)
- `targetCurrency` - the target currency (e.g. `GBP`)
- `modelType` - the model type (e.g. `LSTM`)

Putting this together would result in:

```
POST /api/GetExRateForecast?ites.net/api/GetExRateForecast?baseCurrency=USD&targetCurrency=GBP&modelType=LSTM
```

This request will return a JSON response containing a process token, in this format:

```json
{
    "token": GUID
}
```

Note that each `POST` request will return its own guid and start a separate process. 

Take this `GUID` (which will look something like `c76b2ddd-f5c7-4e09-b147-5ec8f4137429`) and apply it to the following request to get the forecast once the model has been built, for example:

```
GET /api/GetExRateForecast/c76b2ddd-f5c7-4e09-b147-5ec8f4137429
```
This will return `404 Not Found` until the forecast has been processed - which usually takes between 2 and 5 minutes to complete.

Once the forecast has been processed, it will be returned as a json with `200 OK`. Here is an example of how this response looks:

```json
{
  "historicalData": {
    "2022-04-06": 0.765115,
    "2022-04-07": 0.76518,
    "2022-04-08": 0.767142,
    "2022-04-09": 0.768149,
	. . .
    "2023-04-02": 0.813715,
    "2023-04-03": 0.80499,
    "2023-04-04": 0.80015,
    "2023-04-05": 0.8024
  },
  "forecast": {
    "2023-04-06": 0.8083399,
    "2023-04-07": 0.8152494,
    "2023-04-08": 0.8184916,
    "2023-04-09": 0.8095991,
    "2023-04-10": 0.8039013,
    "2023-04-11": 0.8244032,
    "2023-04-12": 0.86308336
  }
}
```

`historicalData` containes the exchange rates of the selected currencies for the past year and `forecast` contains the the 7-day forecast.

# ExRate Frontend
This is a Single-Page App built using the popular JavaScript framework, React. Its aim is to demonstrate how the ExRate API can be used.
## Requirements
- node.js 16.7.1^
- yarn 1.22.19^
## Usage
From the `/ExRate_Frontend` directory, you can load dependencies simply with:

`yarn`

Then to run the site locally:

`yarn start`

This should open the site in the browser by default, but you can also access it via `http://localhost:8080/`.

To build the site:

`yarn build`
#
### License
[GPL 3.0](https://choosealicense.com/licenses/gpl-3.0/)
### Author
[David (Alexander) Beesley](https://github.com/AlexBeesley)