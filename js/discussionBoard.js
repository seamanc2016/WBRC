/*!
* Start Bootstrap - Simple Sidebar v6.0.3 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/


// 
// Scripts
// 

//initialize Firebase SDK and API credentials
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
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth();
const database = firebase.database();
const dbRef = firebase.database().ref();


//function to setup auth parameters and functions upon page load
auth.onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.

    } else {
        // No user is signed in.
        window.location.href = "../index.html";
    }
});

//Basic Page Functions
function showCreateTile() {
    document.getElementById("createTileTemplate").style.display = "block";
}

function cancelCreate() {
    document.getElementById("createTileTemplate").style.display = "none";
}

function showEventInputs() {
    document.getElementById("date_input").style.display = "block";
}

function hideEventInputs() {
    document.getElementById("date_input").style.display = "none";
}

function navDashboard() {
    window.location.href = "../html/dashboardPage.html";
}

function createCategory() {
    var e = document.getElementById("create_category");
    var strUser = e.value;
    switch (strUser) {
        case "event" :
            document.getElementById("date_input").style.display = "block";
            break;
        case "discussion" :
            document.getElementById("date_input").style.display = "none";
            break;
        case "issue" :
            document.getElementById("date_input").style.display = "block";
            break;
        default :
            document.getElementById("date_input").style.display = "none";
            break;
    }
}

//loading posts
(function loadPosts() {
    //Get Data from database on all saved visitors
    auth.onAuthStateChanged(function (user) {
        if (user) {
            var uid = user.uid;
            var position = 1;
            var searhCat = sessionStorage.getItem("searchCat");
            switch (searhCat) {
                case "Event" :
                    database.ref("D&E/events").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var creator = childSnapshot.val().creator;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            
                            createEventCard(creator, dateCreated, description, doe, toe, title, position);
                            position++;
                        });
                    });
                    break;
                case "Discussion" :
                    database.ref("D&E/discussions").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var creator = childSnapshot.val().creator;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            
                            createDiscussionCard(creator, dateCreated, description, doe, toe, title, position);
                            position++;
                        });
                    });
                    break;
                case "Issue" :
                    database.ref("D&E/issues").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var status = childSnapshot.val().status;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            
                            createIssueCard(status, dateCreated, description, doe, toe, title, position);
                            position++;
                        });
                    });
                    break;
                default :
                    database.ref("D&E/events").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var creator = childSnapshot.val().creator;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            
                            createEventCard(creator, dateCreated, description, doe, toe, title, position);
                            position++;
                        });
                    });
                    database.ref("D&E/discussions").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var creator = childSnapshot.val().creator;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            
                            createDiscussionCard(creator, dateCreated, description, doe, toe, title, position);
                            position++;
                        });
                    });
                    database.ref("D&E/issues").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var status = childSnapshot.val().status;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            
                            createIssueCard(status, dateCreated, description, doe, toe, title, position);
                            position++;
                        });
                    });
                    break;
            }
            

        } else {
            // No user is signed in.
            window.location.href = "../index.html";
        }
    });

}());

/****************************************************************************
 *                           Creating Posts
 ****************************************************************************/
 function createPost() {
    var e = document.getElementById("create_category");
    var strUser = e.value;
    userFullName();
    switch (strUser) {
        case "event" :
            createEventPost();
            break;
        case "discussion" :
            createDiscussionPost();
            break;
        case "issue" :
            createIssuePost();
            break;
        default :
            alert("Please select a category");
    }
}


//Create New Event Post
function createEventPost() {
    // Get all our input fields
    title = document.getElementById('create_title').value;
    category = document.getElementById('create_category').value;
    doe = document.getElementById('create_doe').value;
    toe = document.getElementById('create_toe').value;
    description = document.getElementById('create_description').value;

    // Declare user variable
    var user = auth.currentUser;
    var uid = user.uid;
    var postName = uid + Math.floor(Math.random()*10000000000000);
    
    // Add this post to Firebase Database
    var database_ref = database.ref();
    
    // Create User data
    var post_data = {
        title : title,
        doe : doe,
        toe : toe,
        description : description,
        creator: sessionStorage.getItem("strFull"),
        date_created : Date.now()
    };
    // Push to user_data to update the Firebase Realtimne Database
    database_ref.child('D&E/').child("events/" + postName).update(post_data);
    document.getElementById('create_title').value=null;
    document.getElementById('create_category').value=null;
    document.getElementById('create_doe').value=null;
    document.getElementById('create_toe').value=null;
    document.getElementById('create_description').value=null;
    document.getElementById("createTileTemplate").style.display = "none";
    window.location.reload();

}

//loading post card
function createEventCard(creator, dateCreated, description, doe, toe, title, position) {
    //Get copy of card template
    var cardTemplate = document.querySelector(".event_card_template");
    var cardHeader = cardTemplate.querySelector(".visitor-card-heading");

    //Make appropriate edits
    cardTemplate.removeAttribute("hidden");
    //cardHeader.setAttribute("hidden",true);
    //cardHeader.innerHTML += position;

    //Add a copy of the edited card template to the page
    var newCardArea = document.querySelector("#new-card-area");
    cardTemplate.classList.add("last-added");
    newCardArea.insertAdjacentHTML("beforeend", cardTemplate.outerHTML);

    //Get last card in new card area and the values to it
    var newCard = newCardArea.querySelector(".last-added");
    var newCardInputFields = newCard.querySelectorAll(".event-card-info");
    newCardInputFields[0].value = title;
    newCardInputFields[1].value = creator;
    newCardInputFields[2].value = doe;
    newCardInputFields[3].value = toe;
    newCardInputFields[4].value = description;
    newCard.classList.remove("last-added");


    //Clear the card template of the information so that new cards won't share the info and rehide it
    var cardTemplateInputFields = cardTemplate.querySelectorAll(".event-card-info");
    for (let i = 0; i < cardTemplateInputFields.length; i++)
        cardTemplateInputFields[i].value = "";

    cardTemplate.setAttribute("hidden", true);

}

//Create New Discussion Post
function createDiscussionPost() {
    // Get all our input fields
    title = document.getElementById('create_title').value;
    category = document.getElementById('create_category').value;
    description = document.getElementById('create_description').value;

    // Declare user variable
    var user = auth.currentUser;
    var uid = user.uid;
    var postName = uid + Math.floor(Math.random()*10000000000000);
    
    // Add this post to Firebase Database
    var database_ref = database.ref();


    var post_data = {
        title : title,
        description : description,
        creator: sessionStorage.getItem("strFull"),
        date_created : Date.now()
    };
    // Push to user_data to update the Firebase Realtimne Database
    database_ref.child('D&E/').child("discussions/" + postName).update(post_data);
    document.getElementById('create_title').value=null;
    document.getElementById('create_category').value=null;
    document.getElementById('create_doe').value=null;
    document.getElementById('create_toe').value=null;
    document.getElementById('create_description').value=null;
    document.getElementById("createTileTemplate").style.display = "none";
    window.location.reload();
    }


//loading post card
function createDiscussionCard(creator, dateCreated, description, doe, toe, title, position) {
    //Get copy of card template
    var cardTemplate = document.querySelector(".discussion_card_template");
    var cardHeader = cardTemplate.querySelector(".visitor-card-heading");

    //Make appropriate edits
    cardTemplate.removeAttribute("hidden");
    //cardHeader.setAttribute("hidden",true);
    //cardHeader.innerHTML += position;

    //Add a copy of the edited card template to the page
    var newCardArea = document.querySelector("#new-card-area");
    cardTemplate.classList.add("last-added");
    newCardArea.insertAdjacentHTML("beforeend", cardTemplate.outerHTML);

    //Get last card in new card area and the values to it
    var newCard = newCardArea.querySelector(".last-added");
    var newCardInputFields = newCard.querySelectorAll(".discussion-card-info");
    newCardInputFields[0].value = title;
    newCardInputFields[1].value = creator;
    newCardInputFields[2].value = description;
    newCard.classList.remove("last-added");


    //Clear the card template of the information so that new cards won't share the info and rehide it
    var cardTemplateInputFields = cardTemplate.querySelectorAll(".discussion-card-info");
    for (let i = 0; i < cardTemplateInputFields.length; i++)
        cardTemplateInputFields[i].value = "";

    cardTemplate.setAttribute("hidden", true);

}

//Create New Issue Post
function createIssuePost() {
    // Get all our input fields
    title = document.getElementById('create_title').value;
    category = document.getElementById('create_category').value;
    doe = document.getElementById('create_doe').value;
    toe = document.getElementById('create_toe').value;
    description = document.getElementById('create_description').value;

    // Declare user variable
    var user = auth.currentUser;
    var uid = user.uid;
    var postName = uid + Math.floor(Math.random()*10000000000000);
    
    // Add this post to Firebase Database
    var database_ref = database.ref();

    // Create User data
    var post_data = {
        title : title,
        status : "To Do",
        doe : doe,
        toe : toe,
        description : description,
        creator: sessionStorage.getItem("strFull"),
        date_created : Date.now()
    };
    // Push to user_data to update the Firebase Realtimne Database
    database_ref.child('D&E/').child("Issues/" + postName).update(post_data);
    document.getElementById('create_title').value=null;
    document.getElementById('create_category').value=null;
    document.getElementById('create_doe').value=null;
    document.getElementById('create_toe').value=null;
    document.getElementById('create_description').value=null;
    document.getElementById("createTileTemplate").style.display = "none";
    window.location.reload();
}

//loading post card
function createIssueCard(status, dateCreated, description, doe, toe, title, position) {
    //Get copy of card template
    var cardTemplate = document.querySelector(".issue_card_template");
    var cardHeader = cardTemplate.querySelector(".visitor-card-heading");

    //Make appropriate edits
    cardTemplate.removeAttribute("hidden");
    //cardHeader.setAttribute("hidden",true);
    //cardHeader.innerHTML += position;

    //Add a copy of the edited card template to the page
    var newCardArea = document.querySelector("#new-card-area");
    cardTemplate.classList.add("last-added");
    newCardArea.insertAdjacentHTML("beforeend", cardTemplate.outerHTML);

    //Get last card in new card area and the values to it
    var newCard = newCardArea.querySelector(".last-added");
    var newCardInputFields = newCard.querySelectorAll(".issue-card-info");
    newCardInputFields[0].value = title;
    newCardInputFields[1].value = status;
    newCardInputFields[2].value = doe;
    newCardInputFields[3].value = toe;
    newCardInputFields[4].value = description;
    newCard.classList.remove("last-added");


    //Clear the card template of the information so that new cards won't share the info and rehide it
    var cardTemplateInputFields = cardTemplate.querySelectorAll(".issue-card-info");
    for (let i = 0; i < cardTemplateInputFields.length; i++)
        cardTemplateInputFields[i].value = "";

    cardTemplate.setAttribute("hidden", true);

}





function searchPosts() {
    var e = document.getElementById("category_search");
    var strUser = e.value;
    switch (strUser) {
        case "Event" :
            sessionStorage.setItem("searchCat", "Event");
            window.location.reload();
            break;
        case "Discussion" :
            sessionStorage.setItem("searchCat", "Discussion");
            window.location.reload();
            break;
        case "Issue" :
            sessionStorage.setItem("searchCat", "Issue");
            window.location.reload();
            break;
        default :
            break;
    }
}



function userFullName() {
    var user = auth.currentUser;
    var uid = user.uid;
    var dbEntryRef = database.ref().child("users").child(uid); //Setting where the database should look, it's ID# temporarily for practice
    dbEntryRef.get()
    .then((snapshot) => {
        if (snapshot.exists()) {
            //use snapshot.val() to access the object sent back from the server
            strFirst = snapshot.val().firstName;
            strLast = snapshot.val().lastName;
            strFull = strFirst + " " + strLast;
            sessionStorage.setItem("strFull", strFull);
            console.log(strFull);

        }
        else {
            alert("No data available"); //This would do nothing realistically
        }
    }).catch((error) => {
        console.error(error);
    });
}