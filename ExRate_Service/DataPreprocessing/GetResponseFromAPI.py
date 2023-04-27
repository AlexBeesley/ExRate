import os
import requests

from dotenv import load_dotenv


class GetResponseFromAPI:
    def __init__(self):
        load_dotenv()
        self.headers = {
            "apikey": os.getenv("API_KEY")
        }
        self.payload = {}

    def get_time_series(self, base, symbols, start_date, end_date):
        url = "https://api.apilayer.com/exchangerates_data/timeseries?base={}&symbols={}&start_date={}&end_date={}"\
            .format(base, symbols, start_date, end_date)
        response = requests.request("GET", url, headers=self.headers, data=self.payload)
        response.raise_for_status()
        return response.json()
