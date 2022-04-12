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
//document.getElementById("orientation-link").addEventListener("click", switchInnerPage);

function switchInnerPage() {

    //Deselect the current nav link
    var currentSelectedNavLink = document.getElementsByClassName("inner-nav-item-selected");
    currentSelectedNavLink[0].classList.remove("inner-nav-item-selected");

    //Show the requested inner page
    //In ~this~ case, this represents the nav link element that called switchInnerPage() . Will help decide which inner page to show.
    var visitorRegistrationSection = document.getElementById("visitor-registration-section");
    var clubCommRegistrationSection = document.getElementById("club-comm-registration-section");
    //var orientationRegistrationSection = document.getElementById("orientation-registration-section");
    var innerPageHeading = document.getElementById("inner-page-heading");

    switch (this.id) {
        case "visitor-link":
            visitorRegistrationSection.style.display = "inline";
            clubCommRegistrationSection.style.display = "none";
            //orientationRegistrationSection.style.display = "none";
            innerPageHeading.innerHTML = "VISITOR REGISTRATION";
            break;
        case "club-comm-link":
            visitorRegistrationSection.style.display = "none";
            clubCommRegistrationSection.style.display = "inline";
            //orientationRegistrationSection.style.display = "none";
            innerPageHeading.innerHTML = "CLUB REGISTRATION";
            break;
        // case "orientation-link":
        //     visitorRegistrationSection.style.display = "none";
        //     clubCommRegistrationSection.style.display = "none";
        //     orientationRegistrationSection.style.display = "inline";
        //     innerPageHeading.innerHTML = "ORIENTATION REGISTRATION";
        //     break;
    }

    //Select the right nav item
    this.classList.add("inner-nav-item-selected");
}

//Slight delay to load stuff in
// document.querySelector("#visitor-registration-section").setAttribute("hidden",true);
// setTimeout(()=>{
//   document.querySelector("#visitor-registration-section").removeAttribute("hidden");
// }, 400);

//Potentially add a new visitor card

function addVisitorCard() {
    //Return if an existing card is being edited
    var currentlyEditing = parseInt(sessionStorage.getItem("currentlyEditing"));
    if (currentlyEditing == 1)
        return alert("You can only edit one visitor card at a time. Please finish doing so and try again.");

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

                            //Reset currently editing count
                            sessionStorage.setItem("currentlyEditing", 0);
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

                //Reset currently editing count
                sessionStorage.setItem("currentlyEditing", 0);
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

    //Return if a new card is currently being created or an existing card is being edited
    var currentlyEditing = parseInt(sessionStorage.getItem("currentlyEditing"));
    if (document.querySelector("#add-visitor-button").hasAttribute("hidden") || currentlyEditing == 1)
        return alert("You can only edit one visitor card at a time. Please finish doing so and try again.");


    //Set variable in SS to keep track of the number of existing cards being edited
    sessionStorage.setItem("currentlyEditing", 1);

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
function loadClubsandComms() {
    auth.onAuthStateChanged(function (user) {
        if (user) {
            var uid = user.uid;
            //Fill the all clubs results area with clubs!
            database.ref("clubs").once('value', (snapshot) => {

                //Clear the area where results are set so there aren't duplications
                var allResultsArea = document.querySelector("#all-results-area");
                allResultsArea.innerHTML = "";

                snapshot.forEach((childSnapshot) => {
                    //Get a copy of the search result template and make the appropriate adjustments to it. Keep it hidden at this point.
                    var copyOfTemplate = document.querySelector(".search-result-template");
                    copyOfTemplate.classList.add("table-cell");
                    copyOfTemplate.classList.remove("search-result-template");

                    //Get the snapshot's name and ID and put them in their appropriate positions in the copy.
                    copyOfTemplate.querySelector(".search-result-button").innerHTML = childSnapshot.val().name;
                    copyOfTemplate.querySelector(".search-result-button").id = childSnapshot.key;
                    copyOfTemplate.querySelector(".empty-cell").classList.add("filled-cell");
                    copyOfTemplate.querySelector(".filled-cell").classList.remove("empty-cell");

                    //Add the copy to the designated area on the page
                    allResultsArea.insertAdjacentHTML("beforeend", copyOfTemplate.outerHTML);

                    //Undo adjustments made to template so that fresh copies can be made
                    copyOfTemplate.classList.add("search-result-template");
                    copyOfTemplate.classList.remove("table-cell");
                    copyOfTemplate.querySelector(".filled-cell").classList.add("empty-cell");
                    copyOfTemplate.querySelector(".empty-cell").classList.remove("filled-cell");
                });

                //Show the first 10 results and set  indexOfLastVisibleResult to 9
                var allResults = document.querySelectorAll(".table-cell");
                for (let i = 0; i < allResults.length; i++) {
                    allResults[i].removeAttribute("hidden");
                    if (i + 1 == 10)
                        break;
                }

                //This is so that the result table looks complete even though there aren't many results to fill it
                if ((allResults.length % 10) != 0) {
                    for (let i = 0; i < 10 - (allResults.length % 10); i++) {
                        var allResultsArea = document.querySelector("#all-results-area");
                        var emptySearchResultField = document.querySelector(".blank-search-result-template");
                        emptySearchResultField.classList.add("table-cell");
                        emptySearchResultField.setAttribute("hidden", true);
                        allResultsArea.insertAdjacentHTML("beforeend", emptySearchResultField.outerHTML);
                        emptySearchResultField.classList.remove("table-cell");
                        emptySearchResultField.setAttribute("hidden", true);
                    }
                }

                if (allResults.length <= 10) {
                    //Disable previous and next buttons since they're unneeded
                    document.querySelector("#previous-button").setAttribute("disabled", true);
                    document.querySelector("#previous-button").classList.add("disabled-button");
                    document.querySelector("#next-button").setAttribute("disabled", true);
                    document.querySelector("#next-button").classList.add("disabled-button");

                    //Update showing results accordingly
                    document.querySelector("#showing-results").innerHTML = "Showing results 1 - " + allResults.length + " of " + allResults.length;

                    //Show all empty fields added
                    EmptyCellsAdded = allResultsArea.querySelectorAll(".intended-empty");
                    EmptyCellsAdded.forEach((hiddenCell) => {
                        hiddenCell.removeAttribute("hidden");
                    })
                }

                else {

                    //Disable previous but enable next button
                    document.querySelector("#previous-button").setAttribute("disabled", true);
                    document.querySelector("#previous-button").classList.add("disabled-button");
                    document.querySelector("#next-button").removeAttribute("disabled");
                    document.querySelector("#next-button").classList.remove("disabled-button");


                    //Update showing results accordingly
                    document.querySelector("#showing-results").innerHTML = "Showing results 1 - 10 of " + allResults.length;
                }

                //To account for the range [0,9] of results being shown, create a variable  indexOfLastVisibleResult in SS and set it to 9
                sessionStorage.setItem(" indexOfLastVisibleResult", 9);
            });

            //Fill Membership and ownership info for clubs
            updateMembershipsAndOwnerships();

        } else {
            // No user is signed in.
            window.location.href = "../index.html";
        }
    });

};

//Self-invoking to load club list on pageload
(function () {
    loadClubsandComms();
})();

function updateMembershipsAndOwnerships() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            database.ref("users/" + uid + "/clubs").once('value', (snapshot) => {
                var membershipTagArea = document.querySelector("#membership-tag-area");
                var ownershipTagArea = document.querySelector("#ownership-tag-area");
                if (snapshot.exists()) {
                    //Getting and prepping positions on memb/owner stats table
                    membershipTagArea.innerHTML = "";
                    ownershipTagArea.innerHTML = "";

                    snapshot.forEach((childSnapshot) => {
                        var childKey = childSnapshot.key;
                        var childData = childSnapshot.val();

                        //Make a button and add the appropriate attributes and modifications
                        var newButtonElement = document.createElement("button");
                        newButtonElement.classList.add("stat-club-tag");
                        newButtonElement.setAttribute("onclick", "viewClubInfo(this)");
                        newButtonElement.innerHTML = childData.name;
                        newButtonElement.id = childKey;

                        //Add it to the right location on the table
                        if (childData.role == "member")
                            membershipTagArea.insertAdjacentHTML("beforeend", newButtonElement.outerHTML);

                        else
                            ownershipTagArea.insertAdjacentHTML("beforeend", newButtonElement.outerHTML);
                    });
                }

                else{
                    membershipTagArea.innerHTML = "You are not registered in any clubs.";
                    ownershipTagArea.innerHTML = "You have not created any clubs.";
                }
            });
        } else {
            // No user is signed in.
            window.location.href = "../index.html";
        }
    });
}

function getNextResults() {
    //Enable the previous button. This is here to make it reappear when needed.
    document.querySelector("#previous-button").removeAttribute("disabled");
    document.querySelector("#previous-button").classList.remove("disabled-button");

    //Hide all currently visible results
    var allResults = document.querySelectorAll(".table-cell");
    var indexOfLastVisibleResult = parseInt(sessionStorage.getItem(" indexOfLastVisibleResult"));

    for (let i = indexOfLastVisibleResult - 9; i < indexOfLastVisibleResult + 1; i++)
        allResults[i].setAttribute("hidden", true);

    //Show the next 10 or less results
    var allTenFieldsFilled = true;
    for (let i = indexOfLastVisibleResult + 1; i < indexOfLastVisibleResult + 11; i++) {
        allResults[i].removeAttribute("hidden");
        if (i + 1 == allResults.length) {
            allTenFieldsFilled = false;
            break;
        }
    }

    //Updating showing results info
    document.querySelector("#showing-results").innerHTML = "Showing results " + (indexOfLastVisibleResult + 2) + " - " + (indexOfLastVisibleResult + 11) + " of " + document.querySelectorAll(".filled-cell").length;

    //If there were less than 10 results to show, fill the page with empty slots by unhiding them accordingly
    if (allTenFieldsFilled == false) {
        var allEmptyFields = document.querySelectorAll("table-cell");
        for (let i = 0; i < allEmptyFields.length; i++)
            allEmptyFields[i].removeAttribute("hidden");

        //Also, disable the next button
        document.querySelector("#next-button").setAttribute("disabled", true);
        document.querySelector("#next-button").classList.add("disabled-button");

        //Updating showing results info
        document.querySelector("#showing-results").innerHTML = "Showing results " + (indexOfLastVisibleResult + 2) + " - " + document.querySelectorAll(".filled-cell").length + " of " + document.querySelectorAll(".filled-cell").length;
    }

    //Increment result index by 10 and update SS
    indexOfLastVisibleResult += 10;
    sessionStorage.setItem(" indexOfLastVisibleResult", indexOfLastVisibleResult);

}

function getPrevResults() {
    //Enable the next button. This is here to make it reappear when needed.
    document.querySelector("#next-button").removeAttribute("disabled");
    document.querySelector("#next-button").classList.remove("disabled-button");

    //Hide all currently visible results, including the empty cells.
    var allResults = document.querySelectorAll(".table-cell");
    var indexOfLastVisibleResult = parseInt(sessionStorage.getItem(" indexOfLastVisibleResult"));

    for (let i = indexOfLastVisibleResult - 9; i < indexOfLastVisibleResult + 1; i++)
        allResults[i].setAttribute("hidden", true);

    //Show the previous 10 results
    for (let i = indexOfLastVisibleResult - 19; i < indexOfLastVisibleResult - 9; i++)
        allResults[i].removeAttribute("hidden");

    //Updating showing results info
    document.querySelector("#showing-results").innerHTML = "Showing results " + (indexOfLastVisibleResult - 18) + " - " + (indexOfLastVisibleResult - 9) + " of " + document.querySelectorAll(".filled-cell").length;
    //Decrement result index by 10 and update SS
    indexOfLastVisibleResult -= 10;
    sessionStorage.setItem(" indexOfLastVisibleResult", indexOfLastVisibleResult);

    //Enable previous button if the first 10 results (or less) are being shown
    if (indexOfLastVisibleResult <= 10) {
        document.querySelector("#previous-button").setAttribute("disabled", true);
        document.querySelector("#previous-button").classList.add("disabled-button");

    }

}

//Maybe have this check value of main activities and description in database
function findClub() {
    //Hide all visible clubs
    var allResults = document.querySelectorAll(".table-cell");
    var indexOfLastVisibleResult = parseInt(sessionStorage.getItem("indexOfLastVisibleResult"));
    for (let i = 0; i < allResults.length; i++)
        allResults[i].setAttribute("hidden", true);

    //Get the value from the search bar and compare it with the results to find matches and only show them
    var searchBarValue = document.querySelector("#search-bar-field").value.toUpperCase();

    for (let i = 0; i < allResults.length - 7; i++) {
        var resultValue = allResults[i].querySelector(".search-result-button").innerHTML.toUpperCase()
        if (resultValue.indexOf(searchBarValue) != -1) //indexOf returns -1 when it fails so if it passes, the resultValue contains the substring searchBarValue
            allResults[i].removeAttribute("hidden");
    }
}

function viewClubInfo(callingElement) {
    //Query the database to find the appropriate information of club and place that info into the template
    database.ref("clubs").once('value', (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            //Find the child that matches the button inner HTML
            if (childSnapshot.key == callingElement.id) {
                var child = childSnapshot.val();
                //Put its info into the club info template in the appropriate areas
                document.querySelector(".club-title").innerHTML = child.name;
                document.querySelector(".creator-name").innerHTML = child.creatorName;
                document.querySelector(".creator-email").innerHTML = child.creatorEmail;
                document.querySelector(".creator-phone").innerHTML = child.creatorPhone;

                var clubScheduleTextarea = document.querySelector(".club-schedule-textarea");
                clubScheduleTextarea.setAttribute("hidden", true);
                document.querySelector(".club-schedule").innerHTML = child.schedule;
                document.querySelector(".club-schedule").insertAdjacentHTML("beforeend", clubScheduleTextarea.outerHTML);

                var clubActivitiesTextarea = document.querySelector(".club-activities-textarea");
                clubActivitiesTextarea.setAttribute("hidden", true);
                document.querySelector(".club-activities").innerHTML = child.schedule;
                document.querySelector(".club-activities").insertAdjacentHTML("beforeend", clubActivitiesTextarea.outerHTML);

                document.querySelector(".club-member-count").innerHTML = child.memberCount;
                document.querySelector("#description").value = child.description; //Adjust size of the description field basedon what's in it

                return;
            }
        });


        //Determining the inital status of the action buttons when viewing club info
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                database.ref("users/" + uid + "/clubs").once('value', (snapshot) => {

                    if (snapshot.exists()) {

                        //Setting initial state of action buttons for clubs that user isn't a member/owner of
                        document.querySelector(".join-button").removeAttribute("hidden");
                        document.querySelector(".leave-button").setAttribute("hidden", true);
                        document.querySelector(".edit-club-button").setAttribute("hidden", true);
                        document.querySelector(".delete-club-button").setAttribute("hidden", true);
                        document.querySelector(".save-club-button").setAttribute("hidden", true);

                        snapshot.forEach((childSnapshot) => {
                            var childKey = childSnapshot.key;
                            var childData = childSnapshot.val();
                            if (childKey == callingElement.id) {
                                switch (childData.role) {
                                    case "member":
                                        document.querySelector(".edit-club-button").setAttribute("hidden", true);
                                        document.querySelector(".delete-club-button").setAttribute("hidden", true);
                                        document.querySelector(".join-button").setAttribute("hidden", true);
                                        document.querySelector(".leave-button").removeAttribute("hidden");
                                        document.querySelector(".save-club-button").setAttribute("hidden", true);
                                        break;
                                    case "owner":
                                        document.querySelector(".join-button").setAttribute("hidden", true);
                                        document.querySelector(".leave-button").setAttribute("hidden", true);
                                        document.querySelector(".edit-club-button").removeAttribute("hidden");
                                        document.querySelector(".delete-club-button").removeAttribute("hidden");
                                        document.querySelector(".save-club-button").setAttribute("hidden", true);
                                        break;
                                }
                            }
                        })
                    }

                })


            } else {
                // User is signed out
                window.location.href = "../index.html";
            }
        });

        //Set the action button IDs equal to the calling element's ID
        document.querySelector(".join-button").id = callingElement.id;
        document.querySelector(".leave-button").id = callingElement.id;
        document.querySelector(".edit-club-button").id = callingElement.id;
        document.querySelector(".delete-club-button").id = callingElement.id;

        //Hide default section and show club info template
        setTimeout(() => {
            document.querySelector(".default").setAttribute("hidden", true);
            document.querySelector(".club-info-template").removeAttribute("hidden");
        }, 100)

    });



}

function createNewClub() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            //Clear the areas that will be seen after this function runs
            var clubScheduleTextarea = document.querySelector(".club-schedule-textarea");
            document.querySelector(".club-schedule").innerHTML = "";
            document.querySelector(".club-schedule").insertAdjacentHTML("beforeend", clubScheduleTextarea.outerHTML);

            var clubActivitiesTextarea = document.querySelector(".club-activities-textarea");
            document.querySelector(".club-activities").innerHTML = "";
            document.querySelector(".club-activities").insertAdjacentHTML("beforeend", clubActivitiesTextarea.outerHTML);

            document.querySelector(".club-title-textarea").value = "";
            document.querySelector(".club-activities-textarea").value = "";
            document.querySelector(".club-schedule-textarea").value = "";
            document.querySelector(".club-description-textarea").value = "";


            //Get required info from DB
            database.ref("users/" + uid).get().then((snapshot) => {
                if (snapshot.exists()) {
                    var snapshotData = snapshot.val();
                    document.querySelector(".creator-name").innerHTML = snapshotData.firstName + " " + snapshotData.lastName;
                    document.querySelector(".creator-email").innerHTML = snapshotData.email;
                    document.querySelector(".creator-phone").innerHTML = snapshotData.phone;
                    document.querySelector(".club-member-count").innerHTML = 1;

                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });

            //Set save button ID to empty string
            document.querySelector(".save-club-button").id = "";

            //Prep visuals to show club creation section after 100 ms
            setTimeout(() => {
                //Hide/unhide action buttons as necessary
                document.querySelector(".join-button").setAttribute("hidden", true);
                document.querySelector(".leave-button").setAttribute("hidden", true);
                document.querySelector(".edit-club-button").setAttribute("hidden", true);
                document.querySelector(".delete-club-button").setAttribute("hidden", true);
                document.querySelector(".save-club-button").removeAttribute("hidden");

                //Hide/unhide club template elements as necessary
                document.querySelector(".show-saved-title-div").setAttribute("hidden", true);
                document.querySelector(".create-title-div").removeAttribute("hidden");
                document.querySelector(".club-title-textarea").removeAttribute("hidden");
                document.querySelector(".club-schedule-textarea").removeAttribute("hidden");
                document.querySelector(".club-activities-textarea").removeAttribute("hidden");

                //Hide default section, show create club template
                document.querySelector(".default").setAttribute("hidden", true);
                document.querySelector(".club-info-template").removeAttribute("hidden");

                //Enable fields
                document.querySelector(".club-title-textarea").removeAttribute("disabled");
                document.querySelector(".club-schedule-textarea").removeAttribute("disabled");
                document.querySelector(".club-activities-textarea").removeAttribute("disabled");
                document.querySelector(".club-description-textarea").removeAttribute("disabled");

            }, 100);

        } else {
            // User is signed out
            window.location.href = "../index.html";
        }
    });

}

function editClub(IDOfClubCurrentlyBeingViewed) {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            //Clearing areas as needed
            var clubScheduleTextarea = document.querySelector(".club-schedule-textarea");
            document.querySelector(".club-schedule").innerHTML = "";
            document.querySelector(".club-schedule").insertAdjacentHTML("beforeend", clubScheduleTextarea.outerHTML);

            var clubActivitiesTextarea = document.querySelector(".club-activities-textarea");
            document.querySelector(".club-activities").innerHTML = "";
            document.querySelector(".club-activities").insertAdjacentHTML("beforeend", clubActivitiesTextarea.outerHTML);

            //Transfer data from DB to textareas
            database.ref('clubs/' + IDOfClubCurrentlyBeingViewed).once('value').then((snapshot) => {
                var snapshotData = snapshot.val();
                document.querySelector(".club-title-textarea").value = snapshotData.name;
                document.querySelector(".club-schedule-textarea").value = snapshotData.schedule;
                document.querySelector(".club-activities-textarea").value = snapshotData.activities;
            }).then(() => {

                //Enable the textareas
                var allTextareas = document.querySelectorAll(".validate-this-textarea");
                for (let i = 0; i < allTextareas.length; i++)
                    allTextareas[i].removeAttribute("disabled");

                //Hide/unhide as necessary
                document.querySelector(".show-saved-title-div").setAttribute("hidden", true);
                document.querySelector(".create-title-div").removeAttribute("hidden");
                document.querySelector(".club-title-textarea").removeAttribute("hidden");
                document.querySelector(".club-schedule-textarea").removeAttribute("hidden");
                document.querySelector(".club-activities-textarea").removeAttribute("hidden");

                //Hide action buttons
                document.querySelector(".edit-club-button").setAttribute("hidden", true);
                document.querySelector(".delete-club-button").setAttribute("hidden", true);
                document.querySelector(".save-club-button").removeAttribute("hidden");

                //Pass ID to Save Button
                document.querySelector(".save-club-button").id = IDOfClubCurrentlyBeingViewed;
            })

            //Switch visuals accordingly
            // setTimeout(()=>{

            //     //Enable the textareas
            //     var allTextareas = document.querySelectorAll(".validate-this-textarea");
            //     for (let i = 0; i < allTextareas.length; i++) 
            //         allTextareas[i].removeAttribute("disabled");

            //     //Hide/unhide as necessary
            //     document.querySelector(".show-saved-title-div").setAttribute("hidden", true);
            //     document.querySelector(".create-title-div").removeAttribute("hidden");
            //     document.querySelector(".club-title-textarea").removeAttribute("hidden");
            //     document.querySelector(".club-schedule-textarea").removeAttribute("hidden");
            //     document.querySelector(".club-activities-textarea").removeAttribute("hidden");

            // }, 100);


        } else {
            // User is signed out
            window.location.href = "../index.html";
        }
    });

}

function saveClub(IDOfClubCurrentlyBeingViewed) {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            //The ID not being set (having "" as its value) implies that the saving is being done for a new club
            if (IDOfClubCurrentlyBeingViewed == "") {
                //Validate Fields
                var allTextareasRequiringValidation = document.querySelectorAll(".validate-this-textarea");
                for (let i = 0; i < allTextareasRequiringValidation.length; i++) {
                    if (allTextareasRequiringValidation[i].value == "")
                        return alert("Please fill in all fields before saving your club.");
                }

                //Get necessary values from each field and store them in DB in club section
                var newClubRef = database.ref("clubs").push();
                var newClubKey = newClubRef.key;
                database.ref("clubs/" + newClubKey).update({
                    name: document.querySelector(".club-title-textarea").value,
                    creatorName: document.querySelector(".creator-name").innerHTML,
                    creatorEmail: document.querySelector(".creator-email").innerHTML,
                    creatorPhone: document.querySelector(".creator-phone").innerHTML,
                    schedule: document.querySelector(".club-schedule-textarea").value,
                    activities: document.querySelector(".club-activities-textarea").value,
                    memberCount: document.querySelector(".club-member-count").innerHTML,
                    description: document.querySelector(".club-description-textarea").value

                })

                //Update user club ownership in their club section of DB
                database.ref("users/" + uid + "/clubs/" + newClubKey).update({
                    name: document.querySelector(".club-title-textarea").value,
                    role: "owner"
                })

            }

            //This will run when the ID is set (having something other than "" as its value), meaning that the saving is being done to an existing element
            else {
                database.ref("clubs/" + IDOfClubCurrentlyBeingViewed).update({
                    name: document.querySelector(".club-title-textarea").value,
                    creatorName: document.querySelector(".creator-name").innerHTML,
                    creatorEmail: document.querySelector(".creator-email").innerHTML,
                    creatorPhone: document.querySelector(".creator-phone").innerHTML,
                    schedule: document.querySelector(".club-schedule-textarea").value,
                    activities: document.querySelector(".club-activities-textarea").value,
                    memberCount: document.querySelector(".club-member-count").innerHTML,
                    description: document.querySelector(".club-description-textarea").value
                });

                //Update user club ownership in their club section of DB
                database.ref("users/" + uid + "/clubs/" + IDOfClubCurrentlyBeingViewed).update({
                    name: document.querySelector(".club-title-textarea").value,
                    role: "owner"
                })
            }


            //Update club list and ownership stats
            loadClubsandComms();
            updateMembershipsAndOwnerships();

            //Move Visuals back logically
            setTimeout(() => {
                //Hide/unhide action buttons as necessary
                document.querySelector(".join-button").setAttribute("hidden", true);
                document.querySelector(".leave-button").setAttribute("hidden", true);
                document.querySelector(".edit-club-button").removeAttribute("hidden");
                document.querySelector(".delete-club-button").removeAttribute("hidden");
                document.querySelector(".save-club-button").setAttribute("hidden", true);

                //Hide/unhide club template elements as necessary
                document.querySelector(".show-saved-title-div").removeAttribute("hidden");
                document.querySelector(".create-title-div").setAttribute("hidden", true);
                document.querySelector(".club-title-textarea").setAttribute("hidden", true);
                document.querySelector(".club-schedule-textarea").setAttribute("hidden", true);
                document.querySelector(".club-activities-textarea").setAttribute("hidden", true);

                //Show default section, hide create club template
                document.querySelector(".default").removeAttribute("hidden");
                document.querySelector(".club-info-template").setAttribute("hidden", true);

                //Disable fields
                document.querySelector(".club-title-textarea").setAttribute("disabled", true);
                document.querySelector(".club-schedule-textarea").setAttribute("disabled", true);
                document.querySelector(".club-activities-textarea").setAttribute("disabled", true);
                document.querySelector(".club-description-textarea").setAttribute("disabled", true);

            }, 100);

        } else {
            // User is signed out
            window.location.href = "../index.html";
        }
    });
}

function deleteClub(IDOfClubCurrentlyBeingViewed) {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            //Delete club from  public clublist
            database.ref("clubs/" + IDOfClubCurrentlyBeingViewed).remove();

            //Delete club from user clublist
            database.ref("users/" + uid + "/clubs/" + IDOfClubCurrentlyBeingViewed).remove();

            //Update club list and ownership stats
            loadClubsandComms();
            updateMembershipsAndOwnerships();

            //Move Visuals back logically
            setTimeout(() => {
                //Show default section, hide create club template
                document.querySelector(".default").removeAttribute("hidden");
                document.querySelector(".club-info-template").setAttribute("hidden", true);
            }, 100);


        } else {
            // User is signed out
            window.location.href = "../index.html";
        }
    });
}

function joinClub(IDOfClubCurrentlyBeingViewed) {

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            //Add club to the user's list of clubs
            var uid = user.uid;
            database.ref("users/" + uid + "/clubs/" + IDOfClubCurrentlyBeingViewed).update({
                name: document.querySelector(".club-title").innerHTML,
                role: "member"
            })

            //Increment club member count by 1 in DB
            database.ref("clubs/" + IDOfClubCurrentlyBeingViewed).update({
                memberCount: parseInt(document.querySelector(".club-member-count").innerHTML) + 1 //Not a good concurrent solution, use array instead
            })

            //Hide join club button and show leave club button
            document.querySelector(".join-button").setAttribute("hidden", true);
            document.querySelector(".leave-button").removeAttribute("hidden");

            //Update Memberships and Ownerships
            updateMembershipsAndOwnerships();

        } else {
            // User is signed out
            window.location.href = "../index.html";
        }
    });
}

function leaveClub(IDOfClubCurrentlyBeingViewed) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            //Remove club from the user's list of clubs
            database.ref("users/" + uid + "/clubs/" + IDOfClubCurrentlyBeingViewed).remove();

            //Decrement club member count by 1 in DB
            database.ref("clubs/" + IDOfClubCurrentlyBeingViewed).update({
                memberCount: parseInt(document.querySelector(".club-member-count").innerHTML) - 1 //Not a good concurrent solution, use array instead
            })

            //Hide leave club button and show join club button
            document.querySelector(".leave-button").setAttribute("hidden", true);
            document.querySelector(".join-button").removeAttribute("hidden");

            //Update Memberships and Ownerships
            updateMembershipsAndOwnerships();

        } else {
            // User is signed out
            window.location.href = "../index.html";
        }
    });
}

function goBackToResults() {

    //Disable textareas if going back from a club info screen that's in the middle of being edited
    var allTextareasRequiringValidation = document.querySelectorAll(".validate-this-textarea");
    for (let i = 0; i < allTextareasRequiringValidation.length; i++) {
        allTextareasRequiringValidation[i].setAttribute("disabled", true);
    }

    //Hide/unhide club template elements as necessary
    document.querySelector(".show-saved-title-div").removeAttribute("hidden");
    document.querySelector(".create-title-div").setAttribute("hidden", true);

    //Hide club info template and show default section
    document.querySelector(".club-info-template").setAttribute("hidden", true);
    document.querySelector(".default").removeAttribute("hidden");
}

