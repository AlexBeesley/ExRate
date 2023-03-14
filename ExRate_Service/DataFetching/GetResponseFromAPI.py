import requests

import os
from azure.identity import DefaultAzureCredential, ClientSecretCredential
from azure.keyvault.secrets import SecretClient

vault_url = "https://exchangerates-data.vault.azure.net/"
secret_name = "exchangerates-data"

if os.environ.get("DOTNET_RUNNING_IN_CONTAINER") == "true":
    credential = ClientSecretCredential(
        tenant_id="8f962d2b-fa24-43d2-be9c-887d97b9e926",
        client_id="11378dec-77e9-4b44-aa09-8d747940b005",
        client_secret="LNK8Q~v6llvpvZ1bkqn6JCeUYDjO21yhPiyq5bqf"
    )
else:
    credential = DefaultAzureCredential()

client = SecretClient(vault_url=vault_url, credential=credential)

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
