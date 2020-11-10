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
				console.log(response.routes[i]);
				var route = response.routes[i];
				console.log(route);
				// var route_string = JSON.stringify(route);
				route_list += `
					<li class="list-group-item">
						<span class="font-weight-bold">${route.summary}</span><br>
						<span>Distance: ${route.legs[0].distance.text}</span><br>
						<span>Duration: ${route.legs[0].duration.text}</span>
						<button type="button" class="btn btn-primary" onclick="route_info(${route})">Get Directions</button>
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

function route_info(route) {
	var direction_list = `
		<ul class="list-group">
	`;
	console.log(route);
	var steps = route.legs[0].steps;
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