import requests
import os
from azure.identity import DefaultAzureCredential, ClientSecretCredential
from azure.keyvault.secrets import SecretClient


class GetResponseFromAPI:
    def __init__(self):
        self.vault_url = "https://exchangerates-data.vault.azure.net/"
        self.secret_name = "exchangerates-data"
        self.credential = self.get_credential()
        self.client = SecretClient(vault_url=self.vault_url, credential=self.credential)
        self.headers = {
            "apikey": self.client.get_secret(self.secret_name).value
        }
        self.payload = {}

    def get_credential(self):
        if os.environ.get("DOTNET_RUNNING_IN_CONTAINER") == "true":
            return ClientSecretCredential(
                tenant_id="8f962d2b-fa24-43d2-be9c-887d97b9e926",
                client_id="11378dec-77e9-4b44-aa09-8d747940b005",
                client_secret="LNK8Q~v6llvpvZ1bkqn6JCeUYDjO21yhPiyq5bqf"
            )
        else:
            return DefaultAzureCredential()

    def get_time_series(self, base, symbols, start_date, end_date):
        url = "https://api.apilayer.com/exchangerates_data/timeseries?base={}&symbols={}&start_date={}&end_date={}".format(
            base, symbols, start_date, end_date)
        response = requests.request("GET", url, headers=self.headers, data=self.payload)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error. Status Code: {response.status_code}")
