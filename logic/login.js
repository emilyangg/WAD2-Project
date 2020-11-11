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

function save_this_trip() {
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

                firebase.database().ref('users/' + userId + '/saved_trips/' + 'trip' + no_of_trips).set({
                    start_location: startLocation,
                    start_lat: start_lat,
                    start_lng: start_lng,
                    end_location: endLocation,
                    end_lat: end_lat,
                    end_lng: end_lng
                });
            });
            alert("Your trip has been saved!");
        }
    });
}

function display_saved() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var saved_list = `
                <ul class="list-group">
            `;
            var userId = user.uid;
            firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                var saved_trips = snapshot.val().saved_trips;
                for (trip in saved_trips) {
                    saved_list += `
                        <li class="list-group-item">
                            <span class="font-weight-bold">${trip}</span><br>
                            <span>Start Location: ${saved_trips[trip]["start_location"]}</span><br>
                            <span>End Location: ${saved_trips[trip]["end_location"]}</span>
                        </li>
                        
                    `;
                }
                saved_list += `
                    </ul>
                `;
                document.getElementById("carpark_list").innerHTML = saved_list; 
            });
        }
    });
}

function sign_out() {
    firebase.auth().signOut().then(function () {
        alert("You have successfully signed out!");
    }).catch(function (error) {});
}