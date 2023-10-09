document.getElementById('closeLayerTreeBtn').addEventListener('click', function () {
    const layerTreeContainer = document.querySelector('.layer-tree-container');
    layerTreeContainer.classList.remove('show');
    document.getElementById('map').style.width = '100%'; // Reset the map width
});

document.getElementById('layersButton').addEventListener('click', function () {
    const layerTreeContainer = document.querySelector('.layer-tree-container');
    layerTreeContainer.classList.toggle('show');

    // Check if the layer tree container is visible
    if (layerTreeContainer.classList.contains('show')) {
        // Layer tree is visible, resize the map element
        const sidebarWidth = 80; // Width of the sidebar in pixels
        const layerTreeWidth = 250; // Width of the layer tree container in pixels
        const newMapWidth = window.innerWidth - sidebarWidth - layerTreeWidth;
        document.getElementById('map').style.width = `${newMapWidth}px`;
    } else {
        // Layer tree is hidden, reset the map element to its original size
        document.getElementById('map').style.width = '100%';
    }
});


var warsawCoordinates = ol.proj.fromLonLat([21.0118, 52.2297]); // Warsaw coordinates

var osmLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});

var googleLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attributions: ['© Google Maps'],
  })
});


var busIconSVG = svgData.bus;
var railwayIconSVG = svgData.railway;
var tramIconSVG = svgData.tram;
var metroIconSVG = svgData.metro;

// Create an icon style using the SVG code
var busIcon = new ol.style.Icon({
  src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(busIconSVG),
  scale: 1,
});

var railwayIcon = new ol.style.Icon({
  src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(railwayIconSVG),
  scale: 1,
});

var tramIcon = new ol.style.Icon({
  src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(tramIconSVG),
  scale: 1,
});

var metroIcon = new ol.style.Icon({
  src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(metroIconSVG),
  scale: 1,
});


// Create vector layers for each network type with Font Awesome icons
var busLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    image: busIcon,
  }),
});

var railwayLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    image: railwayIcon,
  }),
});

var tramLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    image: tramIcon,
  }),
});

var metroLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  style: new ol.style.Style({
    image: metroIcon,
  }),
});

var busClusterSource = new ol.source.Cluster({
  distance: 50,
  source: busLayer.getSource()
});

var railwayClusterSource = new ol.source.Cluster({
  distance: 50,
  source: railwayLayer.getSource()
});

var tramClusterSource = new ol.source.Cluster({
  distance: 50,
  source: tramLayer.getSource()
});

var metroClusterSource = new ol.source.Cluster({
  distance: 50,
  source: metroLayer.getSource()
});


function generateClusterStyle(feature, clusterIcon, clusterColor) {
  const size = feature.get('features').length;
  const circleStyle = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 15, // Adjust the radius of the circle according to your preference
      fill: new ol.style.Fill({
        color: clusterColor, // Color of the circle background
      }),
    }),
  });

  const iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: clusterIcon.getSrc(),
      scale: 1, // Scale of the SVG icon
    }),
  });

  if (size > 1) {
    // Cluster style with circle and text
    return [circleStyle, new ol.style.Style({
      text: new ol.style.Text({
        text: size.toString(),
        fill: new ol.style.Fill({
          color: '#fff', // Color of the text inside the circle
        }),
      }),
    })];
  } else {
    // Single feature style with circle and icon
    return [circleStyle, iconStyle];
  }
}



const busClusterLayer = new ol.layer.Vector({
  source: busClusterSource,
  style: function(feature) {
    return generateClusterStyle(feature, busIcon, '#009c2c');
  }
});

const railwayClusterLayer = new ol.layer.Vector({
  source: railwayClusterSource,
  style: function(feature) {
    return generateClusterStyle(feature, railwayIcon, '#ad00f7');
  }
});

const tramClusterLayer = new ol.layer.Vector({
  source: tramClusterSource,
  style: function(feature) {
    return generateClusterStyle(feature, tramIcon, '#db3102');
  }
});

const metroClusterLayer = new ol.layer.Vector({
  source: metroClusterSource,
  style: function(feature) {
    return generateClusterStyle(feature, metroIcon, '#064fd6');
  }
});

// Style function for single features (icons)
function getIconStyle(icon) {
  return new ol.style.Style({
    image: icon,
  });
}


const map = new ol.Map({
  target: 'map',
  layers: [osmLayer, busClusterLayer, railwayClusterLayer, tramClusterLayer, metroClusterLayer],
  view: new ol.View({
    center: warsawCoordinates,
    zoom: 11
  })
});

const mapContainer = document.getElementById('map');
const loadingModal = document.getElementById('loadingModal');

const positionLoadingModal = () => {
  const rect = mapContainer.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  // Calculate offset based on map height
  const windowHeight = window.innerHeight;
  const mapHeight = rect.height;


  // Set modal position
  loadingModal.style.top = `${rect.top + scrollY}px`;
  loadingModal.style.left = `${rect.left + scrollX}px`;

  // Set modal dimensions to match the map
  loadingModal.style.width = `${rect.width}px`;
  loadingModal.style.height = `${rect.height}px`;
};

// Call the function whenever the window is resized or scrolled
window.addEventListener('resize', positionLoadingModal);
window.addEventListener('scroll', positionLoadingModal);

// Initial positioning
positionLoadingModal();


// Fetch data from your API endpoint and add features to the appropriate layers
// Inside the fetch callback
fetch('/public-transportation/')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      const feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(item.lon), parseFloat(item.lat)])),
      });

      // Set properties directly on the feature
      feature.setProperties({
        name: item.name,
        lat: item.lat,
        lon: item.lon
      });

      // Determine the network type and add the feature to the corresponding layer
      if (item.network_type === 'bus') {
        busLayer.getSource().addFeature(feature);
      } else if (item.network_type === 'railway') {
        railwayLayer.getSource().addFeature(feature);
      } else if (item.network_type === 'tram') {
        tramLayer.getSource().addFeature(feature);
      } else if (item.network_type === 'metro') {
        metroLayer.getSource().addFeature(feature);
      }
    });

    // Add the 'fade-out' class to trigger the animation
    loadingModal.classList.add('fade-out');

    // Set a timeout to remove the modal after the animation duration (1 second in this case)
    setTimeout(() => {
      loadingModal.style.display = 'none';
    }, 400); // 1000 milliseconds = 1 second (duration of the animation)
  })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
    // Hide loading screen in case of errors
    loadingModal.style.display = 'none';
  });





// Create popup overlay
const popupContainer = document.getElementById('popup');
const popupContent = document.getElementById('popup-content');
const popupCloser = document.getElementById('popup-closer');

const popupOverlay = new ol.Overlay({
  element: popupContainer,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

map.addOverlay(popupOverlay);

map.on('click', function (event) {
  popupOverlay.setPosition(undefined);
});

// Close popup when close button is clicked
popupCloser.onclick = function () {
  popupOverlay.setPosition(undefined);
  return false;
};


// Add a click event listener to the map to zoom to clusters
map.on('click', function (event) {

  var features = [];

  // Get features from different cluster layers
  var busFeatures = map.getFeaturesAtPixel(event.pixel, { layer: busClusterLayer });
  if (busFeatures) {
    features = features.concat(busFeatures);
  }

  var railwayFeatures = map.getFeaturesAtPixel(event.pixel, { layer: railwayClusterLayer });
  if (railwayFeatures) {
    features = features.concat(railwayFeatures);
  }

  var tramFeatures = map.getFeaturesAtPixel(event.pixel, { layer: tramClusterLayer });
  if (tramFeatures) {
    features = features.concat(tramFeatures);
  }

  var metroFeatures = map.getFeaturesAtPixel(event.pixel, { layer: metroClusterLayer });
  if (metroFeatures) {
    features = features.concat(metroFeatures);
  }

  // Handle clicked features
  if (features.length > 0) {
    const clusterFeature = features.find(feature => feature.get('features'));

    if (clusterFeature) {
      // Cluster feature clicked
      const clusterFeatures = clusterFeature.get('features');

      if (clusterFeatures.length === 1) {
        var currentZoom = map.getView().getZoom();
        if (currentZoom > 15) {
            // If there is only one feature in the cluster, show the popup
            const properties = clusterFeatures[0].getProperties();
            const name = properties.name;
            const lat = properties.lat;
            const lon = properties.lon;

            const contentHTML = `<p><strong>Name:</strong> ${name}</p>` +
                                `<p><strong>Latitude:</strong> ${lat}</p>` +
                                `<p><strong>Longitude:</strong> ${lon}</p>`;

            popupContent.innerHTML = contentHTML;
            popupOverlay.setPosition(event.coordinate);
        }
      } else {
        // If there are multiple features in the cluster, do not show the popup
        popupOverlay.setPosition(undefined);
      }
    } else {
      // Single feature clicked
      const clickedCoordinate = event.coordinate;

      // Define tolerance distance in pixels
      const tolerance = 400;

      // Check if the clicked coordinate is within tolerance distance of the feature's geometry
      const isWithinTolerance = features.some(feature => {
        const geometry = feature.getGeometry();
        const closestPoint = geometry.getClosestPoint(clickedCoordinate);
        const distance = ol.coordinate.squaredDistance(clickedCoordinate, closestPoint);
        return distance <= tolerance * tolerance;
      });

      if (isWithinTolerance) {
        const properties = features[0].getProperties();
        const name = properties.name;
        const lat = properties.lat;
        const lon = properties.lon;

        const contentHTML = `<p><strong>Name:</strong> ${name}</p>` +
                            `<p><strong>Latitude:</strong> ${lat}</p>` +
                            `<p><strong>Longitude:</strong> ${lon}</p>`;

        popupContent.innerHTML = contentHTML;
        popupOverlay.setPosition(event.coordinate);
      } else {
        // Clicked coordinate is not within tolerance, do not show the popup
        popupOverlay.setPosition(undefined);
      }
    }
  } else {
    // No feature clicked
    popupOverlay.setPosition(undefined);
  }

  if (features.length > 0) {
      var extent = ol.extent.createEmpty();
      features.forEach(function (feature) {
        if (feature.get('features')) {
          // Cluster
          feature.get('features').forEach(function (clusterFeature) {
            ol.extent.extend(extent, clusterFeature.getGeometry().getExtent());
          });
        } else {
          // Single feature
          ol.extent.extend(extent, feature.getGeometry().getExtent());
        }
      });

      var currentZoom = map.getView().getZoom();

      // Check if the current zoom level is less than or equal to 18
      if (currentZoom <= 18) {
        // Zoom to the extent only if the current zoom level is 18 or lower
        map.getView().fit(extent, { duration: 500, maxZoom: 18 });
      }
  }
});

var baseLayers = {
  'osm': osmLayer,
  'google': googleLayer
};

// Function to toggle base layers
function toggleBaseLayer(layer) {
  map.getLayers().clear();
  map.addLayer(baseLayers[layer]); // Add the selected base layer first

  // Add clustering layers on top of the base layer
  map.addLayer(busClusterLayer);
  map.addLayer(railwayClusterLayer);
  map.addLayer(tramClusterLayer);
  map.addLayer(metroClusterLayer);
}

// Get DOM elements for checkboxes in the layer tree
const busCheckbox = document.getElementById('busCheckbox');
const railwayCheckbox = document.getElementById('railwayCheckbox');
const tramCheckbox = document.getElementById('tramCheckbox');
const metroCheckbox = document.getElementById('metroCheckbox');
const osmLayerRadio = document.getElementById('osmLayer');
const googleLayerRadio = document.getElementById('googleLayer');
const clusterVisibilityCheckbox = document.getElementById('clusterVisibility');

// Add event listeners for base layer selection
osmLayerRadio.addEventListener('change', function () {
  if (this.checked) {
    toggleBaseLayer('osm');
  }
});

googleLayerRadio.addEventListener('change', function () {
  if (this.checked) {
    toggleBaseLayer('google');
  }
});

// Add event listeners for checkboxes to toggle layer visibility
busCheckbox.addEventListener('change', function () {
  busClusterLayer.setVisible(this.checked);
});

railwayCheckbox.addEventListener('change', function () {
  railwayClusterLayer.setVisible(this.checked);
});

tramCheckbox.addEventListener('change', function () {
  tramClusterLayer.setVisible(this.checked);
});

metroCheckbox.addEventListener('change', function () {
  metroClusterLayer.setVisible(this.checked);
});


