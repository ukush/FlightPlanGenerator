// -------- Global variables -------- //
// Create a layer group
var layerGroup1 = L.layerGroup()

// Array containing all points in the selected flight path (array of arrays)
let flightPath = []

// --------- Init Map Settings -----------------------------//

var map = L.map('map').setView([0,0], 2);

// Add tile layer to map object
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 2
}).addTo(map);

map.setMaxBounds([[-90, -180], [90, 180]])

map.on('click', (e) => {

    // Get the lat longs
    let lat = e.latlng.lat
    let lng = e.latlng.lng

    let currentPosition = [lat, lng]

    // Set the array of lat longs
    flightPath.push(currentPosition)


    // Create a marker for each point where the user clicked on and add these markers
    // to a layerGroup
    flightPath.forEach(element => {
        L.marker(element).addTo(layerGroup1)
    });

    // Add the layergroup to the map
    layerGroup1.addTo(map)

    // draw a line between each marker when added
    L.polyline(flightPath, { color: 'red' }).addTo(layerGroup1)

    // put the lat long into the text area
    document.getElementById('coords-list').value += currentPosition + "\n"

})
