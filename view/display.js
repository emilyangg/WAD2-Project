// This is the main file that interacts with the html file and imports functions from the other files
// This file will also contain the functions that write into HTML elements

// Prompt users to enter location to generate route
function prepare_generate_route(carpark) {
	var destination = document.getElementById("endpoint").value;
    document.getElementById("endpoint").value = carpark;
    document.getElementById("endButton").innerHTML = "";
	document.getElementById("startpoint_input").innerHTML = `
		<div class="input-group mb-3">
			<input type="text" class="form-control" placeholder="Traveling from..." id="startpoint">
		</div>	
	`;
	document.getElementById("use_current_location").innerHTML = `
		<div class="btn-group mb-3" style="display: flex">
			<button type="button" class="btn btn-secondary" style="width=100%" onclick="getGeoLocation()">
				Use Current Location 
				<i class="fas fa-location-arrow"></i>
			</button>
		</div>
	`;
	document.getElementById("generate_route").innerHTML = `
		<input type='hidden' id='destination' value='${destination}'>
		<div class="btn-group mb-3" style="display: flex">
			<div class="col">
				<button type="button" class="btn btn-block btn-success" style="display: inline" onclick="generate_route()">
					Generate Route
					<i class="fas fa-route"></i>
				</button>
			</div>
		</div>
	`;

	document.getElementById("carpark_list").innerHTML = ""; 
	document.getElementById("saved_trips_buttons").innerHTML += `
		<div class="mt-3" id="save_this_trip">
			<button type="button" class="btn btn-block btn-primary" style="display: inline" data-toggle="modal" data-target="#exampleModal">
				Save this trip
				<i class="fas fa-save"></i>
			</button>
		</div>

		<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content" id="savetrip_modal">
			<div class="modal-header">
				<h5 class="modal-title" id="exampleModalLabel">Trip Info</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body">
				<input type="text" class="form-control" placeholder="Trip Name" id="trip_name" v-model="trip_name">
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary" onclick="save_this_trip()" data-dismiss="modal" :disabled='isDisabled'>
					Save
					<i class="fas fa-save"></i>
				</button>
			</div>
			</div>
		</div>
	`;

	// Vue reactive for save this trip button
	var save_trips = new Vue({
		el:'#savetrip_modal',
		data: {
			trip_name: ''
		},
		computed: {
			isDisabled: function(){
				return !(this.trip_name.trim().length >0);
			}
		}
	})

	// var generate_route = new Vue({
	// 	el:'#home',
		
	// 	data: {
	// 		start: '',
	// 	},
	// 	computed: {
	// 		isDisabled: function(){
	// 			return !(this.start.trim().length>0);
	// 		}
	// 	}
	// })
		
}

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
	var backToTopBtn = document.getElementById("backToTopBtn");
	var menu = document.getElementById("menu");
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 || menu.scrollTop > 20) {
		backToTopBtn.style.display = "block";
	}
	 else {
		backToTopBtn.style.display = "none";
	}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.documentElement.scrollTop = 0;
  document.getElementById('menu').scrollTop = 0; // For Chrome, Firefox, IE and Opera
}