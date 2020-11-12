


// Loop this one in the display function
carpark_list += `
			<li class="list-group-item">
				<span class="font-weight-bold">${carpark_list_counter}. ${carpark_obj[carpark]["Address"]}</span><br>	
				<span>Distance from Destination: ${distance.toFixed(2)}km</span><br>
				<span style="${avail_lots_color}">Available Lots: ${avail_lots}</span><br>
				<span style="${rates_color}">Rates: ${rates} per ${charge_interval}</span><br>
				<div class="btn-group mb-3">
					<button type="button" class="btn btn-primary" onclick="prepare_generate_route('${carpark_obj[carpark].Address}')">
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



function display_HDB_carpark(carpark_obj, lat, lng) {
	var carpark_list = ``;
	for (carpark in carpark_obj) {
		carpark_list_counter += 1;
		var carpark_lat = carpark_obj[carpark]["Latitude"];
		var carpark_lng = carpark_obj[carpark]["Longitude"];
		var distance = calculateDistance(lat, lng, carpark_lat, carpark_lng);
		var rates = carpark_obj[carpark]["Rates"];
		var rates_color =  "color: ";
		
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
		carpark_list += `
			<li class="list-group-item">
				<span class="font-weight-bold">${carpark_list_counter}. ${carpark_obj[carpark]["Address"]}</span><br>	
				<span>Distance from Destination: ${distance.toFixed(2)}km</span><br>
				<span style="${avail_lots_color}">Number of available lots: ${avail_lots}</span><br>
				<span style="${rates_color}">Rates: ${rates}</span><br>
				<div class="btn-group mb-3">
					<button type="button" class="btn btn-primary" onclick="prepare_generate_route('${carpark_obj[carpark].Address}')">
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
	return carpark_list
}


function display_URA_carpark(carpark_obj, lat, lng) {
	var carpark_list = ``;
	for (carpark in carpark_obj) {
		carpark_list_counter += 1;
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
		carpark_list += `
			<li class="list-group-item">
				<span class="font-weight-bold">${carpark_list_counter}. ${carpark_obj[carpark]["Address"]}</span><br>	
				<span>Distance from Destination: ${distance.toFixed(2)}km</span><br>
				<span style="${avail_lots_color}">Available Lots: ${avail_lots}</span><br>
				<span style="${rates_color}">Rates: ${rates} per ${charge_interval}</span><br>
				<div class="btn-group mb-3">
					<button type="button" class="btn btn-primary" onclick="prepare_generate_route('${carpark_obj[carpark].Address}')">
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
	return carpark_list
}