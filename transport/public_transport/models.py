from django.db import models

class PublicTransportation(models.Model):
    transport_type = models.CharField(max_length=100)
    osm_id = models.BigIntegerField()
    user = models.CharField(max_length=100)
    osm_type = models.CharField(max_length=10)
    lat = models.FloatField()
    lon = models.FloatField()
    name = models.CharField(max_length=255)
    network = models.CharField(max_length=255)
    public_transport = models.CharField(max_length=255)

    def __str__(self):
        return self.name
