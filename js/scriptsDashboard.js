/*!
* Start Bootstrap - Simple Sidebar v6.0.3 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 

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

function logout(){
    firebase.auth().signOut();
    window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            adminCheck();
        } else {
          // User is signed out
          // ...
          window.location.href = "../index.html";
        }
    });
});

function adminCheck() {
    var user = auth.currentUser;
    console.log(auth.currentUser.uid)
    const databaseRef = firebase.database().ref();
    databaseRef.child("users").child(user.uid).child("admin_perms").get()
    .then((snapshot) => {
        if (snapshot.exists()) {
            if(snapshot.val() == true) {
                document.getElementById("adminTest").style.display = "inline-block";
                document.getElementById("residentTest").style.display = "none";
            } else {
                document.getElementById("adminTest").style.display = "none";
                document.getElementById("residentTest").style.display = "inline-block";
            }

        } else {
            console.log("No data available");
        }

    })
    .catch((error) => {
        console.error(error);
    });

}
           