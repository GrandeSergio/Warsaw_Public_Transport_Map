from rest_framework import serializers
from .models import PublicTransportation


class PublicTransportationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicTransportation
        fields = ('id', 'lat', 'lon', 'name', 'network')