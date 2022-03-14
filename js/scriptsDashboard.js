/*!
* Start Bootstrap - Simple Sidebar v6.0.3 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 

//Bootstrap script for the sidebar
window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

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

//Firebase standard logout function modified to route to the home/loginpage
function logout(){
    firebase.auth().signOut();
    window.location.href = "../index.html";
}

//function to setup auth parameters and functions upon page load
window.addEventListener("DOMContentLoaded", function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            adminCheck();
            dbRef.child("users").child(user.uid).get()
            .then((snapshot) => {
                if (snapshot.exists()) {
                    //Nothing This is error handling
                } else {
                    //if the user does not have a database
                    console.log("No data available");
                    //routes to the register page
                    window.location.href = "../index.html";
                }
              }).catch((error) => {
                    console.error(error);
              });
        } else {
          // User is signed out
          // ...
          window.location.href = "../index.html";
        }
    });
});



//function custom to the dashboard (for now) that shows how revealing and hiding admin features can work
function adminCheck() {
    //initialize user auth
    var user = auth.currentUser;
    //connectiong to database
    const databaseRef = firebase.database().ref();
    //function to get the admin_perms value from a certain user(identified by uid)
    databaseRef.child("users").child(user.uid).child("admin_perms").get()
    .then((snapshot) => {
        if (snapshot.exists()) {
            if(snapshot.val() == true) {
                //If the user does have admin perms it shows the admin div and hides the resident div
                document.getElementById("adminDB").style.display = "grid";
                              
            } else {
                //If the user does not have admin perms it hides the admin div and shows the resident div
                document.getElementById("adminDB").style.display = "none";
 
            }

        } else {
            console.log("No data available");
        }

    })
    .catch((error) => {
        console.error(error);
    });

}
           