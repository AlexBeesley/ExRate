from pandas import *
from DataVisualisation import GenerateGraphFromData


data = read_csv("Assets/currency_codes.csv")
abvs = data['AlphabeticCode'].tolist()

print("Welcome to ExRate")
base = input("""Please provide a base currency.
>>> """)
target = input("""Please provide a target currency.
>>> """)

if target and base in abvs:
    GenerateGraphFromData.generateGraph(base, target)
else:
    print("Please provide a correct Currency Abbreviation, e.g. EUR, GBP, USD etc.")
