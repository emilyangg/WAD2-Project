// Sign up for an account
function sign_up() {
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, pwd).then(function (user) {
        if (user != null) {
            uid = user.user.uid;
        }
        firebase.database().ref('users/' + uid).set({
            username: username,
            email: email,
            no_of_trips: 0,
            saved_trips: ""
        });

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                document.getElementById("message").innerHTML = `
                    <div class="alert alert-success" role="alert">
                        You have successfully created an account!
                        <br>
                        <a href='index.html'>Return to home page</a>
                    </div>
                `;
            }
        }).catch(function (error) {
            //Contains all Authentication Error Code
            switch (error.code) {
            case "auth/email-already-in-use":
                document.getElementById("message").innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        There already exists an account with the given email address.
                    </div>
                `;
                break;
            case "auth/invalid-email":
                document.getElementById("message").innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        The email you have entered is not valid.
                    </div>
                `;
                break;
            case "auth/weak-password":
                document.getElementById("message").innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        The password is too weak.
                    </div>
                `;
                break;
            }
        });;
    });
}

// Check if users are signed in
function check_for_authentication() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                var username = snapshot.val().username;
                var no_of_trips = snapshot.val().no_of_trips;
                document.getElementById("user").innerHTML = `
                    <div class="dropdown-toggle" style="float: right;font-size: 0.5em;" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-user-circle mt-1 mr-1"></i> ${username}
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" onClick="location.href='./profile.html'"><i class="fa fa-user"></i>    My Profile</a>
                            <a class="dropdown-item" onclick="sign_out()"><i class="fa fa-sign-out"></i>    Sign out</a>
                        </div>
                    </div>
                `;

                if (no_of_trips == 0) {
                    var att = document.createAttribute("disabled"); // Create a "class" attribute
                    document.getElementById("saved_trips_btn").setAttributeNode(att)
                } else {
                    document.getElementById("saved_trips_btn").removeAttribute("disabled");
                }
            });
        } else {
            document.getElementById("user").innerHTML = `
                <div style="float: right;font-size: 0.5em;">
                    <i class="fas fa-user-circle mt-1 mr-1"></i> <a style="color:white;" href="login.html">Login</a>
                </div>
            `;
            var att = document.createAttribute("disabled"); // Create a "class" attribute
            document.getElementById("saved_trips_btn").setAttributeNode(att)
        }
    });
}