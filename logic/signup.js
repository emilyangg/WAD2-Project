function sign_up() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var pwd = document.getElementById('password').value;

    firebase.auth().createUserWithEmailAndPassword(email, pwd).then(function (user) {
        if (user != null) {
            uid = user.user.uid;
        }
        firebase.database().ref('users/' + uid).set({
            username: name,
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
        });
    });
}

function check_for_authentication() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            console.log(userId);
            firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
                var username = snapshot.val().username;
                document.getElementById("user").innerHTML = `
                    <div class="dropdown-toggle" style="float: right;font-size: 0.5em;" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-user-circle mt-1 mr-1"></i> ${username}
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item" onclick="sign_out()">Sign out</a>
                        </div>
                    </div>
                `;
            });
        } else {
            document.getElementById("user").innerHTML = `
                <div style="float: right;font-size: 0.5em;">
                    <i class="fas fa-user-circle mt-1 mr-1"></i> <a style="color:white;" href="login.html">Login</a>
                </div>
            `;
        }
    });
}

function sign_out() {
    firebase.auth().signOut().then(function () {
        alert("You have successfully signed out!");
    }).catch(function (error) {});
}