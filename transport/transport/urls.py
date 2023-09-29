
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('public_transport.urls')),
    path('', include('public_transport.urls')),
]
