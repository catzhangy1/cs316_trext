import csv

###################################################################################
## Column               Data
## 1                    Origin
## 2                    Destination
## 3                    Hotel Property
## 4                    Hotel Nights Stay
## 5                    Hotel Check In Date
## 6                    Hotel Check Out Date
## 7                    Expedia Package Price per Person
## 8                    JetBlue Package Price per Person
## 9                    Savings (compared to Expedia)
## 10                   Advance Weeks (0: within 1 week; 1: 1-2 weeks; 2: 2-4 weeks)
## 11                   Count (always 1)
####################################################################################
def parseResume(filename = "jetblue-getaways.csv"):

    with open(filename) as f:
        data = [tuple(line) for line in csv.reader(f)]

    return data