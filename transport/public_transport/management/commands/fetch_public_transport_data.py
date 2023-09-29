from django.core.management.base import BaseCommand
from ...utils import request_and_save_public_transport_data  # Correct import path

class Command(BaseCommand):
    help = 'Fetch and save public transportation data from Overpass API to the database'

    def handle(self, *args, **options):
        success = request_and_save_public_transport_data()
        if success:
            self.stdout.write(self.style.SUCCESS('Data imported successfully'))
        else:
            self.stderr.write(self.style.ERROR('Data import failed'))