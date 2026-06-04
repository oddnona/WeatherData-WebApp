# 1. Technologies Used

We decided to utilise DjangoREST framework for our backend, React and Node.js for our frontend, and Axios to communicate between the front- and backend.

# 2. Requirements Fulfilment

## REQ1
We have created multiple endpoints following the 5 functionalities outlined in the project description

1. "to retrieve, create, update, or delete all available weather data for a city identified by its name in a given hour;"
   - `/weather/`
     Handles the get and post requests to the database.
   - `/weather/update_by_city/`
     Handles the put requests to the database. The update and delete requests had to be made as an extension of the /weather/ endpoint due to the way Django automatically assigns endpoints for all CRUD requests based on primary key, which we did not want to use.
   - `/weather/destroy_by_city/`
     Handles the delete requests to the database.

2. "to retrieve all available hourly weather data (at minimum all information related to temperature, precipitation including rain and snow, and wind) for a city identified by its name, filtered for a specific month and year;"
   - `/weather/hourly/`
     The endpoint returns pages (based on how many days there are in that month) that contain the hourly data of an entire month of a specific year.

3. "to retrieve the average temperature per month at a given city starting from a specific year;"
   - `/weather/avg_temp/`
     The endpoint returns the average temperature per month of a specified year and displays the data in a chart. 

4. " to retrieve the amount of total precipitation per day at a given city and for a given calendar month (e.g. all available Novembers), returned in batches of M = {10, 20, 50, 100};"
   - `/weather/precipitation/`
     The endpoint retrieves all the days of the specified month across all available years, and adds up the precipitation per day, before returning the data sorted into different batches, as is written alongside it.

5. "to retrieve the top or bottom N, N ≥ 1 maximum observed temperatures across all cities either for a specific year or for the previous M, M ≥ 1 years, including the information about the specific hour and city where this temperature was observed."
   - `/weather/extreme_temps/`
     The endpoint returns however many entries the user wants(N ≥ 1), with a selection of the highest and lowest temperatures. The input also requires either a specific year or the previous M years, does not accept both. Returns the required information.

## REQ2
All requests to the backend are responded with an application/json file. Additionally, the data can be converted from application/json to text/csv in the /weather/ endpoint, when data is retrieved with GET.

## REQ3
The specification can be found in the `.\documentation\API_Group_60.yaml` file.

## REQ4
The API is implemented as the backend of our app. We are using DjangoREST and the code for this can be found in `.\api\`.

## REQ5
The frontend is implemented and can be found in the `.\frontend\` folder. We are using React and Node.js for this.

## REQ6
`Docker-compose.yml` is set up and fully functional in the root directory of the project. The file can be compiled with `docker-compose up`

## REQ7
This document is filled.

## REQ8
The file `.\documentation\REQ8.md` outlines the prompts we used for when we used an LLM during development.

# 3. Maturity of RESTful API

Our API should be classified at level 2 maturity. We have implemented quite a few of the features found in level 2 and lower maturity REST APIs, such as resource based URLs being used to communicate, and the correct utilisation of the HTTP status codes and verbs. We lie short of reaching level 3 maturity, as we have not implemented HATEOAS & SI. 

Potential issues with the code would include the way we are handling input validation in certain parts of the code, and the numeric values are mostly not being tested to see if they are within range. Also, we could have done more extensive error handling. Besides this, we could have probably optimised the code better given more time, taking some key recurring parts of the `viewsets.py` file and the frontend components.

# 4. Work Distribution

The work was distributed what we felt was evenly among us, with each of us taking one of the 3 parts of the work. The distribution was as such:

- Backend: Ali
- Frontend: Nona
- Documentation and Docker: Hristo

However, it should be noted that there were quite a few times where we had to work on a section that was not ours, so we all ended up working on all 3 parts.