// STYLES

const hiddenStyle = new ol.style.Style({
  visibility: "hidden",
});

const StylePolygon = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({ color: [34, 199, 224, 1] }),
    stroke: new ol.style.Stroke({
      color: [38, 100, 235, 1],
      width: 2,
    }),
  }),
});
const polygonStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(72, 72, 72, 0.5)", // transparent, pour supprimer le gris
  }),
  stroke: new ol.style.Stroke({
    color: [38, 100, 235, 0.5], // contour bleu
    width: 2, // largeur du contour
  }),
});
// MAP CREATE
const map = new ol.Map({
  target: "map",
  layers: [
    new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: "https://{1-4}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        attributions:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: ["a", "b", "c", "d"],
        maxZoom: 19,
      }),
    }),
  ],
  view: new ol.View({
    center: ol.proj.transform([2.37488, 48.77655], "EPSG:4326", "EPSG:3857"),
    zoom: 5,
  }),
});
// Map View
map.setView(
  new ol.View({
    center: ol.proj.transform([2.37488, 48.77655], "EPSG:4326", "EPSG:3857"),
    zoom: 5.4,
  })
);

function mapsetView(lat, lon) {
  map
    .getView()
    .setCenter(ol.proj.transform([lon, lat], "EPSG:4326", "EPSG:3857"));
}

// FEATURES
const arrayfeatures = [];

// Create a new source and layer for the points
let pointSource = new ol.source.Vector();
let pointLayer = new ol.layer.Vector({
  source: pointSource,
  visible: false, // Initially hidden
});
map.addLayer(pointLayer);

// Create a new overlay for the popup and add it to the map
let popup = new ol.Overlay({
  element: document.getElementById("popup"),
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});
map.addOverlay(popup);

/**
 * Init the map with the data
 * @param {Object} data The data to display on the map
 */
function initDataMap(data) {
  for (let aaqsa of Object.values(data)) {
    for (let zag of Object.values(aaqsa)) {
      // Point display
      for (let station of Object.entries(zag["stations"])) {
        try {
          let ul_pollutants = "<ul>";
          for (let pollutant of Object.entries(station[1])) {
            if (pollutant[1]["Pollutant"]) {
              ul_pollutants += "<li>" + pollutant[1]["Pollutant"] + "</li>";
            }
          }
          ul_pollutants += "</ul>";
          let feature = new ol.Feature({
            geometry: new ol.geom.Point(
              ol.proj.transform(
                [station[1]["Lon"], station[1]["Lat"]],
                "EPSG:4326",
                "EPSG:3857"
              )
            ),
            name: "<h2>" + station[0] + "</h2>\nPolluants :\n" + ul_pollutants,
          });
          feature.setStyle(hiddenStyle);
          arrayfeatures.push(feature);
        } catch (error) {
          console.error("ERROR : " + error);
        }
      }

      // Polygon display
      for (let polygon of Object.values(zag["Polygon"])) {
        let coordsArray = [...polygon.matchAll(/([^ ]+) ([^ ]+)/gm)];
        for (let i = 0; i < coordsArray.length; i++) {
          coordsArray[i] = ol.proj.transform(
            [parseFloat(coordsArray[i][2]), parseFloat(coordsArray[i][1])],
            "EPSG:4326",
            "EPSG:3857"
          );
        }

        let feature = new ol.Feature({
          geometry: new ol.geom.Polygon([coordsArray]),
        });

        arrayfeatures.push(feature);
      }
    }
  }

  // Create a new source and layer for polygon
  let vectorSource = new ol.source.Vector({
    features: arrayfeatures,
  });
  let vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: polygonStyle,
  });
  map.addLayer(vectorLayer);
}

/**
 * Show the points within the polygon
 * @param {ol.Feature} polygon The polygon to check for points within
 */
function showPointsInPolygon(polygon) {
  // Hide all points
  arrayfeatures.forEach((feature) => {
    if (feature.getGeometry().getType() === "Point") {
      feature.setStyle(hiddenStyle);
    }
  });

  let points = arrayfeatures.filter((feature) => {
    return (
      feature.getGeometry().getType() === "Point" &&
      polygon.getGeometry().intersectsExtent(feature.getGeometry().getExtent())
    );
  });

  points.forEach((point) => {
    point.setStyle(StylePolygon);
  });

  pointSource.clear();
  pointSource.addFeatures(points);

  pointLayer.setVisible(true); // Show the point layer
}

map.on("click", function (e) {
  map.forEachFeatureAtPixel(e.pixel, function (feature) {
    if (feature.getGeometry().getType() === "Polygon") {
      // The polygon was clicked, show the points within it
      showPointsInPolygon(feature);
    }
  });

  // Popup handling
  let feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
    return feature;
  });

  if (feature && feature.getGeometry().getType() === "Point") {
    // The point was clicked, show the popup
    let coordinate = e.coordinate;
    let content = document.getElementById("popup-content");
    content.innerHTML = feature.get("name");
    popup.setPosition(coordinate);
  } else {
    // No point was clicked, hide the popup
    popup.setPosition(undefined);

    // Zoom to the polygon
    let polygonExtent = feature.getGeometry().getExtent();
    map.getView().fit(polygonExtent, { duration: 500 });
  }
});
