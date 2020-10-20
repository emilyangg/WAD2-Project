// This function is to display a man on loading the document
let map;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}


function destination_click() {
  // Need to retrieve dynamically the address for the destination, using DOM
  // For now assume user inputs postal code of destination, if they want to do a search we can upgrade it to google maps predictive locations

  var destination = 804920;


}