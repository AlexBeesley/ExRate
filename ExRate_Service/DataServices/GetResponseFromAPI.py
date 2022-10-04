import requests

# API key: 7Kggh7lfPJ12j0BadbKgpSTUGJ5m8s6N

payload = {}
headers = {
    "apikey": "7Kggh7lfPJ12j0BadbKgpSTUGJ5m8s6N"
}


def getCurrent(FROM, TO):
    url = "https://api.apilayer.com/exchangerates_data/convert?to={}&from={}&amount=1".format(TO, FROM)
    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()


def getTimeSeries(base, symbols, start_date, end_date):
    url = "https://api.apilayer.com/exchangerates_data/timeseries?base={}&symbols={}&start_date={}&end_date={}".format(
        base, symbols, start_date, end_date)
    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()
