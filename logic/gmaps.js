var map;
var markers = [];

// Embed map
function initMap() {
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
	document.getElementById('loading').style.display = "block";
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
		title: "Destination",
		icon: {                             
			url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                           
		}
	});
	markers.push(marker);
	call_carpark_api(latitude, longitude);
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
		var rates_float = parseFloat(rates.slice(1,rates.length));
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
		
		if (rates_float <= 1) {
			rates_color += "green";
		}
		else if (rates_float <= 2) {
			rates_color += "orange";
		}
		else {
			rates_color += "red";
		}
		carpark_list.push([distance,carpark_lat,carpark_lng,address,charge_interval,rates_float,rates_color,avail_lots,avail_lots_color])

	}

	return carpark_list
}

function display_markers(lat, lng) {
	var LatLng = new google.maps.LatLng(lat, lng);
	var marker = new google.maps.Marker({
		position: LatLng,
		map: map,
		title: "Carpark",
		label: carpark_list_counter.toString()
    });
    
	markers.push(marker);
}

function clearMarkers(start = 0) {
    for (var i = start; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
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
				<h4>Routes Available</h4>
				<ul class="list-group my-2">
			`;
			for (var i = 0, len = response.routes.length; i < len; i++) {
				// console.log(response.routes[i]);
				var instruction_list = []
				var route = response.routes[i];
				var steps = route.legs[0].steps;
				for(step of steps) {
					instruction_list.push(step.instructions)
				}

				var details = {
					summary: route.summary,
					distance: route.legs[0].distance.text,
					duration: route.legs[0].duration.text,
					instructions: instruction_list
				}
				console.log(details);
				
				route_list += `
					<li class="list-group-item">
						<span class="font-weight-bold">${route.summary}</span><br>
						<span>Distance: ${route.legs[0].distance.text}</span><br>
						<span>Duration: ${route.legs[0].duration.text}</span><br>
						<button type="button" class="btn btn-primary mt-1" onClick="route_info('')">Get Directions</button>
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

function route_info(route_details) {
	var details = JSON.parse(route_details);
	var direction_list = `
		<h4>${details.summary}</h4>
		<h5>${details.distance}, ${details.duration}</h5>
		<ul class="list-group">
	`;
	
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

function findRoute(start_location, end_location) {
	var startpoint = document.getElementById("startpoint")
	if (startpoint != null) {
		document.getElementById("startpoint").value = start_location
	} else {
		document.getElementById("startpoint_input").innerHTML = `
			<div class="input-group mb-3">
				<input type="text" class="form-control" placeholder="Traveling from..." id="startpoint" value="${start_location}">
			</div>	
		`;
	}
	document.getElementById("endpoint").value = end_location;
	document.getElementById("saved_list").innerHTML = "";
	generate_route();
}