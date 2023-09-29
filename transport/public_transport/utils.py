import requests
from bs4 import BeautifulSoup
from io import StringIO
import pandas as pd
from .models import PublicTransportation
from django.db import transaction
from pandas import DataFrame

def request_and_save_public_transport_data():
    try:
        def str2frame(estr, sep='\t', lineterm='\n', set_header=False):
            dat = [x.split(sep) for x in estr.split(lineterm)][1:-1]
            cdf = DataFrame(dat)
            if set_header:
                cdf = cdf.T.set_index(0, drop=True).T  # flip, set ix, flip back
            return cdf

        def determine_transport_type(network_value):
            # Implement your logic here to determine transport_type based on network_value
            if "bus" in network_value.lower():
                return "bus"
            elif "tram" in network_value.lower():
                return "tram"
            elif "train" in network_value.lower():
                return "train"
            else:
                return "unknown"

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
        df_bus = bus.dropna(subset=['@lat', '@lon', 'name'])  # drop nan values in lat, lon and name column

        # Save the data to the Django database using a transaction for better performance
        with transaction.atomic():
            for _, row in df_bus.iterrows():
                PublicTransportation.objects.create(
                    transport_type=row['@type'],  # Use '@type' instead of '@id'
                    osm_id=row['@id'],  # Use '@id' instead of '@type'
                    user=row['@user'],
                    osm_type=row['@type'],
                    lat=row['@lat'],
                    lon=row['@lon'],
                    name=row['name'],
                    network=row['network'],
                    public_transport=row['public_transport']
                )

        return True  # Indicates success
    except Exception as e:
        print(f"Error: {str(e)}")
        return False  # Indicates failure