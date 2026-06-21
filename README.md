# Weather Data Web Application

A full-stack weather data web application built with Django REST Framework and React. Used to query, create, update, delete, analyze, and visualize historical weather records from the **Forbes Top 100 Cities Weather Data (2020-YTD)** dataset.

The application includes a REST API, interactive frontend pages, chart-based visualizations, API documentation, and Docker-based setup for running the backend and frontend together.

## Tech Stack

### Backend

* Python 3.10
* Django 5
* Django REST Framework
* SQLite
* drf-yasg
* django-cors-headers
* Django ORM
* Swagger and Redoc API documentation

### Frontend

* React
* React Router
* Axios
* Recharts
* CSS
* Create React App

### Deployment and Tooling

* Docker
* Docker Compose
* pip
* npm

## Key Features

* Retrieve weather data for a city at a specific date and hour
* Create new weather records
* Update existing weather records by city and timestamp
* Delete weather records by city and timestamp
* Filter hourly weather data by city, month, and year
* View paginated hourly weather data
* Retrieve average monthly temperatures for a city and year
* Retrieve daily precipitation totals for a city and month
* Choose precipitation batch sizes for grouped API responses
* Retrieve top or bottom extreme temperatures across cities
* Search extreme temperatures by specific year or by previous years
* Display weather results as JSON or CSV
* Visualize temperature and precipitation trends with charts
* Navigate between frontend pages with React Router
* Access interactive backend API documentation through Swagger and Redoc
* Run the backend and frontend together with Docker Compose

## Application Overview

This project is split into a Django backend and a React frontend.

The backend exposes weather data through a REST API. Weather records include the city, timestamp, temperature, precipitation, rain, and snowfall. The API supports basic CRUD operations and several custom analytical endpoints.

The frontend provides a user-friendly interface for interacting with the API. The user can select a city, date, month, year, or query type, then view the returned weather data in tables, JSON, or CSV format.

## Dataset

The application is designed around the **Forbes Top 100 Cities Weather Data (2020-YTD)** dataset.

The backend stores weather data using a `Weather` model with these fields:

* `city`
* `date_time`
* `temperature`
* `precipitation`
* `rain`
* `snowfall`

The project also includes a CSV parser that can import selected weather columns into the Django database.

## Backend API

The backend is built with Django REST Framework. The main API resource is the `Weather` model, exposed through a `WeatherViewSet`.

### Main Weather Endpoint

```text
/api/weather/
```

This endpoint supports retrieving, creating, updating, and deleting weather records.

A weather record can be queried by city and exact timestamp:

```text
/api/weather/?city=Amsterdam&hour=2024-12-13T10:00:00
```

### Custom API Endpoints

```text
/api/weather/update_by_city/
/api/weather/destroy_by_city/
/api/weather/avg_temp/
/api/weather/precipitation/
/api/weather/hourly/
/api/weather/extreme_temps/
```

### API Functionality

The API supports:

* **Single-record lookup:** retrieve weather data for a city and hour
* **Create:** add a new weather record
* **Update:** update a weather record by city and timestamp
* **Delete:** delete a weather record by city and timestamp
* **Average temperature:** calculate average monthly temperatures for a city and year
* **Daily precipitation:** calculate daily precipitation totals for a city and month
* **Hourly data:** return hourly weather data with pagination
* **Extreme temperatures:** retrieve the highest or lowest temperatures for a year or previous years

## Frontend

The frontend is built with React and communicates with the backend through Axios.

The app includes separate pages/components for:

* weather record CRUD operations
* average monthly temperature
* hourly weather data
* daily precipitation
* extreme temperatures
* start page and visual feedback components

React Router is used for navigation between pages. Recharts is used to display line charts for temperature and precipitation data.

## Data Visualization

The frontend includes visualizations for:

* monthly average temperature trends
* hourly temperature variation
* hourly precipitation values
* daily precipitation totals

For single weather records, the app can display the response as JSON or convert the response into CSV format.

## API Documentation

The backend exposes API documentation through Swagger and Redoc.

```text
/api/swagger/schema/
/api/redoc/
```

These pages make it easier to inspect available endpoints, parameters, request bodies, and response formats while developing or testing the API.

## Docker Setup

The application is containerized with Docker.

Docker Compose starts two services:

* `backend` on port `8000`
* `frontend` on port `3000`

The frontend depends on the backend and communicates with the API at:

```text
http://127.0.0.1:8000/api
```

## Project Structure

```text
WeatherData-WebApp
├── api/                    # Django app for weather models, serializers, API views, viewsets, URLs, and CSV parsing
│   ├── models.py           # Weather data model
│   ├── serializers.py      # Weather serializer
│   ├── viewsets.py         # REST API and analytical endpoints
│   ├── views.py            # Function-based CRUD view
│   ├── urls.py             # API routing and Swagger/Redoc routes
│   └── csv_parser.py       # CSV import helper
├── documentation/          # API design and requirement documentation
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/            # Axios API client
│   │   ├── components/     # Weather, hourly, precipitation, average temperature, and extreme temperature pages
│   │   ├── App.js          # React Router setup
│   │   └── App.css         # Main styling
│   ├── Dockerfile
│   └── package.json
├── weather_app/            # Django project settings and root URLs
├── weatherdata/            # Dataset-related project files
├── Dockerfile              # Backend Dockerfile
├── docker-compose.yml      # Backend and frontend services
├── requirements.txt        # Python dependencies
├── db.sqlite3              # SQLite database
└── manage.py
```

## Architecture

The project follows a client-server architecture.

The Django backend owns the data model, database access, serialization, validation, and API responses. The `Weather` model defines the structure of each weather record, and the `WeatherSerializer` converts model instances into JSON responses.

The `WeatherViewSet` handles the main REST API logic. It supports direct record lookup and custom endpoints for aggregation, filtering, pagination, and extreme temperature queries. The backend uses Django ORM queries to calculate monthly averages, daily precipitation totals, and sorted temperature extremes.

The React frontend is responsible for user interaction and data presentation. Each feature has its own component, and each component sends requests to the backend using the shared Axios client. After receiving data, the frontend renders tables, charts, error messages, JSON output, or CSV output depending on the page and user action.

Docker Compose connects the two services so the frontend and backend can be started together with one command.

## Design Highlights

This project demonstrates:

* Full-stack application development with Django and React
* REST API design with Django REST Framework
* Model serialization and validation
* Query parameter filtering
* Aggregation with Django ORM
* Pagination for larger result sets
* React component-based UI design
* API integration with Axios
* Data visualization with Recharts
* Dockerized development workflow
* API documentation with Swagger and Redoc
* Basic CSV import logic for dataset ingestion

## Getting Started

### Prerequisites

* Docker
* Docker Compose

For local development without Docker:

* Python 3.10+
* Node.js
* npm

### Running with Docker

Clone the repository:

```bash
git clone https://github.com/oddnona/WeatherData-WebApp.git
cd WeatherData-WebApp
```

Start the application:

```bash
docker-compose up
```

Open the frontend:

```text
http://localhost:3000/
```


## Local Development

### Backend

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Run database migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend runs at:

```text
http://127.0.0.1:8000/
```


## Example API Requests

Retrieve one weather record:

```text
GET /api/weather/?city=Amsterdam&hour=2024-12-13T10:00:00
```

Retrieve average monthly temperature:

```text
GET /api/weather/avg_temp/?city=Amsterdam&year=2024
```

Retrieve hourly weather data:

```text
GET /api/weather/hourly/?city=Amsterdam&month=12&year=2024&page=1&page_size=24
```

Retrieve daily precipitation totals:

```text
GET /api/weather/precipitation/?city=Amsterdam&month=12&batch_size=20
```

Retrieve highest temperatures:

```text
GET /api/weather/extreme_temps/?N=10&extreme_type=top&year=2024
```

Retrieve lowest temperatures from previous years:

```text
GET /api/weather/extreme_temps/?N=10&extreme_type=bottom&M=3
```

## Current Limitations

* The project currently uses SQLite, which is convenient for development but should be replaced with PostgreSQL or another production-ready database for deployment.
* The Django settings are development-oriented and should be changed before production deployment.
* Authentication and authorization are not implemented yet.
* The app currently focuses on recent historical dataset queries rather than live weather API integration.
* More automated backend and frontend tests could be added.
