# Warsaw_Public_Transport_Map

This Django web application provides a map interface to explore public transportation data in Warsaw, Poland. It utilizes Django, Django REST framework, OpenLayers, and Overpass API to display information about bus stops, railway stations, tram stops, and metro stations in Warsaw. The application allows users to toggle different network types, such as buses, railways, trams, and metro, on the map.

## Features

• **Interactive Map:** Users can explore Warsaw's public transportation network on an interactive map.

• **Network Types:** Users can toggle different network types (buses, railways, trams, and metro) to view specific transportation routes.

• **Clustered Markers:** Users can explore Warsaw's public transportation network on an interactive map.

• **Popup Information:** Clicking on markers or clusters displays detailed information about specific transportation stops.


## Technologies Used

• **Django**

• **Django REST Framework** 

• **OpenLayers**

• **Overpass API**

## Screenshots
![image](https://github.com/GrandeSergio/Warsaw_Public_Transport_Map/assets/141655721/0379bf3c-f57a-4648-8649-1ea074827501)

![image](https://github.com/GrandeSergio/Warsaw_Public_Transport_Map/assets/141655721/d17334d9-e21d-4b2f-b127-522667f4da7f)


## Installation and Usage

To run the application locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/GrandeSergio/Warsaw_Public_Transport_Map
```

2. Install the required Python packages:

```
pip install -r requirements.txt
```

3. Apply database migrations:

```
python manage.py migrate
```

4. Fetch and save public transportation data from the Overpass API:

```
python manage.py request_and_save_public_transport_data
```

5. Run the development server:

```
python manage.py runserver
```

6. Alternatively you can clear database using this command

```
python manage.py clear_database
```

## API Endpoints

**Public Transportation Data:** /public-transportation/ - Provides a list of public transportation stops.

