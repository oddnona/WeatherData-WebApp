from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Weather
from .serializers import WeatherSerializer
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework.decorators import api_view

city_param = openapi.Parameter(
    'city',
    openapi.IN_QUERY,
    description="City name for weather data",
    type=openapi.TYPE_STRING,
    required=True
)

hour_param = openapi.Parameter(
    'hour',
    openapi.IN_QUERY,
    description="Datetime in ISO format: ('2024-12-13T10:00:00')",
    type=openapi.TYPE_STRING,
    required=True
)

@swagger_auto_schema(
    methods=['get'],
    manual_parameters=[city_param, hour_param],
    responses={
        200: "Weather data retrieved successfully",
        400: "Bad request - missing/invalid parameters",
        404: "Weather data does not exist"
    }
)

@swagger_auto_schema(
    methods=['post'],
    request_body=WeatherSerializer,
    responses={
        201: "Weather data created successfully",
        400: "Validation errors"
    }
)

@swagger_auto_schema(
    methods=['put'],
    manual_parameters=[city_param, hour_param],
    request_body=WeatherSerializer,
    responses={
        200: "Weather data updated successfully",
        400: "Validation errors or missing parameters",
        404: "Weather data does not exist"
    }
)

@swagger_auto_schema(
    methods=['delete'],
    manual_parameters=[city_param, hour_param],
    responses={
        204: "Weather data deleted successfully",
        400: "Missing parameters",
        404: "Weather data does not exist"
    }
)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def weather_view(request):
    # GET method to retrieve specific weather data
    if request.method == 'GET':
        city = request.query_params.get('city')
        hour = request.query_params.get('hour')
        hour = parse_datetime(hour)
        if not city or not hour:
            return Response({'error': 'City and hour parameters are required'}, status=status.HTTP_400_BAD_REQUEST)
        weather_data = get_object_or_404(Weather, city=city, date_time=hour)
        serializer = WeatherSerializer(weather_data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST method to create new weather data
    elif request.method == 'POST':
        serializer = WeatherSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PUT method to update existing weather data
    elif request.method == 'PUT':
        city = request.query_params.get('city')
        hour = request.query_params.get('hour')
        hour = parse_datetime(hour)
        if not city or not hour:
            return Response({'error': 'City and hour parameters are required'}, status=status.HTTP_400_BAD_REQUEST)
        weather_data = get_object_or_404(Weather, city=city, date_time=hour)
        serializer = WeatherSerializer(weather_data, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE method to delete weather data
    elif request.method == 'DELETE':
        city = request.query_params.get('city')
        hour = request.query_params.get('hour')
        hour = parse_datetime(hour)
        if not city or not hour:
            return Response({'error': 'City and hour parameters are required'}, status=status.HTTP_400_BAD_REQUEST)
        weather_data = get_object_or_404(Weather, city=city, date_time=hour)
        weather_data.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
