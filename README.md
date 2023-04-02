# ExRate ~ CI601 The Computing Project
2022 Semesters 1 and 2

This project aims to answer the following academic question:
'Can Machine Learning forecast exchange rates within a 5% margin of error?'

The three compnents of this project are the following:
- ExRate Service - A Pyhton script which gets exchange rates from a thrid party API and uses this data to train an LSTM model via TensorFlow and Keras.
- ExRate API - A .NET API which calls the Service script to get exchange rate forecast data which is returned as JSON.
- ExRate Frontend - A React SPA which is built with TypeScript, this consumes the ExRate API and demonstrates how it can be used.

While the purpose of this project is answer the academic question, this project was built using Agile industry-standard software development techniques and demonstrates the understanding of the candidate across a variety of frameworks, languages and technologies.

## ExRate Service

This service is responsible for collecting exchange rate data, this data is collected from apilayer.com and its documentation is available [here](https://apilayer.com/marketplace/exchangerates_data-api?live_demo=show). Once the Data is collected, the service will automatically train an LSTM model using TensorFlow and Keras, more information will be available on how that is handled in the CI601 report produced as part of this project.

### Requirments
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

### Usage
To run the script with user input from the command line use:

`py Program.py`

and without user input, run:

`py Program.py -b [base currentecy arbvs] -t [target currentecy arbvs]`

Examples:

`py Program.py -b USD -t GBP`

`py Program.py -b CAD -t AUD`

A list of acceptable currencies can be found in the `ExRate_Service/Assets/currency_codes.csv` file.



### License

[GPL 3.0](https://choosealicense.com/licenses/gpl-3.0/)

### Author
[David (Alexander) Beesley](https://github.com/AlexBeesley)
