# Generated by Django 4.2.5 on 2023-09-28 19:59

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PublicTransportation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transport_type', models.CharField(max_length=100)),
                ('osm_id', models.BigIntegerField()),
                ('user', models.CharField(max_length=100)),
                ('osm_type', models.CharField(max_length=10)),
                ('lat', models.FloatField()),
                ('lon', models.FloatField()),
                ('name', models.CharField(max_length=255)),
                ('network', models.CharField(max_length=255)),
                ('public_transport', models.CharField(max_length=255)),
            ],
        ),
    ]
