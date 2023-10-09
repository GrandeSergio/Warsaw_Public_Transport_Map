from rest_framework import generics
from .models import PublicTransportation
from .serializers import PublicTransportationSerializer
from django.http import JsonResponse
from rest_framework import viewsets
import json
from django.views.generic import TemplateView
from django.conf import settings
from django.shortcuts import render
import os

class PublicTransportationList(generics.ListAPIView):
    queryset = PublicTransportation.objects.all()
    serializer_class = PublicTransportationSerializer


class PublicTransportationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PublicTransportation.objects.all()
    serializer_class = PublicTransportationSerializer


def get_public_transportation_data(request):
    data = PublicTransportation.objects.all().values('id', 'lat', 'lon', 'name', 'network', 'network_type')
    return JsonResponse(list(data), safe=False)


class MapView(TemplateView):
    template_name = 'map.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Get the first directory from STATICFILES_DIRS
        static_dir = settings.STATICFILES_DIRS[0]

        # Construct the path to your JSON file
        json_file_path = os.path.join(static_dir, 'media/svg.json')  # Adjust the path to your JSON file

        # Load JSON data from the file
        with open(json_file_path, 'r') as json_file:
            svg_data = json.load(json_file)

        # Pass the JSON data to the template context
        context['svg_data'] = svg_data
        return context


def about(request):
    return render(request, "about.html")