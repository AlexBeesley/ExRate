from pandas import *
from DataVisualisation import GenerateGraphFromData


data = read_csv("Assets/currency_codes.csv")
abvs = data['AlphabeticCode'].tolist()
running = True


def GetUserInputs():
    base = input("""Please provide a base currency: """)
    target = input("""Please provide a target currency: """)
    return base, target


print("Welcome to ExRate")
while running:
    base, target = GetUserInputs()
    if target in abvs and base in abvs:
        GenerateGraphFromData.generateGraph(base, target)
    else:
        print("Try again; provide a correct Currency Abbreviation, e.g. GBP, USD, EUR etc.")
    print("\n")
