from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'public-transportation', views.PublicTransportationViewSet)

urlpatterns = [
    path('public-transportation/', views.PublicTransportationList.as_view(), name='public-transportation-list'),
    path('', views.MapView.as_view(), name='map-view'),
    ]

urlpatterns += router.urls