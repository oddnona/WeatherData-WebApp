from rest_framework import serializers
from .models import Weather

#This file is to define serialisations and deserialisations. To turn model data to string or vice versa

class WeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weather
        fields = '__all__'