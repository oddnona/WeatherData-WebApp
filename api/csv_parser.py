from .models import Weather
import csv
from datetime import datetime

#This file is a parser to filter out the columns that we will be using in the database from the .csv file

def parse_csv(csv_file):

    with open(csv_file, 'r') as f:
        reader = csv.reader(f, delimiter=',')
        for i,row in enumerate(reader):
            if i == 0:
                continue
            # parse csv -> Django object model
            print(row)
            try: 
                Weather.objects.create(city=row[0], 
                        date_time=datetime.strptime(row[1], "%Y-%m-%d %H:%M:%S"),
                        temperature = None if row[2] == "" else row[2],
                        precipitation = None if row[3] == "" else row[3], 
                        rain = None if row[4] == "" else row[4], 
                        snowfall = None if row[5] == "" else row[5]
                )
            except Exception: 
                print("Failed to import value.")