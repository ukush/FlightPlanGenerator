   // Create map object and set view
   var map = L.map('map').setView([51.505, -0.09], 4);

   // Add tile layer to map object
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
       attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   }).addTo(map);

    // Create a layer group
    var layerGroup1 = L.layerGroup()


   let flightPath = []

   map.on('click', (e) => {

     // Get the lat longs
     let lat = e.latlng.lat
     let lng = e.latlng.lng

    let currentPosition = [lat, lng]

    // Set the array of lat longs
    flightPath.push(currentPosition)


    flightPath.forEach(element => {
        L.marker(element).addTo(layerGroup1)
    });

     layerGroup1.addTo(map)

    // draw a line between each marker when added
    L.polyline(flightPath, {color : 'red'}).addTo(layerGroup1)


    // put the lat long into the text area
    document.getElementById('coords-list').value = flightPath

   })


   function calcHeading(latlngStart, latlngEnd) {


    // Convert to Radians

    let startLat = latlngStart[0] * Math.PI / 180
    let startLng = latlngStart[1] * Math.PI / 180
    let destLat = latlngEnd[1] * Math.PI / 180
    let destLng = latlngEnd[1] * Math.PI / 180

    // Calc bearing
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

   function calcRandomLatLong(from, to, fixed) {
    // clients@ocus.com
    return [Math.random() * (to - from) + from.toFixed(fixed) * 1, Math.random() * (to - from) + from.toFixed(fixed) * 1]
   }

  function genScript() {

    let flightPoint
    let flightPoints = []

    for (let i =0; i < flightPath.length; i ++) {
    
        let altitude = Math.floor((Math.random() * (42000 - 25000 + 1) + 25000));

let head;

    // calcualte the heading
    if (i != (flightPath.length-1)) {
        head = calcHeading(flightPath[i], flightPath[i + 1] )    
        console.log(head)    
    }
    else {
        head = calcHeading(flightPath[i], calcRandomLatLong(-180, 180, 3))
    }


        flightPoint = {
            latitude : flightPath[i][0],
            longitude : flightPath[i][1],
            altitude : altitude,
            heading : head
        }
        flightPoints.push(flightPoint)

    }

    let geo = {
        geo : flightPoints
    }


    document.getElementById('bash-script').value = 
    `curl -v -X POST -H "Content-Type:application/json"
    $LOC_URL --data ${JSON.stringify(geo)}`
  }

  function clearPath() {
    layerGroup1.clearLayers()
    //map.removeLayer(layerGroup1)

   flightPath = []

    document.getElementById('coords-list').value = ''
    document.getElementById('bash-script').value = ''
  }


