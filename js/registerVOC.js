//Bootstrap script for the sidebar
/*
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
*/

//Mandatory Firebase Stuff
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
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
firebase.initializeApp(firebaseConfig); //getting access to the app using the key
// Initialize variables
const auth = firebase.auth(); //Reference to auth stuff
const database = firebase.database(); //reference to the realtime database

//Boots user off page if they're not signed in
auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.

    } else {
        // No user is signed in.
        window.location.href = "../index.html";
    }
});


//Firebase standard logout function modified to route to the home/loginpage
function logout() {
    firebase.auth().signOut();
    window.location.href = "../index.html";
}


//*********************************************************************************************************
//                                    VISITOR REGISTRATION FUNCTIONS
//*********************************************************************************************************

//Visual Stuff
document.getElementById("visitor-link").addEventListener("click", switchInnerPage);
document.getElementById("club-comm-link").addEventListener("click", switchInnerPage);
document.getElementById("orientation-link").addEventListener("click", switchInnerPage);

function switchInnerPage() {

    //Deselect the current nav link
    var currentSelectedNavLink = document.getElementsByClassName("inner-nav-item-selected");
    currentSelectedNavLink[0].classList.remove("inner-nav-item-selected");

    //Show the requested inner page
    //In ~this~ case, this represents the nav link element that called switchInnerPage() . Will help decide which inner page to show.
    var visitorRegistrationSection = document.getElementById("visitor-registration-section");
    var clubCommRegistrationSection = document.getElementById("club-comm-registration-section");
    var orientationRegistrationSection = document.getElementById("orientation-registration-section");
    var innerPageHeading = document.getElementById("inner-page-heading");

    switch (this.id) {
        case "visitor-link":
            visitorRegistrationSection.style.display = "inline";
            clubCommRegistrationSection.style.display = "none";
            orientationRegistrationSection.style.display = "none";
            innerPageHeading.innerHTML = "VISITOR REGISTRATION";
            break;
        case "club-comm-link":
            visitorRegistrationSection.style.display = "none";
            clubCommRegistrationSection.style.display = "inline";
            orientationRegistrationSection.style.display = "none";
            innerPageHeading.innerHTML = "CLUB/COMMITTEE REGISTRATION";
            break;
        case "orientation-link":
            visitorRegistrationSection.style.display = "none";
            clubCommRegistrationSection.style.display = "none";
            orientationRegistrationSection.style.display = "inline";
            innerPageHeading.innerHTML = "ORIENTATION REGISTRATION";
            break;
    }

    //Select the right nav item
    this.classList.add("inner-nav-item-selected");
}

//Potentially add a new visitor card

function addVisitorCard() {

    //Hide the add new visitor card button so that only one card can be added at a time. Saving the new card should re-enable it.
    document.querySelector("#add-visitor-button").setAttribute("hidden", true);

    //Hide other buttons
    var cardTemplate = document.querySelector(".card-template");
    cardTemplate.querySelector(".delete-visitor-card-button").style.display = "none";
    cardTemplate.querySelector(".edit-visitor-card-button").style.display = "none";
    cardTemplate.querySelector(".save-visitor-card-button").style.display = "inline";

    //Get hidden template and remove the hidden attribute but keep its header hidden
    cardTemplate.removeAttribute("hidden");
    cardTemplate.classList.remove("saved-visitor-card");
    cardTemplate.querySelector(".visitor-card-heading").setAttribute("hidden", true);

    //Enable fields
    var allFieldsInCardToBeEdited = cardTemplate.querySelectorAll(".visitor-card-info");
    for (let i = 0; i < allFieldsInCardToBeEdited.length; i++)
        allFieldsInCardToBeEdited[i].disabled = false;

    //Add the HTML of the copy to the page in the new card area.
    var newCardArea = document.querySelector("#new-card-area");
    newCardArea.insertAdjacentHTML("beforeend", cardTemplate.outerHTML);

    //Rehide the template
    cardTemplate.setAttribute("hidden", true);

}



function createVisitorCardFromData(position, fname, lname, dateIn, dateOut, purpose) {
    //Get copy of card template
    var cardTemplate = document.querySelector(".card-template");
    var cardHeader = cardTemplate.querySelector(".visitor-card-heading");

    //Make appropriate edits
    cardTemplate.removeAttribute("hidden");
    //cardHeader.setAttribute("hidden",true);
    cardHeader.innerHTML += position;

    //Add a copy of the edited card template to the page
    var newCardArea = document.querySelector("#new-card-area");
    cardTemplate.classList.add("last-added");
    newCardArea.insertAdjacentHTML("beforeend", cardTemplate.outerHTML);

    //Get last card in new card area and the values to it
    var newCard = newCardArea.querySelector(".last-added");
    var newCardInputFields = newCard.querySelectorAll(".visitor-card-info");
    newCardInputFields[0].value = fname;
    newCardInputFields[1].value = lname;
    newCardInputFields[2].value = dateIn;
    newCardInputFields[3].value = dateOut;
    newCardInputFields[4].value = purpose;
    newCard.classList.remove("last-added");


    //Clear the card template of the information so that new cards won't share the info and rehide it
    var cardTemplateInputFields = cardTemplate.querySelectorAll(".visitor-card-info");
    for (let i = 0; i < cardTemplateInputFields.length; i++)
        cardTemplateInputFields[i].value = "";

    cardTemplate.setAttribute("hidden", true);
    cardHeader.innerHTML = "VISITOR # ";

}

//Creating visitor card saved data from database
(function loadSavedVisitors() {
    //Get Data from database on all saved visitors
    auth.onAuthStateChanged(function (user) {
        if (user) {
            var uid = user.uid;
            var position = 1;
            database.ref("visitors/" + uid).once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    var fname = childSnapshot.val().firstName;
                    var lname = childSnapshot.val().lastName;
                    var dateIn = childSnapshot.val().dateIn;
                    var dateOut = childSnapshot.val().dateOut;
                    var purpose = childSnapshot.val().purpose;

                    createVisitorCardFromData(position, fname, lname, dateIn, dateOut, purpose);
                    position++;
                });
            });

        } else {
            // No user is signed in.
            window.location.href = "../index.html";
        }
    });

}());

//Save a new visitor card
function saveVisitorCard(callingElement) {

    var callingElementCard = callingElement.parentElement.parentElement;
    var allVisitorCards = document.querySelectorAll(".visitor-card");
    var cardToBeSaved = allVisitorCards[allVisitorCards.length - 1];
    var allFieldsInCardToBeSaved = cardToBeSaved.querySelectorAll(".visitor-card-info");

    //Validate fields. If something is wrong, return. Else move on.
    //Possible errors: one field empty, date-in or date-out is a past date, date-out occurs before (less than) date-in

    //Checking for empty field
    for (let i = 0; i < allFieldsInCardToBeSaved.length; i++)
        if (allFieldsInCardToBeSaved[i].value == "") {
            alert("Please fill all the required fields!");
            return;
        }

    //Checking for Proper Dates
    var date_regex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    var dateIn = new Date();
    var dateOut = new Date();
    var daysAfter = new Date();

    dateIn.setYear(allFieldsInCardToBeSaved[2].value.substring(0, 4));
    dateIn.setMonth(parseInt(allFieldsInCardToBeSaved[2].value.substring(5, 7)) - 1);
    dateIn.setDate(allFieldsInCardToBeSaved[2].value.substring(8, 10));

    dateOut.setYear(allFieldsInCardToBeSaved[3].value.substring(0, 4));
    dateOut.setMonth(parseInt(allFieldsInCardToBeSaved[3].value.substring(5, 7)) - 1);
    dateOut.setDate(allFieldsInCardToBeSaved[3].value.substring(8, 10));

    daysAfter.setDate(dateIn.getDate() + 10); //The number added is the span of days allowed between date in and out to be considered a visitor

    if (date_regex.test(allFieldsInCardToBeSaved[2].value) == false || date_regex.test(allFieldsInCardToBeSaved[3].value) == false)
        return alert("Invalid date entered in a field. Please adjust and try again.");
    if (dateIn > dateOut)
        return alert("Ilogical timeframe entered. Please adjust dates and try again.");
    if (daysAfter > dateOut)
        return alert("Only non-residents who have remained in your home for 10 days or more should be registered.");


    //var dateInWithSlashes = dateIn.toLocaleDateString("en-US"); //changing the yyyy-mm-dd format to mm/dd/yyyy
    //var dateOutWithSlashes = dateOut.toLocaleDateString("en-US");


    //Update/Save information to the DB accordingly
    switch (callingElementCard.classList.contains("saved-visitor-card")) {
        case true:
            auth.onAuthStateChanged((user) => {
                var uid = user.uid;
                //Get the original information of callingElementCard in local storage
                var originalCardInfo = sessionStorage.getItem('originalInfoBeforeEdit');

                //Query DB to find the card and update it with the new information
                var callingElementCardInputFields = callingElementCard.querySelectorAll(".visitor-card-info");
                database.ref("visitors/" + uid).once('value', (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        var child = {
                            firstName: childSnapshot.val().firstName,
                            lastName: childSnapshot.val().lastName,
                            dateIn: childSnapshot.val().dateIn,
                            dateOut: childSnapshot.val().dateOut,
                            purpose: childSnapshot.val().purpose
                        }
                        var childKey = childSnapshot.key;
                        if (JSON.stringify(child) === originalCardInfo) {
                            database.ref("visitors/" + uid + "/" + childKey).update({
                                firstName: callingElementCardInputFields[0].value,
                                lastName: callingElementCardInputFields[1].value,
                                dateIn: callingElementCardInputFields[2].value,
                                dateOut: callingElementCardInputFields[3].value,
                                purpose: callingElementCardInputFields[4].value
                            });

                            //Disable fields and hide buttons accordingly
                            for (let i = 0; i < callingElementCardInputFields.length; i++)
                                callingElementCardInputFields[i].disabled = true;

                            callingElementCard.querySelector(".delete-visitor-card-button").style.display = "inline";
                            callingElementCard.querySelector(".edit-visitor-card-button").style.display = "inline";
                            callingElementCard.querySelector(".save-visitor-card-button").style.display = "none";
                        }

                    });
                });
            })
            break;

        case false:
            //Send new card info to database
            auth.onAuthStateChanged((user) => {
                var uid = user.uid;
                database.ref("visitors/" + uid).push({
                    firstName: allFieldsInCardToBeSaved[0].value,
                    lastName: allFieldsInCardToBeSaved[1].value,
                    dateIn: allFieldsInCardToBeSaved[2].value,
                    dateOut: allFieldsInCardToBeSaved[3].value,
                    purpose: allFieldsInCardToBeSaved[4].value
                });
            })

            //Readd "add new+" button
            document.querySelector("#add-visitor-button").removeAttribute("hidden");

            //Get the last visitor card on the page and add the "saved" class to it. Also unhide its header and add the appropriate info.
            cardToBeSaved.classList.add("saved-visitor-card");
            cardToBeSaved.querySelector(".visitor-card-heading").innerHTML = "VISITOR #" + (allVisitorCards.length - 1); //Minus 1 to account for the template
            cardToBeSaved.querySelector(".visitor-card-heading").removeAttribute("hidden");

            //Disable input fields and unhide/hide buttons accordingly
            for (let i = 0; i < allFieldsInCardToBeSaved.length; i++)
                allFieldsInCardToBeSaved[i].disabled = true;

            cardToBeSaved.querySelector(".delete-visitor-card-button").style.display = "inline";
            cardToBeSaved.querySelector(".edit-visitor-card-button").style.display = "inline";
            cardToBeSaved.querySelector(".save-visitor-card-button").style.display = "none";
            break;
    }

}

//Enable editing of a visitor card
function editVisitorCard(callingElement) {

    //Return if a new element is currently being created
    if(document.querySelector("#add-visitor-button").hasAttribute("hidden"))
        return alert("You can only edit one visitor card at a time. Please finish doing so and try again.");

    var cardToEdit = callingElement.parentElement.parentElement;
    var cardToEditInputFields = cardToEdit.querySelectorAll(".visitor-card-info");

    //Make an object copy of visitor card info and send to session storage
    var originalInfoBeforeEdit = {
        firstName: cardToEditInputFields[0].value,
        lastName: cardToEditInputFields[1].value,
        dateIn: cardToEditInputFields[2].value,
        dateOut: cardToEditInputFields[3].value,
        purpose: cardToEditInputFields[4].value
    }

    sessionStorage.setItem('originalInfoBeforeEdit', JSON.stringify(originalInfoBeforeEdit));

    //Enable fields to allow for editing and hide buttons accordingly
    var allFieldsInCardToBeEdited = cardToEdit.querySelectorAll(".visitor-card-info");
    for (let i = 0; i < allFieldsInCardToBeEdited.length; i++)
        allFieldsInCardToBeEdited[i].disabled = false;

    cardToEdit.querySelector(".delete-visitor-card-button").style.display = "none";
    cardToEdit.querySelector(".edit-visitor-card-button").style.display = "none";
    cardToEdit.querySelector(".save-visitor-card-button").style.display = "inline";
}


//Delete a visitor card
function deleteVisitorCard(element) {
    //Show visuals for deleting on frontend
    var callingElementCard = element.parentElement.parentElement;
    callingElementCard.remove();

    //Renumber existing visitor cards
    var newCardArea = document.querySelector("#new-card-area");
    var remainingVisitorCards = newCardArea.querySelectorAll(".visitor-card");

    for (let i = 0; i < remainingVisitorCards.length; i++) {
        remainingVisitorCards[i].querySelector(".visitor-card-heading").innerHTML = "VISITOR # " + (i + 1);

    }

    //delete info from database
    auth.onAuthStateChanged((user) => {
        var uid = user.uid;
        //Get info from calling element card
        var callingElementCardInputFields = callingElementCard.querySelectorAll(".visitor-card-info");
        var deleteThisCard = {
            firstName: callingElementCardInputFields[0].value,
            lastName: callingElementCardInputFields[1].value,
            dateIn: callingElementCardInputFields[2].value,
            dateOut: callingElementCardInputFields[3].value,
            purpose: callingElementCardInputFields[4].value
        }

        //Query DB to find the card and delete it
        database.ref("visitors/" + uid).once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                var child = {
                    firstName: childSnapshot.val().firstName,
                    lastName: childSnapshot.val().lastName,
                    dateIn: childSnapshot.val().dateIn,
                    dateOut: childSnapshot.val().dateOut,
                    purpose: childSnapshot.val().purpose
                }
                var childKey = childSnapshot.key;
                if (JSON.stringify(child) === JSON.stringify(deleteThisCard))
                    database.ref("visitors/" + uid + "/" + childKey).remove();
                return;
            });
        });

    })

}







//*********************************************************************************************************
//                                    CLUB AND COMMS REGISTRATION FUNCTIONS
//*********************************************************************************************************
(function loadClubsandComms(){
    auth.onAuthStateChanged(function (user) {
        if (user) {
            var uid = user.uid;
            //Get first 10 clubs from database and send them to session storage
            var cellCount = 0;
            var allEmptyCells = document.querySelectorAll(".empty-cell");
            database.ref("clubs").once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                 //Make search result from template
                 var copyOfTemplate = document.querySelector(".search-result-template");
                 copyOfTemplate.removeAttribute("hidden");
                 allEmptyCells[cellCount].classList.add("filled-cell");
                 allEmptyCells[cellCount].classList.remove("empty-cell");
                 allEmptyCells[cellCount].innerHTML = "";

                 copyOfTemplate.innerHTML = childSnapshot.val().name;
 
                 //Place in appropriate entry
                 allEmptyCells[cellCount].insertAdjacentHTML("afterbegin", copyOfTemplate.outerHTML);
                 
                 //Increment cellcount
                 cellCount++;
                
                 copyOfTemplate.setAttribute("hidden", true);
                });
            });

            document.querySelector("#showing-results").innerHTML = `Showing 1 - 10 of ${cellCount} entries`;
    
        } else {
            // No user is signed in.
            window.location.href = "../index.html";
        }
    });
    
}());