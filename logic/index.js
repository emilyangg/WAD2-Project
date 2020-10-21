var map;

function initMap() {
	// map = new google.maps.Map(document.getElementById("map"), {
	// 	center: { lat: 1.296568, lng: 103.852119 },
	// 	zoom: 15,
	// });
	var mapDiv = document.getElementById("map");
	var latitude = 1.296568;
	var longitude = 103.852119;
	var LatLng = new google.maps.LatLng(latitude, longitude);
	var mapOptions = {
		zoom: 15,
		center: LatLng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(mapDiv, mapOptions);
}

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

// get long/latitude from address
function convert_geocode(address) {
	var processed_address = "";
	var ch_arr = [" ", '"', "<", ">", "#", "%", "|", "'"];
	var replace_arr = ["%20", "%22", "%3C", "%3E", "%23", "%25", "%7C", "%27"];
	var center = {};
	for (ch of address) {
		var should_encode = true;
    	for (i = 0; i < ch_arr.length; i++) {
      		if (ch == ch_arr[i]) {
				processed_address += replace_arr[i];
				should_encode = false;
      		}
		}
		if (should_encode == true) {
			processed_address += ch;
		}

	}

	var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if( request.readyState == 4 && request.status == 200 ) {
            //console.log(request.responseText);
            var json_obj = JSON.parse(request.responseText);
			var results = json_obj.results;
			// console.log(results);
			center = results[0].geometry.location;
        }
    }
	var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + processed_address + "&key=AIzaSyA8VsAlF9qO4eWgdZ85_EZxwZSYD2folMM";
    request.open("GET", url, false);
	request.send();
	return center;
}

function display_home() {
	var html_str = `
		<div data-role="header">
		</div>

		<div data-role="content">
			<div class="input-group mb-3">
				<input type="text" class="form-control" placeholder="Traveling to..." id="endpoint">
				<button type="button" class="btn btn-info" style="width=100%"; onclick="display_map_home()">
					Enter
				</button>
			</div>
		</div> 

		<div data-role="footer">
			<div class="btn-group mb-3" style="display: flex">
				<div class="col">
					<button type="button" class="btn btn-block btn-primary" style="display: inline" onclick="display_saved">Saved Trips</button>
				</div>
			</div>
		</div>
	`;

	document.getElementById("home").innerHTML = html_str;
	document.getElementById("carpark_list").innerHTML = "";
	document.getElementById("carpark_info").innerHTML = "";
	document.getElementById("route_list").innerHTML = "";
	document.getElementById("route_info").innerHTML = "";
}

function display_map_home() {
  	var address = document.getElementById("endpoint").value;
	var destination = convert_geocode(address);
	var latitude = destination["lat"];
	var longitude = destination["lng"];
	var LatLng = new google.maps.LatLng(latitude, longitude);
	map.setCenter(LatLng);
	var marker = new google.maps.Marker({
        position: LatLng
        , map: map
        , title: ""
	});
	call_carpark_api(latitude, longitude);
}

function call_carpark_api(lat, lng) {
	var request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			display_carpark_list(response);
		}
	}
	var url = "api/carpark/read.php?lat=" + lat + "&lng=" + lng;
	request.open("GET", url, false);
	request.send();
}

function display_carpark_list(carpark_obj) {
	var carpark_list = `
		<ul class="list-group">
	`;

	for (carpark in carpark_obj) {
		// carpark_list += `<a href="#" class="list-group-item list-group-item-action" onclick(display_carpark_info(${carpark}))>${carpark}</a>`;
		var LatLng = new google.maps.LatLng(carpark_obj[carpark].latitude, carpark_obj[carpark].longitude);
		var marker = new google.maps.Marker({
			position: LatLng
			, map: map
			, title: carpark_obj[carpark].Address
		});
		carpark_list += `
				<li class="list-group-item">
					<p class="font-weight-bold">${carpark_obj[carpark].Address}</p>
					<p>Lots available: ${carpark_obj[carpark].LotAvail}</p>
				</li>
		`;
	}

	carpark_list += `
		</ul>
	`;
	document.getElementById("carpark_list").innerHTML = carpark_list; 
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
  var html_str = `
  <div class="input-group mb-3">

    <input type="text" class="form-control" placeholder="Traveling from..." id="startpoint">
  
    <button type="button" class="btn btn-info" style="width=100%;">
      Enter
    </button>    
  
  </div>

    
  <div class="btn-group mb-3" style="display: flex">
    
    <div class="col">
      <button type="button" class="btn btn-block btn-primary" style="margin: 5px, display: inline" onclick="getGeoLocation()">Use Current Location</button>
    </div>

  </div>
  `;

  var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if( request.readyState == 4 && request.status == 200 ) {
            console.log(request.responseText);
            var json_obj = JSON.parse(request.responseText);
            var records = json_obj.records;
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

function update_map_display(url) {
  const base_url = `
  https://www.google.com/maps/embed/v1/place
  ?key=AIzaSyA8VsAlF9qO4eWgdZ85_EZxwZSYD2folMM
  `;
  document.getElementById("map_embed").src = "url"
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