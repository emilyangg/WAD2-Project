
// Call carpark API in read.php
function call_carpark_api(lat, lng) {
	document.getElementById("saved_list").innerHTML = "";
	var request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			if(response['HDB'].length == 0 && response['URA'].length == 0){
				document.getElementById("carpark_list").innerHTML = `
				<div class="alert alert-danger" role="alert">
					There are no carparks nearby! Please enter a new location!
				</div>
				`;
			} else{
				var hdb_list = HDB_carpark_to_list(response["HDB"], lat, lng);
				var ura_list = URA_carpark_to_list(response["URA"], lat, lng);
				
				var combined_list = hdb_list.concat(ura_list);
				window.value['carparks_list'] = combined_list;
	
				sortby_distance();
			}

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
		console.log(address);
		console.log(fullrates);

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
		console.log(address);
		console.log(fullrates);

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
				<span class="font-weight-bold">${carpark_list_counter}. ${address}</span>
				<span style="float:right" title="View Full Rates">
					<i class="fas fa-info-circle" data-toggle="modal" data-target=".bd-example-modal-lg" onclick="view_fullrates(${carpark_list_counter})"></i>
				</span>
				<br>	
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

				<div class="modal fade bd-example-modal-lg " role="dialog" tabindex="-1" role="dialog" data-backdrop="static" aria-labelledby="myLargeModalLabel" aria-hidden="true">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="container-fluid">
								<div class="row">
									<div class="col-lg-12">
										<div class="modal-body" id="modalcontent">
										
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
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
	document.getElementById("saved_list").innerHTML = "";
}

// Find nearby carpark based on the saved trip
function findNearbyCarpark(end_location) {
	document.getElementById("endpoint").value = end_location;
	document.getElementById("endButton").innerHTML = `
		<span id="endButton" class="input-group-append">
			<button  type="button" class=" btn btn-info" onclick="display_map_home()">
				Enter
			</button>
		</span>
	`;
	document.getElementById("startpoint_input").innerHTML = "";
	document.getElementById("use_current_location").innerHTML = "";
	document.getElementById("generate_route").innerHTML = "";
	if (document.getElementById("save_this_trip") != null){
		document.getElementById("save_this_trip").innerHTML = "";
	}
	document.getElementById("saved_list").innerHTML = "";
	display_map_home()
}

// Update the modal's content to display the full rates of this selected carpark
function view_fullrates(carpark_index) {
	carpark_index = parseInt(carpark_index);
	var selected_carpark = window.value['carparks_list'][carpark_index-1];
	var fullrates = selected_carpark[9];
	var modal_contents = `
	<table style="overflow-x: auto;" class="table table-striped table-bordered table-responsive-xl">
		<thead>
			<tr>
				<th scope="col">Start Time</th>
				<th scope="col">End Time</th>
				<th scope="col">Weekday Interval (mins)</th>
				<th scope="col">Weekday Rates ($)</th>
				<th scope="col">Saturday Interval (mins)</th>
				<th scope="col">Saturday Rates ($)</th>
				<th scope="col">Sunday Interval (mins)</th>
				<th scope="col">Sunday Rates ($)</th>
			</tr>
		</thead>
		<tbody>`;
	console.log(selected_carpark);
	console.log(fullrates);
	for (obj of fullrates) {
		var wd_rates_color = "color: ";
		if (obj.weekdayRates <= 1) {
			wd_rates_color += "green";
		}
		else if (obj.weekdayRates <= 2) {
			wd_rates_color += "orange";
		}
		else {
			wd_rates_color += "red";
		}

		var sat_rates_color = "color: ";
		if (obj.satRates <= 1) {
			sat_rates_color += "green";
		}
		else if (obj.satRates <= 2) {
			sat_rates_color += "orange";
		}
		else {
			sat_rates_color += "red";
		}

		var sun_rates_color = "color: ";
		if (obj.sunRates <= 1) {
			sun_rates_color += "green";
		}
		else if (obj.sunRates <= 2) {
			sun_rates_color += "orange";
		}
		else {
			sun_rates_color += "red";
		}

		modal_contents += 
		`<tr>
			<td scope="col">${obj.start}</td>
			<td scope="col">${obj.end}</td>
			<td scope="col">${obj.weekdayInterval}</td>
			<td scope="col"><span style="${wd_rates_color}">${obj.weekdayRates}</span></td>
			<td scope="col">${obj.satInterval}</td>
			<td scope="col"><span style="${sat_rates_color}">${obj.satRates}</span></td>
			<td scope="col">${obj.sunInterval}</td>
			<td scope="col"><span style="${sun_rates_color}">${obj.sunRates}</span></td>
		</tr>`
	};
	modal_contents += `
		</tbody>
	</table>`;
	document.getElementById("modalcontent").innerHTML = modal_contents;
}
