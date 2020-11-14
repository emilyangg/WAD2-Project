// Login to user account
function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    if (email == "" || password == "") {
        document.getElementById("message").innerHTML = `
            <div class="alert alert-danger" role="alert">
                Please enter your E-Mail/Password to login.
            </div>
        `;
    }
    else {
        //Firebase Login
        firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    window.location.href = "index.html";
                }
            });
        }).catch(function (error) {
            //Contains all Authentication Error Code
            switch (error.code) {
            case "auth/invalid-email":
                document.getElementById("message").innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        The E-Mail/Password you have entered is not valid.
                    </div>
                `;
                console.log("Invalid email");
                break;
            case "auth/user-disabled":
                document.getElementById("message").innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Account is disabled, please contact the admin.
                    </div>
                `;
                console.log("Account disabled");
                break;
            case "auth/user-not-found":
                document.getElementById("message").innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        The user is not found.
                    </div>
                `;
                console.log("User not found");
                break;
            case "auth/wrong-password":
                document.getElementById("message").innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        The E-Mail/Password you have entered is not valid.
                    </div>
                `;
                console.log("Wrong password");
                break;
            }
        });
    }
}

// Save a trip with start and end location
function save_this_trip() {
    var trip_name = document.getElementById("trip_name").value;
    var startLocation = document.getElementById("startpoint").value;
	if (Array.isArray(startLocation)){
        var start_lat = startLocation[0];
        var start_lng = startLocation[1];
	} else{
        var startPoint = convert_geocode(startLocation);
        var start_lat = startPoint["lat"];
        var start_lng = startPoint["lng"];
	}

	var endLocation = document.getElementById("endpoint").value;
    var endPoint = convert_geocode(endLocation);
    var end_lat = endPoint["lat"];
    var end_lng = endPoint["lng"];
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                var no_of_trips = snapshot.val().no_of_trips + 1;
                var updates = {};
                updates['/users/' + userId + '/no_of_trips/'] = no_of_trips;

                firebase.database().ref().update(updates);
                firebase.database().ref('users/' + userId + '/saved_trips/trip' + no_of_trips + '/').set({
                    name: trip_name,
                    start_location: startLocation,
                    start_lat: start_lat,
                    start_lng: start_lng,
                    end_location: endLocation,
                    end_lat: end_lat,
                    end_lng: end_lng
                });
            });
            alert("Your trip has been saved!");
            display_saved();
        }
    });
}

// Display saved trips
function display_saved() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var saved_list = `
                <h4>Saved Trips</h4>
                <ul class="list-group my-2">
            `;
            var userId = user.uid;
            firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                var saved_trips = snapshot.val().saved_trips;
                for (trip in saved_trips) {
                    var trip_name = saved_trips[trip]["name"];
                    var start_location = saved_trips[trip]["start_location"];
                    var end_location = saved_trips[trip]["end_location"];
                    saved_list += `
                        <li class="list-group-item">
                            <span class="font-weight-bold">${trip_name}</span><br>
                            <span>Start Location: ${start_location}</span><br>
                            <span>End Location: ${end_location}</span><br>
                            <i class="far fa-edit" onclick="edit_trip('${trip}','${trip_name}','${start_location}','${end_location}')"></i>
                            <i class="far fa-trash-alt" onclick="delete_trip('${trip}')"></i> 
                            <button type="button" class="btn btn-primary mt-1" onClick="findNearbyCarpark('${end_location}')">Nearby Carparks</button>
                            <button type="button" class="btn btn-primary mt-1" onClick="findRoute('${start_location}','${end_location}')">Find Routes</button>
                        </li>
                    `;
                }
                saved_list += `
                    </ul>
                `; 
                document.getElementById("saved_list").innerHTML = saved_list;
                document.getElementById("carpark_list").innerHTML = "";
                document.getElementById("route_list").innerHTML = "";
            });
        }
    });
}

// Edit the selected trip
function edit_trip(trip, trip_name, start_location, end_location) {
    document.getElementById("saved_list").innerHTML = `
        <h4>Edit Trip</h4>
        <div class="card">
            <div class="card-body">
                <div class="form-group">
                    <label for="edit_trip_name">Trip Name</label>
                    <input type="text" class="form-control" id="edit_trip_name" value="${trip_name}">
                </div>
                <div class="form-group">
                    <label for="edit_start_location">Start Location</label>
                    <input type="text" class="form-control" id="edit_start_location" value="${start_location}">
                </div>
                <div class="form-group">
                    <label for="edit_end_location">End Location</label>
                    <input type="text" class="form-control" id="edit_end_location" value="${end_location}">
                </div>
                <button type="button" class="btn btn-primary" onclick="update_trip('${trip}')">Save</button>
            </div>
        </div>	
    `;
}

// Update trip based on user input
function update_trip(trip) {
    var trip_name = document.getElementById("edit_trip_name").value;
    var new_start_location = document.getElementById("edit_start_location").value;
    var new_end_location = document.getElementById("edit_end_location").value;

    var startPoint = convert_geocode(new_start_location);
    var start_lat = startPoint["lat"];
    var start_lng = startPoint["lng"];

    var endPoint = convert_geocode(new_end_location);
    var end_lat = endPoint["lat"];
    var end_lng = endPoint["lng"];
    
    var user = firebase.auth().currentUser;
    if (user) {
        var userId = user.uid;
        var updates = {};
        updates['/users/' + userId + '/saved_trips/' + trip + '/name/'] = trip_name;
        updates['/users/' + userId + '/saved_trips/' + trip + '/start_location/'] = new_start_location;
        updates['/users/' + userId + '/saved_trips/' + trip + '/start_lat/'] = start_lat;
        updates['/users/' + userId + '/saved_trips/' + trip + '/start_lng/'] = start_lng;
        updates['/users/' + userId + '/saved_trips/' + trip + '/end_location/'] = new_end_location;
        updates['/users/' + userId + '/saved_trips/' + trip + '/end_lat/'] = end_lat;
        updates['/users/' + userId + '/saved_trips/' + trip + '/end_lng/'] = end_lng;
        firebase.database().ref().update(updates);
        display_saved();
    }
}

// Delete the selected trip
function delete_trip(trip) {
    var user = firebase.auth().currentUser;
    if (user) {
        var userId = user.uid;
        firebase.database().ref('/users/' + userId + '/saved_trips/' + trip).remove()
        display_saved();
    }
}

// Sign out of user account
function sign_out() {
    firebase.auth().signOut().then(function () {
        
    }).catch(function (error) {});
}

// Display user information
function my_profile() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            var email = user.email;

            firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                document.getElementById("username").innerText = snapshot.val().username;
            })

            document.getElementById("email").innerText = email;
        }
    });
}


// Send user password reset email
function send_password_reset() {
    var auth = firebase.auth();
    var emailAddress = document.getElementById("email").value

    // var actionCodeSettings = {
    //     // After password reset, the user will be give the ability to go back
    //     // to this page.
    //     url: 'login.html',
    //     handleCodeInApp: false
    // };

    auth.sendPasswordResetEmail(emailAddress).then(function() {
        // Email sent.
        document.getElementById("message").innerHTML = `
            <div class="alert alert-success" role="alert">
                An email has been sent to your email address!
            </div>
        `;
    }).catch(function(error) {
        // An error happened.
    });
}