class PercentageDifferenceCalculator:

    def percentage_difference(self, arr1, arr2):
        total_diff = sum(abs(a - b) for a, b in zip(arr1, arr2))
        avg = (sum(arr1) + sum(arr2)) / (len(arr1) + len(arr2))
        return (total_diff / avg) * 100
