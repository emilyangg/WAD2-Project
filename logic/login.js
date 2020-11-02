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