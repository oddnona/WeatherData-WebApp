from django.urls import path, include
from rest_framework import permissions
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.routers import DefaultRouter
from .viewsets import WeatherViewSet

# A default router is created to handle the viewset and automatically create endpoints
router = DefaultRouter()
router.register(r'weather', WeatherViewSet, basename='weather')

# Schema view is created to display swagger documentation
schema_view = get_schema_view(
    openapi.Info(
        title="weather_app",
        default_version='1.0.0',
        description="API documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

# Endpoints determined by the router, and the swagger endpoints
urlpatterns = [
    path('', include(router.urls)),
    path('swagger/schema/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]