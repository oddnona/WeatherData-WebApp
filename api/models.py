from django.db import models

# File for models of the project.

class Weather(models.Model):
    city = models.CharField(max_length=100)
    date_time = models.DateTimeField(null=True)
    temperature = models.FloatField(null=True)
    precipitation = models.FloatField(null=True)
    rain = models.FloatField(null=True)
    snowfall = models.FloatField(null=True)

    def __str__(self):
        return f"{self.city} - {self.date_time}"