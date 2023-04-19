// --------- Init Map Settings -----------------------------//

   var map = L.map('map').setView([51.505, -0.09], 3);

   // Add tile layer to map object
   L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
       minZoom : 2
   }).addTo(map);

   map.setMaxBounds(  [[-90,-180],   [90,180]]  )


    // Create a layer group
    var layerGroup1 = L.layerGroup()

   // Array containing all points in the selected flight path (array of arrays)
   let flightPath = []


   // ----------------------- On Click Handler -------------------//

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
    L.polyline(flightPath, {color : 'red'}).addTo(layerGroup1)

    // put the lat long into the text area
    document.getElementById('coords-list').value += currentPosition + "\n"
   
   })



   /**
    * 
    * @param {*} latlngStart The starting point's lat lng
    * @param {*} latlngEnd  The ending point's lat lng
    * @returns the bearing or heading between the two points
    */
   function calcHeading(latlngStart, latlngEnd) {

    // Convert to Radians
    let startLat = latlngStart[0] * Math.PI / 180
    let startLng = latlngStart[1] * Math.PI / 180
    let destLat = latlngEnd[1] * Math.PI / 180
    let destLng = latlngEnd[1] * Math.PI / 180

    // Calculate bearing
    let y = Math.sin(destLng - startLng) * Math.cos(destLat)
    let x = Math.cos(startLat) 
    * Math.sin(destLat) 
    - Math.sin(startLat) 
    * Math.cos(destLat) 
    * Math.cos(destLng - startLng)

    let bearing = Math.atan2(y,x)
    bearing = (bearing * 180) / Math.PI
    return (bearing + 360) % 360

   }

   /**
    * Function to calculate a random latlng array 
    * @returns array of random latlong
    */

   function calcRandomLatLong() {
    // clients@ocus.com
    return [Math.random() * (180 - (-180)), Math.random() * (180 - -180)]
   }

   /**
    * Function which takes the lat longs form the user click
    * and uses them to generate the script
    * 
    */
  function genScript() {

    // Individual JSON for storing the flight info for each point in the flight plan
    let flightPoint
    // List of JSON storing all flight point data
    let flightPoints = []

    // Loop though each latlng in the flightpath
    for (let i =0; i < flightPath.length; i ++) {
    
        // Randomly calculate a altitute
        let altitude = Math.floor((Math.random() * (42000 - 25000 + 1) + 25000));

        let head;

        // calcualte the heading of a point based off of it's relationship with
        // the next point
        // If the last point, use a random latlong to calculate heading
        if (i != (flightPath.length-1)) {
            head = calcHeading(flightPath[i], flightPath[i + 1] )      
        }
        else {
            head = calcHeading(flightPath[i], calcRandomLatLong(-180, 180, 3))
        }

        // Create a flight point JSON
        flightPoint = {
            latitude : flightPath[i][0],
            longitude : flightPath[i][1],
            altitude : altitude,
            heading : head
        }
        flightPoints.push(flightPoint)

    }

    // Create the JSON that holds the flight points data
    let geo = {
        geo : flightPoints
    }


    flightPoints.forEach((element) => {
         // Put this JSON into the text area in the format of the script
        document.getElementById('bash-script').value +=  
        `curl -v -X POST -H "Content-Type:application/json" $LOC_URL --data ${JSON.stringify(element)}` + "\n\n"
    })

  }

  /**
   * Function which clears the markers and polygons when a user clicks on the
   * button. Also clears the text areas for the user to select a new flight path
   */
  function clearPath() {
    layerGroup1.clearLayers()
    flightPath = []

    document.getElementById('coords-list').value = ''
    document.getElementById('bash-script').value = ''
  }

  function copyClip() {
    let text = document.getElementById('bash-script').value

     // Copy the text inside the text field
    navigator.clipboard.writeText(text);
  }

function exportScript() {
    let text = document.getElementById('bash-script').value

    let blob = new Blob([text], {type: 'text/plain'})

    const a = document.createElement('a');
    
    a.href= URL.createObjectURL(blob);
    a.download = "flightplanscript.txt";
    a.click();
  
      URL.revokeObjectURL(a.href);
}