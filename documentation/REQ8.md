# Description of AI Use in project  

# GPT-4o/GPT4o-mini - non-paid version

1. here is my design file for my web engineering project: 
<blockquote>

```lua   
# API Design Document

## API Name: Weather API
**Version**: 1.0.0  
**Description**: This API allows users to manage and retrieve weather data. It supports operations to fetch, create, update, and delete weather data, as well as specialized endpoints for weather insights.
**Disclaimer**: Small portions of this file (formats and markdown formatting) and the example returns from the .yaml specification files were generated using OpenAI's ChatGPT model. 


---

## Endpoints

### 1. /weather

#### GET: Retrieve Weather Data
- **Description**: Retrieve weather data for a specific city and hour.
- **Query Parameters**:
  - city (string, required): City name.
  - hour (string, required): Specific hour (format: YYYY-MM-DDTHH:MM:SSZ).
- **Response**:
  - 200: Weather data (JSON/CSV).
  - 400: Invalid parameters.
  - 404: City/hour not found.
  - 500: Server error.

#### POST: Create Weather Data
- **Description**: Add a new weather data entry.
- **Request Body**: Weather data in JSON or CSV format.
- **Response**:
  - 200: Data created.
  - 400: Invalid input.
  - 500: Server error.

#### PUT: Update Weather Data
- **Description**: Update weather data for a city and hour.
- **Query Parameters**:
  - city (string, required): City name.
  - hour (string, required): Specific hour (format: YYYY-MM-DDTHH:MM:SSZ).
- **Request Body**: Updated weather data in JSON or CSV format.
- **Response**:
  - 200: Data updated.
  - 400: Invalid input.
  - 404: City/hour not found.
  - 500: Server error.

#### DELETE: Delete Weather Data
- **Description**: Remove weather data for a city and hour.
- **Query Parameters**:
  - city (string, required): City name.
  - hour (string, required): Specific hour (format: YYYY-MM-DDTHH:MM:SSZ).
- **Response**:
  - 200: Data deleted.
  - 404: City/hour not found.
  - 500: Server error.

---

### 2. /weather/hourly

#### GET: Retrieve Hourly Weather Data
- **Description**: Fetch hourly weather data for a city for a specific month and year.
- **Query Parameters**:
  - city (string, required): City name.
  - month (string, required): Month and year (YYYY-MM).
- **Response**:
  - 200: Hourly weather data (JSON/CSV).
  - 400: Invalid parameters.
  - 404: Data not found.
  - 500: Server error.

---

### 3. /weather/average-temperature

#### GET: Retrieve Average Monthly Temperatures
- **Description**: Get average temperature per month for a city starting from a given year.
- **Query Parameters**:
  - city (string, required): City name.
  - startYear (integer, required): Starting year.
- **Response**:
  - 200: Average temperature data (JSON/CSV).
  - 400: Invalid parameters.
  - 404: Data not found.
  - 500: Server error.

---

### 4. /weather/precipitation-per-day

#### GET: Retrieve Daily Precipitation Totals
- **Description**: Fetch total precipitation per day for a city in a given month.
- **Query Parameters**:
  - city (string, required): City name.
  - month (string, required): Month (YYYY-MM).
  - batchSize (integer, optional): Results per batch (10/20/50/100, default: 10).
- **Response**:
  - 200: Precipitation data (JSON/CSV).
  - 400: Invalid parameters.
  - 404: Data not found.
  - 500: Server error.

---

### 5. /weather/max-temperatures

#### GET: Retrieve Top/Bottom Observed Temperatures
- **Description**: Get the top or bottom N temperatures for all cities, for a specific year or the last M years.
- **Query Parameters**:
  - N (integer, required): Number of temperatures to retrieve.
  - year (integer, optional): Specific year.
  - previousYears (integer, optional): Number of years to look back.
  - order (string, optional): Either top or bottom (default: top).
- **Response**:
  - 200: Temperature data (JSON/CSV).
  - 400: Invalid parameters.
  - 404: Data not found.
  - 500: Server error. 
 ```
 </blockquote>

2. can you help me generate a specification for this file?

3. can you also include the fully serialized object for each response
4. 
    3. to retrieve, create, update, or delete all available weather data for a city
identified by its name in a given hour;
       2.  to retrieve all available hourly weather data (at minimum all information
related to temperature, precipitation including rain and snow, and wind)
for a city identified by its name, filtered for a specific month and year;
   3.  to  retrieve  the  average  temperature  per  month  at  a  given  city  starting
   from a specific year;
   4.  to retrieve the amount of total precipitation per day at a given city and for
   a given calendar month (e.g. all available Novembers), returned in batches
   of
   M
   =
   {
   10
   ,
   20
   ,
   50
   ,
   100
   }
   ;
   5.  to retrieve the top or bottom
   N, N
   ≥
   1 maximum observed temperatures
   across  all  cities  either  for  a  specific  year  or  for  the  previous
   M, M
   ≥
   1
   years,  including the information about the specific hour and city where
   this temperature was observed. based on these requirements, can you generate the cases of the successful responses with example responses 
5. in the specification again
6. no generate the full specification 
7. include examples for the text/csv as well
8. why does this code      def extreme_temps(self, request):

        number_max_temperatures = request.query_params.get('N')
        extreme_type = request.query_params.get('extreme_type')
        year = request.query_params.get('year')
        number_years = request.query_params.get('M')

        try:
            number_max_temperatures = int(number_max_temperatures)
            if extreme_type not in ['top', 'bottom']:
                raise ValueError()
        except ValueError:
            return Response(
                {'error': 'Invalid value for N or type. Type must be "top" or "bottom".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = Weather.objects.all()

        if year:
            queryset = queryset.filter(date_time__year=int(year))
        elif number_years:
            current_year = datetime.now().year
            start_year = current_year - number_years + 1
            queryset = queryset.filter(date_time__year__gte=start_year)

        if extreme_type == 'top':
            temperature_sign = '-temperature'
        elif extreme_type == 'bottom':
            temperature_sign = 'temperature'

        queryset = queryset.order_by(temperature_sign)[:number_max_temperatures]
        results = []
        for entry in queryset:
            result = {'city': entry.city, 'temperature': entry.temperature, 'date_time': entry.date_time}
            results.append(result)

        return Response({'Extreme temperatures: ': results}) give this response {
  "Extreme temperatures: ": [
    {
      "city": "Abu Dhabi",
      "temperature": 44.4,
      "date_time": "2022-08-13T10:00:00Z"
    },
    {
      "city": "Abu Dhabi",
      "temperature": 44.4,
      "date_time": "2022-08-13T10:00:00Z"
    },

      "city": "Abu Dhabi",
      "temperature": 42.9,
      "date_time": "2022-07-22T09:00:00Z"
    }
  ]
}
9. whenever I run the code with specific M I get this error ypeError at /api/weather/extreme_temps/
unsupported operand type(s) for -: 'int' and 'str'

Request Method: GET
Request URL: http://127.0.0.1:8000/api/weather/extreme_temps/?N=3&extreme_type=top&M=6
Django Version: 5.1.4
Python Executable: /home/hristo/PycharmProjects/group-60-project/venv/bin/python
Python Version: 3.10.16 ,
`Exception Type: TypeError at /api/weather/extreme_temps/
Exception Value: unsupported operand type(s) for -: 'int' and 'str'
Raised during: api.viewsets.WeatherViewSet
Request information:
USER: AnonymousUser

10. whenever I give parameters n=20, bottom and m=4 this is the output I get {
  "Extreme temperatures: ": [
    {
      "city": "Abu Dhabi",
      "temperature": null,
      "date_time": "2024-10-26T01:00:00Z"
    },
    {
      "city": "Abu Dhabi",
      "temperature": null,
      "date_time": "2024-10-26T02:00:00Z"
    },
   .
   .
   .
    {
      "city": "Abu Dhabi",
      "temperature": null,
      "date_time": "2024-10-26T03:00:00Z"
    },
    {
11. alright this fixed things, now I only need to take
care of the duplicate entries, I don't want to have duplicates 
whenever I call the function 
12. are viewsets better to use than views in djangorest, what are the benefits to using viewsets and are 
they appropriate to use for a webapp with scalability in mind?
13. how do I give buttons images
14. how can I change the text color from black to white for all text in the app
15. <image detailing errors related to the frontend> explain these errors pls
16. can I have multiple class names in a div?
17. ok now how do I add automatic slightly darker but still see through boxes for the text, like in this picture I found
<picture detailing what was just described>