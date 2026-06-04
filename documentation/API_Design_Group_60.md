# API Design Document

## API Name: Weather API
**Version**: 1.0.0  
**Description**: This API allows users to manage and retrieve weather data. It supports operations to fetch, create, update, and delete weather data, as well as specialized endpoints for weather insights.
**Disclaimer**: Small portions of this file (formats and markdown formatting) and the example returns from the .yaml specification files were generated using OpenAI's ChatGPT model. 


---

## Endpoints

### 1. `/weather`

#### GET: Retrieve Weather Data
- **Description**: Retrieve weather data for a specific city and hour.
- **Query Parameters**:
  - `city` (string, required): City name.
  - `hour` (string, required): Specific hour (format: `YYYY-MM-DDTHH:MM:SSZ`).
- **Response**:
  - `200`: Weather data (JSON/CSV).
  - `400`: Invalid parameters.
  - `404`: City/hour not found.
  - `500`: Server error.

#### POST: Create Weather Data
- **Description**: Add a new weather data entry.
- **Request Body**: Weather data in JSON or CSV format.
- **Response**:
  - `200`: Data created.
  - `400`: Invalid input.
  - `500`: Server error.

#### PUT: Update Weather Data
- **Description**: Update weather data for a city and hour.
- **Query Parameters**:
  - `city` (string, required): City name.
  - `hour` (string, required): Specific hour (format: `YYYY-MM-DDTHH:MM:SSZ`).
- **Request Body**: Updated weather data in JSON or CSV format.
- **Response**:
  - `200`: Data updated.
  - `400`: Invalid input.
  - `404`: City/hour not found.
  - `500`: Server error.

#### DELETE: Delete Weather Data
- **Description**: Remove weather data for a city and hour.
- **Query Parameters**:
  - `city` (string, required): City name.
  - `hour` (string, required): Specific hour (format: `YYYY-MM-DDTHH:MM:SSZ`).
- **Response**:
  - `200`: Data deleted.
  - `404`: City/hour not found.
  - `500`: Server error.

---

### 2. `/weather/hourly`

#### GET: Retrieve Hourly Weather Data
- **Description**: Fetch hourly weather data for a city for a specific month and year.
- **Query Parameters**:
  - `city` (string, required): City name.
  - `month` (string, required): Month and year (`YYYY-MM`).
- **Response**:
  - `200`: Hourly weather data (JSON/CSV).
  - `400`: Invalid parameters.
  - `404`: Data not found.
  - `500`: Server error.

---

### 3. `/weather/average-temperature`

#### GET: Retrieve Average Monthly Temperatures
- **Description**: Get average temperature per month for a city starting from a given year.
- **Query Parameters**:
  - `city` (string, required): City name.
  - `startYear` (integer, required): Starting year.
- **Response**:
  - `200`: Average temperature data (JSON/CSV).
  - `400`: Invalid parameters.
  - `404`: Data not found.
  - `500`: Server error.

---

### 4. `/weather/precipitation-per-day`

#### GET: Retrieve Daily Precipitation Totals
- **Description**: Fetch total precipitation per day for a city in a given month.
- **Query Parameters**:
  - `city` (string, required): City name.
  - `month` (string, required): Month (`YYYY-MM`).
  - `batchSize` (integer, optional): Results per batch (`10/20/50/100`, default: `10`).
- **Response**:
  - `200`: Precipitation data (JSON/CSV).
  - `400`: Invalid parameters.
  - `404`: Data not found.
  - `500`: Server error.

---

### 5. `/weather/max-temperatures`

#### GET: Retrieve Top/Bottom Observed Temperatures
- **Description**: Get the top or bottom N temperatures for all cities, for a specific year or the last M years.
- **Query Parameters**:
  - `N` (integer, required): Number of temperatures to retrieve.
  - `year` (integer, optional): Specific year.
  - `previousYears` (integer, optional): Number of years to look back.
  - `order` (string, optional): Either `top` or `bottom` (default: `top`).
- **Response**:
  - `200`: Temperature data (JSON/CSV).
  - `400`: Invalid parameters.
  - `404`: Data not found.
  - `500`: Server error.