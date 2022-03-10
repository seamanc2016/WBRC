/*!
* Start Bootstrap - Agency v7.0.10 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/
//
// Scripts
// 


window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

function mastheadSwitch() {
    document.getElementById("baseMasthead").style.display = "none";
    document.getElementById("loginMasthead").style.display = "block";
}





//Sends the user back to their account setup if they haven't finished it yet, else, they go to the dashboard.
//You don't need to call the Firebase stuff again because it's already in memory. You can even use variables from the other files too!
//Why? Because this script comes after the Firebase stuff in index.html! 
document.getElementById("dashboard-button").addEventListener("click", setupCompletionCheck);
function setupCompletionCheck() {
    auth.onAuthStateChanged((user) => {
        var uid = user.uid;
        const dbRefEntry = database.ref().child("users").child(uid);
        dbRefEntry.get().then((snapshot) => {
            if (snapshot.exists()) {
                
                if(snapshot.val().accountSetupDone == false)
                    window.location.href = "../html/accountSetup.html";
                else
                    window.location.href = "../html/dashboardPage.html";

            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    })
}