from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Sum
from django.db.models.functions import ExtractMonth, ExtractDay, ExtractHour
from django.utils.dateparse import parse_datetime
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from datetime import datetime
from drf_yasg import openapi
from .models import Weather
from .serializers import WeatherSerializer


class WeatherViewSet(viewsets.ModelViewSet):
    # ViewSet for viewing and editing weather data

    queryset = Weather.objects.all()
    serializer_class = WeatherSerializer

    # Get query for weather data of a specific city and hour
    def get_queryset(self):
        # Get query parameters from the request
        queryset = Weather.objects.all()
        city = self.request.query_params.get('city')
        hour = self.request.query_params.get('hour')

        if city and hour:
            hour = parse_datetime(hour)
            queryset = queryset.filter(city=city, date_time=hour)

        return queryset

    # Swagger documentation for list method
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('city', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('hour', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True),
        ]
    )
    # List method that lists given weather data
    def list(self, request, *args, **kwargs):
        # Get query parameters from the request
        city = request.query_params.get('city')
        hour = request.query_params.get('hour')

        if not city or not hour:
            return Response(
                {'error': 'City and hour parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = self.get_queryset()
        if not queryset.exists():
            return Response(
                {'error': 'Weather data not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(queryset.first())
        return Response(serializer.data)

    # Swagger documentation for update method
    @swagger_auto_schema(
    manual_parameters=[
        openapi.Parameter('city', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True),
        openapi.Parameter('time', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True,)
    ],
    request_body=WeatherSerializer
    )
    @action (detail=False, methods=['put'])
    def update_by_city(self, request, *args, **kwargs):
      # Update weather data for a specific city and time
      city = request.query_params.get('city')
      time = request.query_params.get('time')

      if not city or not time:
          return Response(
              {'error': 'Both city and time parameters are required'},
              status=status.HTTP_400_BAD_REQUEST
          )

      try:
          # Parse the time string into a datetime object
          time = parse_datetime(time)
          if not time:
              return Response(
                  {'error': 'Invalid time format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'},
                  status=status.HTTP_400_BAD_REQUEST
              )

          # Try to find the specific weather record
          instance = Weather.objects.get(city=city, date_time=time)
          
          # Update the instance with new data
          serializer = self.get_serializer(instance, data=request.data, partial=True)
          if serializer.is_valid():
              serializer.save()
              return Response(serializer.data)
          
          return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

      except Weather.DoesNotExist:
          return Response(
              {'error': f'No weather data found for {city} at {time}'},
              status=status.HTTP_404_NOT_FOUND
          )
      except Exception as e:
          return Response(
              {'error': f'An error occurred: {str(e)}'},
              status=status.HTTP_400_BAD_REQUEST
          )

    # Swagger documentation for destroy method
    @swagger_auto_schema(
    manual_parameters=[
        openapi.Parameter('city', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True),
        openapi.Parameter('time', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True,)
    ]
    )
    # Delete weather data for a specific city and time
    @action (detail=False, methods=['delete'])
    def destroy_by_city(self, request, *args, **kwargs):
      city = request.query_params.get('city')
      time = request.query_params.get('time')

      if not city or not time:
          return Response(
              {'error': 'Both city and time parameters are required'},
              status=status.HTTP_400_BAD_REQUEST
          )

      try:
          # Parse the time string into a datetime object
          time = parse_datetime(time)
          if not time:
              return Response(
                  {'error': 'Invalid time format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'},
                  status=status.HTTP_400_BAD_REQUEST
              )

          # Try to find and delete the specific weather record
          instance = Weather.objects.get(city=city, date_time=time)
          instance.delete()
          return Response(status=status.HTTP_204_NO_CONTENT)

      except Weather.DoesNotExist:
          return Response(
              {'error': f'No weather data found for {city} at {time}'},
              status=status.HTTP_404_NOT_FOUND
          )
      except Exception as e:
          return Response(
              {'error': f'An error occurred: {str(e)}'},
              status=status.HTTP_400_BAD_REQUEST
          )

    # Swagger documentation for avg_temp method 
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('city', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('year', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True),
        ]
    )
    # Get average temperature per month for a city in a specific year
    @action(detail=False, methods=['get'])
    def avg_temp(self, request):
        # Get query parameters from the request
        city = request.query_params.get('city')
        year = request.query_params.get('year')

        if not city or not year:
            return Response(
                {'error': 'City and year parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            year = int(year)
        except ValueError:
            return Response(
                {'error': 'Invalid year format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Apply the filters and find the matching data
        monthly_averages = Weather.objects.filter(
            city=city,
            date_time__year=year
        ).annotate(
            month=ExtractMonth('date_time')
        ).values(
            'month'
        ).annotate(
            avg_temperature=Avg('temperature')
        ).order_by('month')

        if not monthly_averages:
            return Response(
                {'error': f'No weather data found for {city} in {year}'},
                status=status.HTTP_404_NOT_FOUND
            )

        response_data = {
            'city': city,
            'year': year,
            'monthly_averages': [
                {
                    'month': avg['month'],
                    'average_temperature': round(avg['avg_temperature'], 2)
                }
                for avg in monthly_averages
            ]
        }

        return Response(response_data)
    
    # Swagger documentation for precipitation method 
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('city', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('month', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=True),
            openapi.Parameter('batch_size', openapi.IN_QUERY, 
                type=openapi.TYPE_INTEGER, 
                enum=[10, 20, 50, 100],
                default=20
            ),
        ]
    )
    # Get total precipitation per day for a specific city and month, return 
    @action(detail=False, methods=['get'])
    def precipitation(self, request):
        # Get query parameters from the request
        city = request.query_params.get('city')
        month = request.query_params.get('month')
        batch_size = request.query_params.get('batch_size', '20')

        if not city or not month:
            return Response(
                {'error': 'City and month parameters are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            month = int(month)
            if not 1 <= month <= 12:
                raise ValueError
        except ValueError:
            return Response(
                {'error': 'Please provide a number between 1 and 12 for month'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            batch_size = int(batch_size)
            if batch_size not in [10, 20, 50, 100]:
                batch_size = 20  # Default size 20 if provided value is invalid
        except ValueError:
            batch_size = 20

        # Get precipitation data for each day from the database
        daily_precipitation = Weather.objects.filter(
            city=city,
            date_time__month=month
        ).annotate(
            day=ExtractDay('date_time')
        ).values(
            'day'
        ).annotate(
            total_precipitation=Sum('precipitation')
        ).order_by('day')

        if not daily_precipitation:
            return Response(
                {'error': f'No precipitation data found for {city} in month {month}'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Convert to list and process in batches
        precipitation_list = list(daily_precipitation)
        total_records = len(precipitation_list)
        batches = []
        
        for i in range(0, total_records, batch_size):
            batch = precipitation_list[i:i + batch_size]
            batches.append({
                'batch_number': (i // batch_size) + 1,
                'data': [
                    {
                        'day': item['day'],
                        'precipitation': round(float(item['total_precipitation']), 2)
                    }
                    for item in batch
                ]
            })

        response_data = {
            'city': city,
            'month': month,
            'batch_size': batch_size,
            'total_records': total_records,
            'total_batches': len(batches),
            'batches': batches
        }

        return Response(response_data)
    
    # Swagger documentation for hourly method
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('city', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True),
            openapi.Parameter('month', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=True),
            openapi.Parameter('year', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=True),
            openapi.Parameter('page', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, default=1),
            openapi.Parameter('page_size', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, default=24),
        ]
    )
    # GET method for the hourly weather data for a specific city, month, and year
    @action(detail=False, methods=['get'])
    def hourly(self, request):
        # Get query parameters from the request
        city = request.query_params.get('city')
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 24))  # Pages of 24 entries for 24 hours

        # Parameter validation
        if not all([city, month, year]):
            return Response(
                {'error': 'City, month, and year parameters are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            month = int(month)
            year = int(year)
            if not (1 <= month <= 12):
                raise ValueError("Invalid month")
        except ValueError:
            return Response(
                {'error': 'Invalid month or year format'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Query the database to retrieve hourly weather data
        queryset = Weather.objects.filter(
            city=city,
            date_time__month=month,
            date_time__year=year
        ).annotate(
            hour=ExtractHour('date_time')
        ).order_by('date_time')

        # Since we do not know how many data entries we have, we need to calculate how many pages we need and get paginated data
        total_records = queryset.count()
        total_pages = (total_records + page_size - 1) // page_size
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        hourly_data = queryset[start_idx:end_idx]

        if not hourly_data:
            return Response(
                {
                    'error': f'No weather data found for {city} in {month}/{year}'
                }, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Format response
        response_data = {
            'city': city,
            'month': month,
            'year': year,
            'pagination': {
                'current_page': page,
                'total_pages': total_pages,
                'page_size': page_size,
                'total_records': total_records
            },
            'hourly_data': [
                {
                    'date_time': data.date_time.isoformat(),
                    'hour': data.hour,
                    'temperature': data.temperature,
                    'precipitation': data.precipitation,
                    'rain': data.rain,
                    'snowfall': data.snowfall
                }
                for data in hourly_data
            ]
        }

        return Response(response_data)

    @swagger_auto_schema(
    manual_parameters=[
        openapi.Parameter('N', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=True,
                         description='Number of extreme temperatures to retrieve (must be ≥ 1)'),
        openapi.Parameter('extreme_type', openapi.IN_QUERY, type=openapi.TYPE_STRING, required=True,
                         enum=['top', 'bottom'], description='Whether to get highest or lowest temperatures'),
        openapi.Parameter('year', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=False,
                         description='Specific year to analyze'),
        openapi.Parameter('M', openapi.IN_QUERY, type=openapi.TYPE_INTEGER, required=False,
                         description='Number of previous years to analyze (must be ≥ 1)')
    ]
    )
    @action(detail=False, methods=['get'])
    def extreme_temps(self, request):
        number_max_temperatures = request.query_params.get('N')
        extreme_type = request.query_params.get('extreme_type')
        year = request.query_params.get('year')
        number_years = request.query_params.get('M')

        try:
            number_max_temperatures = int(number_max_temperatures)
            number_years = int(number_years) if number_years else None
            if extreme_type not in ['top', 'bottom']:
                raise ValueError()
        except ValueError:
            return Response(
                {'error': 'Invalid value for N, M, or type. M must be an integer, and type must be "top" or "bottom".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        queryset = Weather.objects.exclude(temperature__isnull=True)

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

        # Apply ordering
        queryset = queryset.order_by(temperature_sign)

        # Manual deduplication
        seen = set()
        results = []
        for entry in queryset:
            identifier = (entry.city, entry.temperature, entry.date_time)
            if identifier not in seen:
                seen.add(identifier)
                results.append({'city': entry.city, 'temperature': entry.temperature, 'date_time': entry.date_time})
                # Stop collecting results once the desired number is reached
                if len(results) >= number_max_temperatures:
                    break

        return Response({'Extreme temperatures: ': results})
