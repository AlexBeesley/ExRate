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

This service is responsible for collecting exchange rate data, this data is collected from apilayer.com and its documentation is available [here](https://apilayer.com/marketplace/exchangerates_data-api?live_demo=show). Once the Data is collected, the service will automatically train an LSTM model using TensorFlow and Keras, more information will be available on how that is handled in the CI601 report produced as part of this project.

## Requirments
- Python 3.10.9 with pip


| Package Name  | Required Version |
|---------------|------------------|
| numpy         | 1.23.4 < 2.0.0   |
| pandas        | 1.5.1 < 2.0.0    |
| requests      | 2.28.1 < 3.0.0   |
| python-dotenv | 0.21.0 < 1.0.0   |
| tensorflow    | 2.8.0 < 3.0.0    |
| scikit-learn  | 1.2.0 < 2.0.0    |
| keras         | 2.11.0 < 3.0.0   |
| matplotlib    | 3.6.1 < 4.0.0    |

use `pip install [Package Name]==[Required Version]` to install the required packages.

## Usage
From the `/ExRate_Service` directory, run the script with user input from the command line use:

`py Program.py`

and without user input, run:

`py Program.py -b [BASE_CURRENCY] -t [TARGET_CURRENCY] -m [MODEL_TYPE]`

Where `BASE_CURRENCY` and `TARGET_CURRENCY` are  3-letter currency codes. `MODEL_TYPE` lets you choose between using an FCNN and LSTM model.

A list of acceptable currencies can be found in the `ExRate_Service/Assets/currency_codes.csv` file.
# ExRate API
This component is responsible for running the ExRate_Service Python script and returning the result as JSON. It is a .NET 6 API service which is set up to run locally or inside a Docker container.
## Running locally
### Requirments
- .NET 6 SDK
- ASP.NET core
### Setup
To start the API server, run the following from the `/ExRate_API/ExRate_API` directory:

`dotnet run`
## Running inside a Docker container
### Requirments
- Docker 20.10.21^
### Setup
Before building the container, ensure you have Docker installed and Docker Desktop running.

From the root folder, build the container with the following command:

`docker build -t exrate .`

then run the following command to start the container:

`docker run -ti --rm -p 8081:80 exrate`

This will run the API inside the Docker container, which can be accessed locally on port 8081. To assign the API to another port, just change the port used in the above command.
## Usage
Whether you are running the API in docker or locally, to make a request use the following URL schema:

`http://localhost:[PORT]/api/GetExRateForecast/[BASE_CURRENCY]&[TARGET_CURRENCY`

Where `PORT` is the port being used; `BASE_CURRENCY` and `TARGET_CURRENCY` are 3-letter currency codes. For example: `http://localhost:8080/api/GetExRateForecast/USD&EUR`
# ExRate Frontend
This is a Single-Page App built using the popular JavaScript framework, React. Its aim is to demonstrate how the ExRate API can be used.
## Requirements
- node.js 16.7.1^
- yarn 1.22.19^
## Usage
From the `/ExRate_Frontend` directory, you can load dependencies simplicity with:

`yarn`

Then to run the site locally:

`yarn start`

This should open the site in the browser by default, but you can also access it via `http://localhost:8080/`.

and to build the site:

`yarn build`
#
### License
[GPL 3.0](https://choosealicense.com/licenses/gpl-3.0/)
### Author
[David (Alexander) Beesley](https://github.com/AlexBeesley)

