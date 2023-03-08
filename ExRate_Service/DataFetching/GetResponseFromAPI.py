import requests
from dotenv import load_dotenv
from Services import ErrorHandling
import os

if load_dotenv():
    pass
else:
    raise ErrorHandling.NewException("Failed to mount dotenv. \nThe dotenv file is required as it contains the API "
                                     "Key. \nEnsure this file is present in the root directory and try again.")

payload = {}

KEY = os.environ.get("API_KEY")

headers = {
    "apikey": "7Kggh7lfPJ12j0BadbKgpSTUGJ5m8s6N"
}


def getCurrent(FROM, TO):
    url = "https://api.apilayer.com/exchangerates_data/convert?to={}&from={}&amount=1".format(TO, FROM)
    response = requests.request("GET", url, headers=headers, data=payload)
    if response.status_code == '200':
        return response.json()
    else:
        print(f"Error. Status Code: {response.status_code}")


def getTimeSeries(base, symbols, start_date, end_date):
    url = "https://api.apilayer.com/exchangerates_data/timeseries?base={}&symbols={}&start_date={}&end_date={}".format(
        base, symbols, start_date, end_date)
    response = requests.request("GET", url, headers=headers, data=payload)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error. Status Code: {response.status_code}")
