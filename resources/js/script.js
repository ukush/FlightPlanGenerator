
/**
 * 
 * @param {*} latlngStart The starting point's lat lng
 * @param {*} latlngEnd  The ending point's lat lng
 * @returns the bearing or heading between the two points
 */
function calcHeading(latlngStart, latlngEnd) {


    // Convert to Radians
    const startLat = toRadians(latlngStart[0])
    const startLng = toRadians(latlngStart[1])
    const endLat = toRadians(latlngEnd[0])
    const endLng = toRadians(latlngEnd[1])

    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
            Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);

    let bearing = Math.atan2(y, x);
    bearing = toDegrees(bearing);
    return (bearing + 360) % 360;

}

/**
 * Funtion to convert degrees to radians
 * @param degrees the lat or long in degrees
 * @returns the radians for the lat or long point
 */
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

/**
 * Funtion to convert degrees to radians
 * @param radians the lat or long in radians
 * @returns the degrees for the lat or long point
 */
function toDegrees(radians) {
  return radians * 180 / Math.PI;
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

    if (flightPath.length != 0) {

    // Individual JSON for storing the flight info for each point in the flight plan
    let flightPoint
    // List of JSON storing all flight point data
    let flightPoints = []


    // Loop though each latlng in the flightpath
    for (let i = 0; i < flightPath.length; i++) {

        // Randomly calculate a altitute
        altitude = Math.floor((Math.random() * (10010 - 9990 + 1) + 9990));

        let head;

        // calcualte the heading of a point based off of it's relationship with
        // the next point
        // If the last point, use a random latlong to calculate heading
        if (i != (flightPath.length - 1)) {
            head = calcHeading(flightPath[i], flightPath[i + 1])
        }
        else {
            head = calcHeading(flightPath[i], calcRandomLatLong(-180, 180, 3))
        }

        latitude = flightPath[i][0]
        longitude = flightPath[i][1]

        // Create a flight point JSON
        flightPoint = {
            geo : {
                latitude: latitude,
                longitude: longitude,
                altitude: altitude,
            },
            heading: head,
            groundTrack : head,
            groundSpeed : 300
        }
        flightPoints.push(flightPoint)

        let latInMilli = degreesToMilli(parseInt(latitude))
        let longInMilli = degreesToMilli(parseInt(longitude))
        let altInMilli = degreesToMilli(parseInt(altitude))

        snmpsetScript(latInMilli, longInMilli, altInMilli)

    }

        // let latInMilli = degreesToMilli(parseInt(latitude))
        // let longInMilli = degreesToMilli(parseInt(longitude))
        // let altInMilli = degreesToMilli(parseInt(altitude))
        //
        // snmpsetScript(latInMilli, longInMilli, altInMilli)

    flightPoints.forEach((element) => {
        // Put this JSON into the text area in the format of the script
        document.getElementById('bash-script').value +=
            `curl -v -X POST -H "Content-Type:application/json" $LOC_URL --data '${JSON.stringify(element)}'` + "\n\n"
    })
} else {
    alert('Cannot generate curl script for empty flight path')
}

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
    document.getElementById('snmpset-format').value = ''
}

function copyClip(script) {
    let text = document.getElementById(script).value

    // Copy the text inside the text field
    navigator.clipboard.writeText(text);
}

function exportScript() {
    let curl = document.getElementById('bash-script').value
    let snmpset = document.getElementById('snmpset-format').value

    if (curl && snmpset != "") {
        let blob = new Blob([curl, snmpset], { type: 'text/plain' })

        const a = document.createElement('a');
    
        a.href = URL.createObjectURL(blob);
        a.download = "flightplanscript.txt";
        a.click();
    
        URL.revokeObjectURL(a.href);
    } else {
        alert("Cannot export empty flight path")
    }
}

function degreesToMilli(degrees) {
    return parseInt(degrees * 60 * 60 * 1000)
}

function snmpsetScript(lat, long, alt) {
    let text = document.getElementById('snmpset-format').value +=
    `snmpset -v 2c -c public $HOST_IP:10161 1.3.6.1.4.1.3231.1.5.57.1.1.1.14.$TERM_ID i ${lat}` + '\n' +
    `snmpset -v 2c -c public $HOST_IP:10161 1.3.6.1.4.1.3231.1.5.57.1.1.1.14.$TERM_ID i ${long}` + '\n' +
    `snmpset -v 2c -c public $HOST_IP:10161 1.3.6.1.4.1.3231.1.5.57.1.1.1.14.$TERM_ID i ${alt}` + '\n' +
    `snmpset -v 2c -c public $HOST_IP:10161 1.3.6.1.4.1.3231.1.5.57.1.1.1.14.$TERM_ID i 0` + '\n\n'
}