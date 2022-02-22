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
        var user = firebase.auth().currentUser;
  
    } else {
        // No user is signed in.
        window.location.href = "../index.html";
    }
});      

// Set up our register function
function register () {
    // Get all our input fields
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    full_name = document.getElementById('full_name').value;
    phone = document.getElementById('phone').value;
    age = document.getElementById('age').value;
    admin_key_field = document.getElementById("admin_key").value;

              
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password is Incorrectly Formatted');
        return;
        // Don't continue running the code
    }
    if (validate_field(full_name) == false || validate_field(phone) == false || validate_field(age) == false) {
        alert('One or More Extra Fields is Incorrectly Formatted!!');
        return;
    }

    //Admin permissions
    adminKeyCheck(admin_key_field);

    // Declare user variable
    var user = auth.currentUser;
    
    // Add this user to Firebase Database
    var database_ref = database.ref();
    
    // Create User data
    var user_data = {
        email : email,
        full_name : full_name,
        phone : phone,
        age : age,
        last_login : Date.now(),
    }
              
    // Push to user_data to update the Firebase Realtimne Database
    database_ref.child('users/' + user.uid).update(user_data);
              
    // Done
    alert('User Created!!');
    window.location.href = "dashboardPage.html";
}

//Function to hide/show the admin key input field depending on thew status of the admin checkbox
function adminToggle(checkbox) {
    var adminKey = document.getElementById("admin_key");
    adminKey.style.display = checkbox.checked ? "inline-block" : "none";
}

function adminKeyCheck(adminKeyActual) {
    checkbox = document.getElementById('admin_toggle');
    if (checkbox.checked == true) {
        //if admin checkbox is checked

        //Initializing user and databse connection
        var user = auth.currentUser;
        const databaseRef = firebase.database().ref();
        //getting the stored admin key then performing subsequent tasks
        databaseRef.child("adminkeys").child("key1").get()
        .then((snapshot) => {
            var bool;
            if (snapshot.exists()) {
                //if there is a admin key available
                if (String(snapshot.val()) == adminKeyActual){
                    //if the user inputted admin key matches the admin key stored in the database
                    bool = true;
                    var user_data = {
                        admin_perms : bool
                    }
                    //updates user database snapshot with the admin permission true
                    databaseRef.child('users/' + user.uid).update(user_data);
                } else {
                    //if the user inputted admin key doesn't match the admin key stored in the database
                    console.log("Incorrect admin key");
                    bool = false;
                    var user_data = {
                        admin_perms : bool
                    }
                    //updates user database snapshot with the admin permission false
                    databaseRef.child('users/' + user.uid).set(user_data);
                }
            } else {
                //if there is no admin key (which there always should be)
                console.log("No data available");
            }
        }).catch((error) => {
            //if the site can't reach the database
            console.error(error);
        });
    } else {
        //if admin checkbox is not checked
        return false;
    }
    
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