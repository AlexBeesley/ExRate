import requests

from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient


try:
    credential = DefaultAzureCredential()
    vault_url = "https://exchangerates-data.vault.azure.net/"
    secret_name = "exchangerates-data"
    client = SecretClient(vault_url=vault_url, credential=credential)
except:
    print("An issue was encountered when trying to access Azure Vault.")

payload = {}

headers = {
    "apikey": client.get_secret(secret_name).value
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
