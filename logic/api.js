window.value = {};

// Call carpark API in read.php
function call_carpark_api(lat, lng) {
	var request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);

			var hdb_list = HDB_carpark_to_list(response["HDB"], lat, lng);
			var ura_list = URA_carpark_to_list(response["URA"], lat, lng);
			
			var combined_list = hdb_list.concat(ura_list);
			window.value['carparks_list'] = combined_list;

			sortby_distance();
		}
	}
	var url = "api/carpark/search.php?lat=" + lat + "&lng=" + lng;
	request.open("GET", url, true);
	request.send();
}

// Retrieves URA carpark information
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

		var fullrates = carpark_obj[carpark].FullRates;

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
		carpark_list.push([distance,carpark_lat,carpark_lng,address,charge_interval,rates_float,rates_color,avail_lots,avail_lots_color,fullrates])

	}

	return carpark_list
}

// Retrieves HDB carpark information
function HDB_carpark_to_list(carpark_obj, lat, lng) {
	var carpark_list = [];
	for (carpark in carpark_obj) {
		var address = carpark_obj[carpark]["Address"]
		var carpark_lat = carpark_obj[carpark]["Latitude"];
		var carpark_lng = carpark_obj[carpark]["Longitude"];
		var distance = carpark_obj[carpark]["DistanceToDest"];
		var rates = carpark_obj[carpark]["Rates"];
		var rates_float = parseFloat(rates.slice(1,rates.length));
		var rates_color =  "color: ";
		var charge_interval = carpark_obj[carpark]["ChargingInterval"];
		
		var avail_lots = carpark_obj[carpark]["Lots Available"];
		var avail_lots_color = "color: ";

		var fullrates = carpark_obj[carpark]["FullRates"];

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

		if (avail_lots == undefined) {
			avail_lots = "Data not available";
			avail_lots_color = "color: blue"
		}

		carpark_list.push([distance,carpark_lat,carpark_lng,address,charge_interval,rates_float,rates_color,avail_lots,avail_lots_color,fullrates])
	}
	
	return carpark_list
}

// Sort carpark list by distance
function sortby_distance(combined_list=window.value['carparks_list']) {
	var sorted_list = combined_list.sort(function(a, b){return a[0]-b[0]});
	clearMarkers(1);

	document.getElementById("carpark_list").innerHTML = '';
	console.log(combined_list);
	display_carpark_list(sorted_list);
}

// Sort carpark list by price
function sortby_price(combined_list=window.value['carparks_list']) {
	var sorted_list = combined_list.sort(function(a, b){return a[5]-b[5]});
	clearMarkers(1);

	document.getElementById("carpark_list").innerHTML = '';
	display_carpark_list(sorted_list);
}

// Sort carpark list by available lots
function sortby_lots(combined_list=window.value['carparks_list']) {
	var cp_no_lot_avails = [];
	var cp_lot_avails = []

	for (carpark_list of combined_list) {
		if (carpark_list[7] == "Data not available") {
			cp_no_lot_avails.push(carpark_list);
		} else {
			carpark_list[7] = parseInt(carpark_list[7]);
			cp_lot_avails.push(carpark_list);
		}
	}
	var sorted_cp_lot_avails = cp_lot_avails.sort(function(a, b){return b[7]-a[7]})

	var sorted_list = sorted_cp_lot_avails.concat(cp_no_lot_avails);
	clearMarkers(1);

	document.getElementById("carpark_list").innerHTML = '';
	display_carpark_list(sorted_list);
}

// Display list of carparks nearby
function display_carpark_list(display_carpark_list) {

	var carpark_display_str = `
		<div class="d-flex">
			<div class="mt-1">
				<h4>Carparks Nearby</h4>
			</div>
			<div class="dropdown ml-auto">
				<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Sort By
				</button>
				<div class="dropdown-menu dropdown-menu-right"" aria-labelledby="dropdownMenuButton">
					<a class="dropdown-item" onclick="sortby_distance()">Distance</a>
					<a class="dropdown-item" onclick="sortby_price()">Price</a>
					<a class="dropdown-item" onclick="sortby_lots()">Available Lots</a>
				</div>
			</div>
		</div>
		<ul class="list-group my-2">
	`;
	carpark_list_counter = 0;

	for (carpark of display_carpark_list) {
		carpark_list_counter += 1;
		var address = carpark[3]
		var carpark_lat = carpark[1];
		var carpark_lng = carpark[2];
		var distance = carpark[0];
		var rates = carpark[5].toFixed(2);
		var rates_color =  carpark[6];
		var charge_interval = carpark[4];
		
		var avail_lots = carpark[7];
		var avail_lots_color = carpark[8];

		carpark_display_str += `
			<li class="list-group-item">
				<span class="font-weight-bold">${carpark_list_counter}. ${address}</span><br>	
				<span>Distance from Destination: ${distance}km</span><br>
				<span style="${avail_lots_color}">Available Lots: ${avail_lots}</span><br>
				<span style="${rates_color}">Rates: $${rates} per ${charge_interval}</span><br>
				<div class="btn-group mt-1">
					<button type="button" class="btn btn-primary" onclick="prepare_generate_route('${address}')">
						Select Carpark
					</button>
				</div>

				<div class="btn-group mt-1">
					<button type="button" class="btn btn-primary" onclick="map.setCenter({lat: ${carpark_lat}, lng: ${carpark_lng}})">
						Locate Carpark
					</button>
				</div>
				
				<div class="btn-group mt-1">
					<button type="button" class="btn btn-primary" onclick="view_fullrates('${carpark_list_counter}')">
						View Full Rates
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

// Find nearby carpark based on the saved trip
function findNearbyCarpark(end_location) {
	document.getElementById("endpoint").value = end_location;
	document.getElementById("saved_list").innerHTML = "";
	display_map_home()
}

function view_fullrates(carpark_index) {
	carpark_index = parseInt(carpark_index);
	var selected_carpark = window.value['carparks_list'][carpark_index];
	var fullrates = carpark[9];
	console.log(fullrates);
}
