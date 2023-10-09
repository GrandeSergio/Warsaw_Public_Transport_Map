import requests
from io import StringIO
import pandas as pd
from .models import PublicTransportation
from django.db import transaction

def request_and_save_public_transport_data():
    try:
        def request_data(data_type):
            overpass_url = "http://overpass-api.de/api/interpreter"
            overpass_query = f"""
            [out:csv(::id,::user,::type,::lat,::lon,name,network,public_transport)];

            area[name="Polska"];
            rel[name="Warszawa"](area);
            map_to_area;
            nwr[{data_type}](area);
            //nwr["highway"="bus_stop"](area);
            //nwr["railway"="halt"](area);
            //nwr["railway"="tram_stop"](area);
            out meta;
            """
            response = requests.get(overpass_url,
                                    params={'data': overpass_query})
            response.encoding = 'utf-8'
            data = response.text
            data = data.strip()
            df = pd.read_csv(StringIO(data), sep='\t', encoding='utf-8')
            return df

        bus = request_data(""" "highway"="bus_stop" """)
        railway = request_data(""" "station" """)
        railway2 = request_data(""" "railway"="halt" """)
        # Merge the DataFrames based on a common column
        merged_df_railway = pd.concat([railway, railway2])
        # Drop duplicates based on a specific column
        merged_df_railway.drop_duplicates(subset='name', keep='first', inplace=True)
        merged_df_railway = merged_df_railway.dropna(subset=['network']).copy()
        metro = merged_df_railway[merged_df_railway['network'].str.contains('Warsaw Metro', case=False)]
        df_metro = metro.dropna(subset=['@lat', '@lon', 'name'])
        df_metro['network_type'] = 'metro'
        merged_df_railway = merged_df_railway[~merged_df_railway['network'].str.contains('Warsaw Metro', case=False)]

        tram = request_data(""" "railway"="tram_stop" """)

        df_bus = bus.dropna(subset=['@lat', '@lon', 'name'])

        df_railway = merged_df_railway.dropna(subset=['@lat', '@lon', 'name'])

        df_tram = tram.dropna(subset=['@lat', '@lon', 'name'])

        df_bus['network_type'] = 'bus'
        df_railway['network_type'] = 'railway'
        df_tram['network_type'] = 'tram'

        # Concatenate the DataFrames
        frames = [df_bus, df_railway, df_tram, df_metro]
        combined_df = pd.concat(frames)

        # Save the data to the Django database using a transaction for better performance
        with transaction.atomic():
            for _, row in combined_df.iterrows():
                PublicTransportation.objects.create(
                    transport_type=row['@type'],
                    osm_id=row['@id'],
                    user=row['@user'],
                    osm_type=row['@type'],
                    lat=row['@lat'],
                    lon=row['@lon'],
                    name=row['name'],
                    network=row['network'],
                    network_type=row['network_type']
                )

        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False