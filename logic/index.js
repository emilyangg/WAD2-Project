var map;
var markers = [];
var carpark_list_counter = 0;
var route_list_counter = 0;

// Embed map
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

// Get latitude and longitude from address
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

function display_map_home() {
	if(markers.length > 0) {
		clearMarkers();
	}

  	var address = document.getElementById("endpoint").value;
	var destination = convert_geocode(address);
	var latitude = destination["lat"];
	var longitude = destination["lng"];
	console.log(latitude);
	console.log(longitude);
	var LatLng = new google.maps.LatLng(latitude, longitude);
	map.setCenter(LatLng);
	var marker = new google.maps.Marker({
		position: LatLng, 
		map: map,
		title: ""
	});
	markers.push(marker);
	call_carpark_api(latitude, longitude);
}

function call_carpark_api(lat, lng) {
	var request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText)
			var response = JSON.parse(this.responseText);
			console.log(response);

			var hdb_list = HDB_carpark_to_list(response["HDB"], lat, lng);
			var ura_list = URA_carpark_to_list(response["URA"], lat, lng);
			
			var combined_list = hdb_list.concat(ura_list);
			window.value = combined_list;

			sortby_distance();
		}
	}
	var url = "api/carpark/read.php?lat=" + lat + "&lng=" + lng;
	request.open("GET", url, false);
	request.send();
}

function URA_carpark_to_list(carpark_obj, lat, lng) {
	var carpark_list = [];
	for (carpark in carpark_obj) {
		var address = carpark_obj[carpark]["Address"];
		var carpark_lat = carpark_obj[carpark]["Latitude"];
		var carpark_lng = carpark_obj[carpark]["Longitude"];

		var distance = carpark_obj[carpark]["DistToDest"];
		var charge_interval = carpark_obj[carpark]["ChargingInterval"];

		var rates = carpark_obj[carpark].WeekdayRates;
		var rates_color =  "color: ";

		var avail_lots = carpark_obj[carpark].LotAvail;
		var avail_lots_color = "color: ";

		if (avail_lots < 11) {
            avail_lots_color += "red";
    	}
    	else if (avail_lots < 31) {
        	avail_lots_color += "orange";
    	}
    	else {
            avail_lots_color += "green";
		}
		
		if (parseFloat(rates.slice(1,rates.length)) <= 1) {
			rates_color += "green";
		}
		else if (parseFloat(rates.slice(1,rates.length)) <= 2) {
			rates_color += "orange";
		}
		else {
			rates_color += "red";
		}
		carpark_list.push([distance,carpark_lat,carpark_lng,address,charge_interval,rates,rates_color,avail_lots,avail_lots_color])

	}

	return carpark_list
}

function HDB_carpark_to_list(carpark_obj, lat, lng) {
	var carpark_list = [];
	for (carpark in carpark_obj) {
		var address = carpark_obj[carpark]["Address"]
		var carpark_lat = carpark_obj[carpark]["Latitude"];
		var carpark_lng = carpark_obj[carpark]["Longitude"];
		var distance = carpark_obj[carpark]["DistanceToDest"];
		var rates = carpark_obj[carpark]["Rates"];
		var rates_color =  "color: ";
		var charge_interval = "30 mins";
		
		var avail_lots = carpark_obj[carpark]["Lots Available"];
		var avail_lots_color = "color: ";

		if (avail_lots < 11) {
            avail_lots_color += "red";
    	}
    	else if (avail_lots < 31) {
        	avail_lots_color += "orange";
    	}
    	else {
            avail_lots_color += "green";
		}
		
		if (parseFloat(rates.slice(1,rates.length)) <= 1) {
			rates_color += "green";
		}
		else if (parseFloat(rates.slice(1,rates.length)) <= 2) {
			rates_color += "orange";
		}
		else {
			rates_color += "red";
		}

		if (avail_lots == undefined) {
			avail_lots = "Data not available";
			avail_lots_color = "color: blue"
		}

		carpark_list.push([distance,carpark_lat,carpark_lng,address,charge_interval,rates,rates_color,avail_lots,avail_lots_color])
	}
	
	return carpark_list
}

function sortby_distance(combined_list=window.value) {
	combined_list.sort(function(a, b){return a[0]-b[0]});

	display_carpark_list(combined_list)
}

function sortby_price(combined_list=window.value) {
	combined_list.sort(function(a, b){return a[5]-b[5]});

	display_carpark_list(combined_list)
}

function display_carpark_list(combined_list) {
	
	

	var carpark_display_str = `
		<ul class="list-group">
	`;
	carpark_list_counter = 0;

	for (carpark of combined_list) {
		carpark_list_counter += 1;
		var address = carpark[3]
		var carpark_lat = carpark[1];
		var carpark_lng = carpark[2];
		var distance = carpark[0];
		var rates = carpark[5];
		var rates_color =  carpark[6];
		var charge_interval = carpark[4];
		
		var avail_lots = carpark[7];
		var avail_lots_color = carpark[8];

		carpark_display_str += `
			<li class="list-group-item">
				<span class="font-weight-bold">${carpark_list_counter}. ${address}</span><br>	
				<span>Distance from Destination: ${distance}km</span><br>
				<span style="${avail_lots_color}">Available Lots: ${avail_lots}</span><br>
				<span style="${rates_color}">Rates: ${rates} per ${charge_interval}</span><br>
				<div class="btn-group mb-3">
					<button type="button" class="btn btn-primary" onclick="prepare_generate_route('${address}')">
						Select Carpark
					</button>
				</div>

				<div class="btn-group mb-3">
					<button type="button" class="btn btn-primary" onclick="map.setCenter({lat: ${carpark_lat}, lng: ${carpark_lng}})">
						Locate Carpark
					</button>
				</div>
			</li>
		`;
		display_markers(carpark_lat, carpark_lng, carpark_list_counter);
	}

	carpark_display_str += `
		</ul>
	`;
	document.getElementById("carpark_list").innerHTML = carpark_display_str; 
	document.getElementById("carpark_info").innerHTML = "";
	document.getElementById("route_list").innerHTML = "";
	document.getElementById("route_info").innerHTML = "";
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1) // Javascript functions in radians
    var dLon = deg2rad(lon2 - lon1);
	var a = 
		Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
	return deg * (Math.PI/180)
  }

function display_markers(lat, lng) {
	var LatLng = new google.maps.LatLng(lat, lng);
	var marker = new google.maps.Marker({
		position: LatLng,
		map: map,
		title: "Carpark",
		label: {
			color: 'black',
			fontWeight: 'bold',
			fontSize: '20px',
			text: carpark_list_counter.toString()
		},
		icon: {                             
			url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                           
		}
	});

	// var infowindow = new google.maps.InfoWindow();  
	// google.maps.event.addListener(marker, 'click', (function(marker) {  
	// 		return function() {
	// 			var contentString = `
	// 				<p class="font-weight-bold">${carpark_obj[carpark].Address}</p>
	// 				<p>Lots available: ${carpark_obj[carpark].LotAvail}</p>
	// 			`;    
	// 			infowindow.setContent(contentString);  
	// 			infowindow.open(map, marker);  
	// 		}  
	// })(marker));
	
	markers.push(marker);
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function prepare_generate_route(endpoint) {
	document.getElementById("endpoint").value = endpoint;
	document.getElementById("startpoint_input").innerHTML = `
		<div class="input-group mb-3">
			<input type="text" class="form-control" placeholder="Traveling from..." id="startpoint">
			
		</div>	
	`;
	document.getElementById("use_current_location").innerHTML = `
		<div class="btn-group mb-3" style="display: flex">
			<button type="button" class="btn btn-info" style="width=100%"; onclick="getGeoLocation()">
				Use Current Location
			</button>
		</div>
	`;
	document.getElementById("generate_route").innerHTML = `
		<div class="btn-group mb-3" style="display: flex">
			<div class="col">
				<button type="button" class="btn btn-block btn-primary" style="display: inline" onclick="generate_route()">Generate Route</button>
			</div>
		</div>
	`;

	document.getElementById("carpark_list").innerHTML = ""; 
	document.getElementById("saved_trips_buttons").innerHTML += `
		<button type="button" class="btn btn-block btn-primary" style="display: inline" onclick="save_this_trip()">Save this trip</button>
	`;
}

function generate_route() {
	var startLocation = document.getElementById("startpoint").value;
	if (startLocation[0] == "!"){
		startLocation = startLocation.slice(1);
		var startPoint = convert_geocode(startLocation);
		var start_LatLng = new google.maps.LatLng(startPoint["lat"], startPoint["lng"]);
		document.getElementById("startpoint").value = "Current Location";
	} else {
		var startPoint = convert_geocode(startLocation);
		var start_LatLng = new google.maps.LatLng(startPoint["lat"], startPoint["lng"]);
	}
	

	var endLocation = document.getElementById("endpoint").value;
	var endPoint = convert_geocode(endLocation);
	var end_LatLng = new google.maps.LatLng(endPoint["lat"], endPoint["lng"]);

	var directionsService = new google.maps.DirectionsService();
	var directionsRenderer = new google.maps.DirectionsRenderer();
	directionsRenderer.setMap(map);
	map.setCenter(start_LatLng);

	clearMarkers();

	displayRoute(directionsService, directionsRenderer, start_LatLng, end_LatLng);
}

function displayRoute(directionsService, directionsRenderer, pointA, pointB) {
    directionsService.route({
		origin: pointA,
		destination: pointB,
		travelMode: google.maps.TravelMode.DRIVING,
		provideRouteAlternatives: true
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
			var route_list = `
				<ul class="list-group">
			`;
			for (var i = 0, len = response.routes.length; i < len; i++) {
				// console.log(response.routes[i]);
				var route = response.routes[i];
				// console.log(route);
				var steps = route.legs[0].steps;
				var steps_stringify = JSON.stringify(steps);
				// console.log(steps_stringify);
				route_list += `
					<li class="list-group-item">
						<span class="font-weight-bold">${route.summary}</span><br>
						<span>Distance: ${route.legs[0].distance.text}</span><br>
						<span>Duration: ${route.legs[0].duration.text}</span>
						<button type="button" class="btn btn-primary" onclick='route_info("${steps_stringify}")'>Get Directions</button>
					</li>
				`;
                new google.maps.DirectionsRenderer({
                    map: map,
                    directions: response,
                    routeIndex: i
                });
			}
			route_list += `
				</ul>
			`;
			// directionsRenderer.setDirections(response);
			document.getElementById("route_list").innerHTML = route_list;
        }
        else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function route_info(steps_stringify) {
	var direction_list = `
		<ul class="list-group">
	`;
	var steps = JSON.parse(steps_stringify);
	for (step of steps) {
		route_list_counter += 1;
		direction_list += `
			<li class="list-group-item">
				<span>${route_list_counter}. ${step.instructions}</span><br>
				<span>Distance: ${step.distance.text}</span><br>
				<span>Duration: ${step.duration.text}</span>
			</li>
		`
	}
	direction_list += `
		</ul>
	`;
	document.getElementById("route_list").innerHTML = "";
	document.getElementById("route_info").innerHTML = direction_list;
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
		<span>Number of available lots: ${avail_lots}</span>

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

function getGeoLocation() {
	if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function (pos) {
				lat = pos.coords.latitude;
				lng = pos.coords.longitude;
				html_str = [lat,lng];
				document.getElementById("startpoint").value = `!${html_str}`;
				generate_route();
			});
		}
	else {
		alert("Geolocation is not enabled.");
	}
}