# Weather Data Web Application

This Web application leverages the "Forbes Top 100 Cities Weather Data (2020-YTD)" dataset to provide both basic and advanced weather data functionalities through a RESTful API and a user-friendly front-end interface.

---

## Features

### Backend (API)
- Retrieve, create, update, or delete weather data for a city by hour.
- Retrieve hourly weather data for a city filtered by month and year.
- Retrieve average monthly temperatures for a city starting from a specific year.
- Retrieve daily total precipitation for a city by calendar month, with pagination support.
- Retrieve top or bottom extreme temperatures across cities for a specific year or previous years.

### Frontend
- Interface for interacting with the API.
- Visualization of weather trends and insights.

### Deployment
- Fully containerized using Docker and `docker-compose up`.
- Easy setup with minimal configuration.

---

## Technologies Used

- **Backend**: Django REST Framework, Python
- **Frontend**: ReactJS
- **Database**: SQLite (or optional PostgreSQL)
- **Containerization**: Docker, Docker Compose

---
### Prerequisites
- Docker and Docker Compose installed on your system.
- (Optional) Python 3.10+ and Node.js for local development.

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://gitlab.com/rug-cs/courses/web-engineering/2024-2025/students/group-60/group-60-project.git
   cd weather-app


## How to Run the Project

1. Ensure Docker is installed on your system.
2. Clone this repository and navigate to the project directory.
3. Run the following command to start the service:

   ```bash
   docker-compose up
   ```
   
Once the container is running, access the application:
http://localhost:3000/

Additionally, you can test it without the frontend at: 
http://127.0.0.1:8000/api/swagger/schema/
