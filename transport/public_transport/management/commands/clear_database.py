from django.core.management.base import BaseCommand
from ...models import PublicTransportation

class Command(BaseCommand):
    help = 'Clears the PublicTransportation database table'

    def handle(self, *args, **options):
        PublicTransportation.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Database cleared successfully'))