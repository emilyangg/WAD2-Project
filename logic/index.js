function getGeoLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
          lat = pos.coords.latitude;
          lng = pos.coords.longitude;
          html_str = `${lat},${lng}`;
          document.getElementById("startpoint").value = html_str;
      });
  }
  else {
      alert("Geolocation is not enabled.");
  }
}

//convert address to lat/longitude
function convert_geocode(address) {
  var processed_address = "";
  var url_encode = {
     :"%20";
    '"': "%22";

  }
  for (ch of address) {
    for 
  }
  var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if( request.readyState == 4 && request.status == 200 ) {
            console.log(request.responseText);
            var json_obj = JSON.parse(request.responseText);
            var records = json_obj.records;
            initialise_dropdown(records);
            initialise_cards(records);
        }
    }
    var url = `
    https://maps.googleapis.com/maps/api/geocode/json?address=${processed_address}&key=YOUR_API_KEY
    `;
    request.open("GET", url, true);
    request.send();
}

function display_home() {
  var html_str = `
  <div data-role="header">

    <div class="input-group mb-3">

      <input type="text" class="form-control" placeholder="Traveling from..." id="startpoint">
    
      <button type="button" class="btn btn-info" style="width=100%;">
        Search
      </button>    
    
    </div>
    
    <div class="btn-group mb-3" style="display: flex">
      
      <div class="col">
        <button type="button" class="btn btn-block btn-primary" style="margin: 5px, display: inline" onclick="getGeoLocation()">Use Current Location</button>
      </div>

    </div>

  </div>

  <div data-role="content">

    <div class="input-group mb-3">

      <input type="text" class="form-control" placeholder="Traveling to..." id="endpoint">
      
      <button type="button" class="btn btn-info" style="width=100%;">
        Search
      </button>
    
    </div>
      
  </div> 
  
  <div data-role="footer">

    <div class="btn-group mb-3" style="display: flex">
      
      <div class="col">
        <button type="button" class="btn btn-block btn-primary" style="display: inline" onclick="display_carpark_list">Generate Route</button>
      </div>

      <div class="col">
        <button type="button" class="btn btn-block btn-primary" style="display: inline" onclick="display_saved">Saved Trips</button>
      </div>

    </div>

  </div>`;
  document.getElementById("home").innerHTML = html_str;
  document.getElementById("carpark_list").innerHTML = "";
  document.getElementById("carpark_info").innerHTML = "";
  document.getElementById("route_list").innerHTML = "";
  document.getElementById("route_info").innerHTML = "";
}

function display_carpark_list() {
  var html_str_1 = `
  <div data-role="header">
  <!-- Carparks near destination -->
  </div>

  <div data-role="content">
    <!-- List of carparks -->
    <div class="list-group">
  `;

  var carpark_list =''

  for (var carpark of apicarparks) {
    carpark_list += `<a href="#" class="list-group-item list-group-item-action" onclick(display_carpark_info(${carpark}))>${carpark}</a>`
  }

  var html_str_2 =`
    </div>
  </div> 
  
  <div data-role="footer">
    <!-- Nothing? -->
  </div> 
  `;      
  var final_html_str = html_str_1 + carpark_list + html_str_2; 
  document.getElementById("carpark_list").innerHTML = final_html_str; 
  document.getElementById("home").innerHTML = "";
  document.getElementById("carpark_info").innerHTML = "";
  document.getElementById("route_list").innerHTML = "";
  document.getElementById("route_info").innerHTML = "";
}

function display_carpark_info(carpark) {
  var carpark_name = object.carpark_name;
  var distance = object.distance; //may need to be calculated
  var avail_lots = object.avail_lots;
  var carpark_coord = object.carpark_coord;

  //To be edited after data structure confirmed

  var html_str = `
  <div data-role="header">
    <!-- Carpark Info-->
  </div>

  <div data-role="content">
    <h1>${carpark_name}</h1>
    <span>Distance from Destination: ${distance}</span>
    <span>Number of available lots: ${avail_lots}
  </div> 
  
  <div data-role="footer">
    <!--Button to select this carpark, go to routes -->
    <button type="button" class="btn btn-primary" onclick="display_route_list(${carpark_coord})">Select</button>
  </div>
  `;
  document.getElementById("carpark_info").innerHTML = html_str;
  document.getElementById("home").innerHTML = "";
  document.getElementById("carpark_list").innerHTML = ""; 
  document.getElementById("route_list").innerHTML = "";
  document.getElementById("route_info").innerHTML = "";
}

function display_route_list(startpoint, carpark_coord) {
  var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if( request.readyState == 4 && request.status == 200 ) {
            console.log(request.responseText);
            var json_obj = JSON.parse(request.responseText);
            var records = json_obj.records;
            initialise_dropdown(records);
            initialise_cards(records);
        }
    }
    var url = `
    https://maps.googleapis.com/maps/api/directions/json?
    origin=${startpoint}&destination=${carpark_coord}
    &avoid=tolls &mode=driving
    &key=YOUR_API_KEY`;
    request.open("GET", url, true);
    request.send();
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
  directionsService.route({
      origin: pointA
      , destination: pointB
      , travelMode: google.maps.TravelMode.DRIVING
  }, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
      }
      else {
          window.alert('Directions request failed due to ' + status);
      }
  });
}
