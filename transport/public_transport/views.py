from rest_framework import generics
from .models import PublicTransportation
from .serializers import PublicTransportationSerializer
from django.http import JsonResponse
from rest_framework import viewsets
from django.views.generic import TemplateView


class PublicTransportationList(generics.ListAPIView):
    queryset = PublicTransportation.objects.all()
    serializer_class = PublicTransportationSerializer


class PublicTransportationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PublicTransportation.objects.all()
    serializer_class = PublicTransportationSerializer


def get_public_transportation_data(request):
    data = PublicTransportation.objects.all().values('id', 'lat', 'lon', 'name', 'network')
    return JsonResponse(list(data), safe=False)

class MapView(TemplateView):
    template_name = 'map.html'