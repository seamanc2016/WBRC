//initialize Firebase SDK and API credentials
var firebaseConfig = {
    apiKey: "AIzaSyDLmZz2jMiSqzt_cqsCafsakgucfeaHbx8",
    authDomain: "colchal-web.firebaseapp.com",
    databaseURL: "https://colchal-web-default-rtdb.firebaseio.com",
    projectId: "colchal-web",
    storageBucket: "colchal-web.appspot.com",
    messagingSenderId: "298376904957",
    appId: "1:298376904957:web:e0902c3d9effbeb7fd3e94",
    measurementId: "G-5M31TBLFHM"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth();
const database = firebase.database();
const dbRef = firebase.database().ref();

//function to setup auth parameters and functions upon page load
auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        dbRef.child("users").child(user.uid).get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                //if the user has a database entry
                document.getElementById("baseMasthead").style.display = "none";
                document.getElementById("loginMasthead").style.display = "none";
                document.getElementById("placeholderMasthead").style.display = "block";
                document.getElementById("placeholderRegister").style.display = "none";

            } else {
                //if the user does not have a database
                console.log("No data available");
                document.getElementById("baseMasthead").style.display = "none";
                document.getElementById("loginMasthead").style.display = "none";
                document.getElementById("placeholderMasthead").style.display = "none";
                document.getElementById("placeholderRegister").style.display = "block";
            }
          }).catch((error) => {
                console.error(error);
          });
        //Hides the login and welcome text divs and only shows the dashboard button div
        document.getElementById("baseMasthead").style.display = "none";
        document.getElementById("loginMasthead").style.display = "none";
        document.getElementById("placeholderMasthead").style.display = "block";
  
        //sets up firebase auth
        var user = firebase.auth().currentUser;
  
    } else {
        // No user is signed in.
        
        //shows only the welcome text div
        document.getElementById("baseMasthead").style.display = "block";
        document.getElementById("placeholderMasthead").style.display = "none";
        document.getElementById("loginMasthead").style.display = "none";

  
    }
});      

// Set up our login function
function login () {
    // Get all our input fields
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
              
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password is Outta Line!!');
        return;
        // Don't continue running the code
    }
    
    //Standard firebase auth sign in with email and password function
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
        // Declare user variable
        var user = auth.currentUser;
              
              
        // Done
        alert('User Logged In!!')
        //function to check if the user signing in has a database (e.i has completed registration process)
        dbRef.child("users").child(user.uid).get()
        .then((snapshot) => {
            if (snapshot.exists()) {
                //if the user has a database entry

                // Add this user to Firebase Database
                var database_ref = database.ref();
              
                // create user last login timestamp
                var user_data = {
                last_login : Date.now()
                }
              
                // Push to Firebase Database and route to the dashboard
                database_ref.child('users/' + user.uid).update(user_data);
                window.location.href = "html/dashboardPage.html";
            } else {
                //if the user does not have a database
                console.log("No data available");
                //routes to the register page
                window.location.href = "html/registerPage.html";
            }
          }).catch((error) => {
                console.error(error);
          });
              
    })
    .catch(function(error) {
        // Firebase will use this to alert of its errors
        var error_code = error.code;
        var error_message = error.message;
        
        alert(error_message);
    })
}

//custom function to check if a user is signed in
function loginCheck(url) {
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in

            //routes to url provided in the html function call
            window.location.href = url;
      
        } else {
            // No user is signed in.
            
            // resets page divs
            document.getElementById("baseMasthead").style.display = "block";
            document.getElementById("placeholderMasthead").style.display = "none";
            document.getElementById("loginMasthead").style.display = "none";
            alert("Must be signed in");
    
      
        }
    });
}
              
              
// Validate Functions
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true) {
        // Email is good
        return true;
    } else {
        // Email is not good
        return false;
    }
}
              
function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
        return false;
    } else {
        return true;
    }
}
              
function validate_field(field) {
    if (field == null) {
        return false;
    }
              
    if (field.length <= 0) {
        return false;
    } else {
        return true;
    }
}


//logout function for logout buttons.
function logout() {
    firebase.auth().signOut().then(function() {
  // Sign-out successful.
}, function(error) {
  // An error happened.
});
}