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

auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
  
        document.getElementById("test").style.display = "none";
  
        var user = firebase.auth().currentUser;
  
        if(user != null){
  
            var email_id = user.email;
            document.getElementById("user_para").innerHTML = "Welcome User : " + email_id;
  
        }
  
    } else {
        // No user is signed in.
  
        document.getElementById("user_div").style.display = "none";
        document.getElementById("login_div").style.display = "block";
  
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

              
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password is Incorrectly Formatted')
        return
        // Don't continue running the code
    }
    if (validate_field(full_name) == false || validate_field(phone) == false || validate_field(age) == false) {
        alert('One or More Extra Fields is Incorrectly Formatted!!')
        return
    }
               
    // Declare user variable
    var user = auth.currentUser
        
    // Add this user to Firebase Database
    var database_ref = database.ref()
              
    // Create User data
    var user_data = {
        email : email,
        full_name : full_name,
        phone : phone,
        age : age,
        last_login : Date.now(),
        admin_perms : false
    }
              
    // Push to Firebase Database
    database_ref.child('users/' + user.uid).set(user_data)
              
    // Done
    alert('User Created!!')
    window.location.href = "dashboardPage.html"    
}
              
// Set up our login function
function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
              
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
        alert('Email or Password is Outta Line!!')
        return
        // Don't continue running the code
    }
              
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
        // Declare user variable
        var user = auth.currentUser
              
              
        // Done
        alert('User Logged In!!')
        dbRef.child("users").child(user.uid).get().then((snapshot) => {
            if (snapshot.exists()) {
                // Add this user to Firebase Database
                var database_ref = database.ref()
              
                // Create User data
                var user_data = {
                last_login : Date.now()
                }
              
                // Push to Firebase Database
                database_ref.child('users/' + user.uid).update(user_data)
                window.location.href = "html/dashboardPage.html"
            } else {
                console.log("No data available");
                window.location.href = "html/registerPage.html"
            }
          }).catch((error) => {
                console.error(error);
          });
              
    })
    .catch(function(error) {
        // Firebase will use this to alert of its errors
        var error_code = error.code
        var error_message = error.message
        
        alert(error_message)
    })
}

function logout(){
    firebase.auth().signOut();
    window.location.href = "../index.html";
  }
              
              
              
              
// Validate Functions
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
        // Email is good
        return true
    } else {
        // Email is not good
        return false
    }
}
              
function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
        return false
    } else {
        return true
    }
}
              
function validate_field(field) {
    if (field == null) {
        return false
    }
              
    if (field.length <= 0) {
        return false
    } else {
        return true
    }
}