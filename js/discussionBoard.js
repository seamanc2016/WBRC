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

//Navigation
function navDashboard() {
    window.location.href = "../html/dashboardPage.html";
}

//Basic Page Functions
function showCreateTile() {
    document.getElementById("createTileTemplate").style.display = "block";
}
function showCreateEventCommentTile() {
    document.getElementById("createEventCommentTemplate").style.display = "block";
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

//Showing/Hiding elements in the create tile based upon selected category
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

//creating full name from DB
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

        }
        else {
            alert("No data available"); //This would do nothing realistically
        }
    }).catch((error) => {
        console.error(error);
    });
}

//functionality for the filter dropdown
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
            sessionStorage.setItem("searchCat", "default");
            window.location.reload();
            break;
    }
}

/****************************************************************
                            Loading posts
****************************************************************/
(function loadPosts() {
    //Get Data from database on all saved forums
    auth.onAuthStateChanged(function (user) {
        if (user) {
            var uid = user.uid;
            var position = 1;
            userFullName();
            var searhCat = sessionStorage.getItem("searchCat");
            switch (searhCat) {
                case "Event" :
                //If the event filter is selected
                    database.ref("D&E/events").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var creator = childSnapshot.val().creator;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            var key = childSnapshot.key
                            
                            createEventCard(creator, dateCreated, description, doe, toe, title, position, key);
                            position++;
                        });
                    });
                    break;
                case "Discussion" :
                //If the discussion filter is selected
                    database.ref("D&E/discussions").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var creator = childSnapshot.val().creator;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            var key = childSnapshot.key
                            
                            createDiscussionCard(creator, dateCreated, description, doe, toe, title, position, key);
                            position++;
                        });
                    });
                    break;
                case "Issue" :
                //If the Issue filter is selected
                    database.ref("D&E/issues").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var status = childSnapshot.val().status;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            var key = childSnapshot.key
                            
                            createIssueCard(status, dateCreated, description, doe, toe, title, position, key);
                            position++;
                        });
                    });
                    break;
                default :
                //If all or no filter is selected
                    database.ref("D&E/events").once('value', (snapshot) => {
                        snapshot.forEach((childSnapshot) => {
                            var creator = childSnapshot.val().creator;
                            var dateCreated = childSnapshot.val().date_created;
                            var description = childSnapshot.val().description;
                            var doe = childSnapshot.val().doe;
                            var toe = childSnapshot.val().toe;
                            var title = childSnapshot.val().title;
                            var key = childSnapshot.key
                            
                            createEventCard(creator, dateCreated, description, doe, toe, title, position, key);
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
                            var key = childSnapshot.key;
                            
                            createIssueCard(status, dateCreated, description, doe, toe, title, position, key);
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
                            var key = childSnapshot.key
                            
                            createDiscussionCard(creator, dateCreated, description, doe, toe, title, position, key);
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

    // Declare user variable and make a post key
    var user = auth.currentUser;
    var uid = user.uid;
    var postName = uid + Math.floor(Math.random()*10000000000000);
    
    // Add this post to Firebase Database
    var database_ref = database.ref();
    
    // Create post data
    var post_data = {
        title : title,
        doe : doe,
        toe : toe,
        description : description,
        creator: sessionStorage.getItem("strFull"),
        date_created : Date.now()
    };
    // Push to post_data to update the Firebase Realtimne Database
    database_ref.child('D&E/').child("events/" + postName).update(post_data);
    document.getElementById('create_title').value=null;
    document.getElementById('create_category').value=null;
    document.getElementById('create_doe').value=null;
    document.getElementById('create_toe').value=null;
    document.getElementById('create_description').value=null;
    document.getElementById("createTileTemplate").style.display = "none";
    window.location.reload();

}

//loading Event Card
function createEventCard(creator, dateCreated, description, doe, toe, title, position, key) {
    //Get copy of card template
    var cardTemplate = document.querySelector(".event_card_template");
    //Make appropriate edits
    cardTemplate.removeAttribute("hidden");

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
    newCard.querySelector(".search-result-button").id = key;
    


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

    // Declare user variable and post key
    var user = auth.currentUser;
    var uid = user.uid;
    var postName = uid + Math.floor(Math.random()*10000000000000);
    
    // Add this post to Firebase Database
    var database_ref = database.ref();

    //declare post data
    var post_data = {
        title : title,
        description : description,
        creator: sessionStorage.getItem("strFull"),
        date_created : Date.now()
    };
    // Push to post_data to update the Firebase Realtimne Database
    database_ref.child('D&E/').child("discussions/" + postName).update(post_data);
    document.getElementById('create_title').value=null;
    document.getElementById('create_category').value=null;
    document.getElementById('create_doe').value=null;
    document.getElementById('create_toe').value=null;
    document.getElementById('create_description').value=null;
    document.getElementById("createTileTemplate").style.display = "none";
    window.location.reload();
    }


//loading discussion card
function createDiscussionCard(creator, dateCreated, description, doe, toe, title, position, key) {
    //Get copy of card template
    var cardTemplate = document.querySelector(".discussion_card_template");

    //Make appropriate edits
    cardTemplate.removeAttribute("hidden");

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
    newCard.querySelector(".search-result-button").id = key;


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

    // Declare user variable and post key
    var user = auth.currentUser;
    var uid = user.uid;
    var postName = uid + Math.floor(Math.random()*10000000000000);
    
    // Add this post to Firebase Database
    var database_ref = database.ref();

    // Create post data
    var post_data = {
        title : title,
        status : "To Do",
        doe : doe,
        toe : toe,
        description : description,
        creator: sessionStorage.getItem("strFull"),
        date_created : Date.now()
    };
    // Push to post_data to update the Firebase Realtimne Database
    database_ref.child('D&E/').child("issues/" + postName).update(post_data);
    document.getElementById('create_title').value=null;
    document.getElementById('create_category').value=null;
    document.getElementById('create_doe').value=null;
    document.getElementById('create_toe').value=null;
    document.getElementById('create_description').value=null;
    document.getElementById("createTileTemplate").style.display = "none";
    window.location.reload();
}

//loading issue card
function createIssueCard(status, dateCreated, description, doe, toe, title, position, key) {
    //Get copy of card template
    var cardTemplate = document.querySelector(".issue_card_template");

    //Make appropriate edits
    cardTemplate.removeAttribute("hidden");

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
    newCard.querySelector(".search-result-button").id = key;


    //Clear the card template of the information so that new cards won't share the info and rehide it
    var cardTemplateInputFields = cardTemplate.querySelectorAll(".issue-card-info");
    for (let i = 0; i < cardTemplateInputFields.length; i++)
        cardTemplateInputFields[i].value = "";

    cardTemplate.setAttribute("hidden", true);

}

//loading the expanded event post
function loadEventPost(callingElement) {
    //Query the database to find the appropriate information of post and place that info into the template
    database.ref("D&E/events").once('value', (snapshot) => {
        var copyOfTemplate = document.querySelector(".event-info-template");
        snapshot.forEach((childSnapshot) => {
            //Find the child that matches the button inner HTML
            if (childSnapshot.key == callingElement) {
                var child = childSnapshot.val();
                //Put its info into the post info template in the appropriate areas
                copyOfTemplate.querySelector(".post-title").innerHTML = child.title;
                copyOfTemplate.querySelector(".creator-name").innerHTML = child.creator;
                copyOfTemplate.querySelector(".creator-doe").innerHTML = child.doe;
                copyOfTemplate.querySelector(".creator-toe").innerHTML = child.toe;

                copyOfTemplate.querySelector("#description").value = child.description; //Adjust size of the description field basedon what's in it

                return;
            }
            else {
                console.log("unkwon id");
            }
        });

        //Set the action button IDs equal to the calling element's ID
        copyOfTemplate.querySelector(".join-button").id = callingElement.id;
        copyOfTemplate.querySelector(".delete-post-button").id = callingElement.id;

        //Hide default section and show post info template
        setTimeout(() => {
            document.querySelector(".default").setAttribute("hidden", true);
            document.querySelector(".event-info-template").removeAttribute("hidden");
        }, 100)

    });



}

//loading the expanded discussion postt
function loadDiscussionPost(callingElement) {
    //Query the database to find the appropriate information of post and place that info into the template
    database.ref("D&E/discussions").once('value', (snapshot) => {
        var copyOfTemplate = document.querySelector(".discussion-info-template");
        snapshot.forEach((childSnapshot) => {
            //Find the child that matches the button inner HTML
            if (childSnapshot.key == callingElement) {
                var child = childSnapshot.val();
                sessionStorage.setItem("currentkey", childSnapshot.key);
                //Put its info into the post info template in the appropriate areas
                
                copyOfTemplate.querySelector(".post-title").innerHTML = child.title;
                copyOfTemplate.querySelector(".creator-name").innerHTML = child.creator;

                copyOfTemplate.querySelector("#description").value = child.description; //Adjust size of the description field basedon what's in it

                var position = 1;
                database.ref("D&E/discussions/").child(childSnapshot.key + "/replies").once('value', (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        var creator = childSnapshot.val().creator;
                        var text = childSnapshot.val().reply_text;

                        
                        loadDiscussionComments(creator, text);
                        position++;
                    });
                });
                return;
            }
            else {
                console.log("unkwon id");
                console.log(childSnapshot.key);
                console.log(callingElement);
            }
        });

        //Set the action button IDs equal to the calling element's ID
        copyOfTemplate.querySelector(".join-button").id = callingElement.id;
        copyOfTemplate.querySelector(".delete-post-button").id = callingElement.id;

        //Hide default section and show post info template
        setTimeout(() => {
            document.querySelector(".default").setAttribute("hidden", true);
            document.querySelector(".discussion-info-template").removeAttribute("hidden");
        }, 100)

    });



}


function loadDiscussionComments(creator, text) {
    //Get copy of card template
    var cardTemplate = document.querySelector(".discussion_comment_template");
    var cardHeader = cardTemplate.querySelector(".forum-card-heading");

    //Make appropriate edits
    cardTemplate.removeAttribute("hidden");
    //cardHeader.setAttribute("hidden",true);
    //cardHeader.innerHTML += position;

    //Add a copy of the edited card template to the page
    var newCardArea = document.querySelector("#new-comment-area");
    cardTemplate.classList.add("last-added");
    newCardArea.insertAdjacentHTML("beforeend", cardTemplate.outerHTML);

    //Get last card in new card area and the values to it
    var newCard = newCardArea.querySelector(".last-added");
    var newCardInputFields = newCard.querySelectorAll(".discussion-comment-info");
    newCardInputFields[0].value = creator;
    newCardInputFields[1].value = text;
    //newCardInputFields[1].value = creator;
    //newCardInputFields[2].value = description;
    newCard.classList.remove("last-added");

    cardTemplate.setAttribute("hidden", true);

}

//Create New Issue Post
function createEventComment() {
    description = document.getElementById('create_description').value;

    // Declare user variable
    var user = auth.currentUser;
    var uid = user.uid;
    var postName = uid + Math.floor(Math.random()*10000000000000);
    
    // Add this post to Firebase Database
    var database_ref = database.ref();

    // Create User data
    var post_data = {
        description : description,
        creator: sessionStorage.getItem("strFull"),
        date_created : Date.now()
    };
    // Push to user_data to update the Firebase Realtimne Database
    database_ref.child('D&E/').child("events/" + sessionStorage.getItem("currentKey")).child(replies).child(postName).update(post_data);
    document.getElementById('create_description').value=null;
    document.getElementById("createEventCommentTemplate").style.display = "none";
    window.location.reload();
}

function loadIssuePost(callingElement) {
    //Query the database to find the appropriate information of post and place that info into the template
    database.ref("D&E/issues").once('value', (snapshot) => {
        var copyOfTemplate = document.querySelector(".issue-info-template");
        snapshot.forEach((childSnapshot) => {
            //Find the child that matches the button inner HTML
            if (childSnapshot.key == callingElement) {
                console.log("hi")
                var child = childSnapshot.val();
                //Put its info into the post info template in the appropriate areas
                copyOfTemplate.querySelector(".post-title").innerHTML = child.title;
                copyOfTemplate.querySelector(".creator-name").innerHTML = child.creator;
                copyOfTemplate.querySelector(".creator-doi").innerHTML = child.doe;
                copyOfTemplate.querySelector(".creator-status").innerHTML = child.status;

                copyOfTemplate.querySelector("#description").value = child.description; //Adjust size of the description field basedon what's in it

                return;
            }
            else {
                console.log("unknown id");
            }
        });

        //Set the action button IDs equal to the calling element's ID
        copyOfTemplate.querySelector(".join-button").id = callingElement.id;
        copyOfTemplate.querySelector(".delete-post-button").id = callingElement.id;

        //Hide default section and show post info template
        setTimeout(() => {
            document.querySelector(".default").setAttribute("hidden", true);
            document.querySelector(".issue-info-template").removeAttribute("hidden");
        }, 100)

    });



}

function goBackToResults() {

    //Disable textareas if going back from a post info screen that's in the middle of being edited
    var allTextareasRequiringValidation = document.querySelectorAll(".validate-this-textarea");
    for (let i = 0; i < allTextareasRequiringValidation.length; i++) {
        allTextareasRequiringValidation[i].setAttribute("disabled", true);
    }

    //Hide/unhide post template elements as necessary
    document.querySelector(".show-saved-title-div").removeAttribute("hidden");
    document.querySelector(".create-title-div").setAttribute("hidden", true);

    //Hide post info template and show default section
    document.querySelector(".event-info-template").setAttribute("hidden", true);
    document.querySelector(".discussion-info-template").setAttribute("hidden", true);
    document.querySelector(".issue-info-template").setAttribute("hidden", true);
    document.querySelector(".default").removeAttribute("hidden");
}
