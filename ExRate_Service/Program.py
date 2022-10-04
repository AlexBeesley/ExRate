from DataVisualisation import GenerateGraphFromData

print("Welcome to ExRate")
base = input("""Please provide a base currency.
>>> """)
target = input("""Please provide a target currency.
>>> """)
GenerateGraphFromData.generateGraph(base, target)
