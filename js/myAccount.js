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

//Slight delay to load stuff in
document.querySelector(".page-content").setAttribute("hidden",true);
setTimeout(()=>{
  document.querySelector(".page-content").removeAttribute("hidden");
}, 300);

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
const auth = firebase.auth();
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

//addCard() is just visually setting up the saveCard() function by bring up the card info interface
function addCard(){

  //Only show add card section
  var noCardSection = document.getElementById("no-card-section");
  var addCardSection = document.getElementById("add-card-section");
  var currentCardSection = document.getElementById("current-card-section");

  noCardSection.style.display = "none";
  addCardSection.style.display = "inline";
  currentCardSection.style.display = "none";

}

//Get the Current Card on File, if any, and display it.
(function getCurrentCard() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      cardRef = database.ref().child("cards").child(uid);
      cardRef.on('value', (snapshot) => {
        if (snapshot.exists()) {

          //Checks if there is card info on file
          if (snapshot.val().number != "") { 
            
            //Show the current card section
            var noCardSection = document.getElementById("no-card-section");
            var addCardSection = document.getElementById("add-card-section");
            var currentCardSection = document.getElementById("current-card-section");
          
            noCardSection.style.display = "none";
            addCardSection.style.display = "none";
            currentCardSection.style.display = "inline";

            //Get the last 4 digits of the card on file
            var number = snapshot.val().number;
            var last4digits = "";

            //Checking number[9] for a space because that's where American Express cards have it.
            if (number[9] != " ") 
              last4digits = number.substring(13, 17);//American Express
            else
              last4digits = number.substring(15, 19); //Will apply to all other cards

            //Inject the card info into the appropriate HTML spot
            document.getElementById("card-on-file").innerHTML = " Card ending in " + last4digits;

            //Check autopay status and show the appropriate button
            var autopayStatus = snapshot.val().autopay;
            if (autopayStatus == true)
              toggleAutopayOn();            
            else
              toggleAutopayOff();
          }

        } else {
          //console.log("No data available");
          
        }
      }).catch((error) => {
        console.error(error);
        //Should really do nothing in this case
      });


    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }
  });
})();


//Saving a new card to your account. addCard() sets this function up visually.
function saveCard() {

  //Validate Fields - The cardPayment.js code already does this but I'll some things it didn't account for
  var cardNumber = document.getElementById("cardnumber").value;
  var expDate = document.getElementById("expirationdate").value;
  var secCode = document.getElementById("securitycode").value;

  var noSpaceCardNumber = cardNumber.replace(/\s+/g, '');

  //Consider removing AmEx...?
  if (noSpaceCardNumber.length < 15 || expDate.length < 4 || secCode.length < 3)
    return alert("Unable to submit due to invalid field information. Please try again.");

  //Send info to database if succesfully passed validation
  auth.onAuthStateChanged((user) => {
    var uid = user.uid;
    database.ref("cards/" + uid).update({
      number: cardNumber,
      expiration: expDate,
      CVV: secCode
    });
  })

  //Move to the current card section
  var noCardSection = document.getElementById("no-card-section");
  var addCardSection = document.getElementById("add-card-section");
  var currentCardSection = document.getElementById("current-card-section");

  noCardSection.style.display = "none";
  addCardSection.style.display = "none";
  currentCardSection.style.display = "inline";

};

document.getElementById("remove-card-button").addEventListener('click', removeCard);
function removeCard() {

  //Update database accordingly
  auth.onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      database.ref("cards/" + uid).update({
        number: "",
        CVV: "",
        expiration: "",
        autopay: false
      });


    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }
  });

  //Show the no card section
  var currentCardSection = document.getElementById("current-card-section");
  var noCardSection = document.getElementById("no-card-section");
  var addCardSection = document.getElementById("add-card-section");

  currentCardSection.style.display = "none";
  noCardSection.style.display = "inline";
  addCardSection.style.display = "none";

};


//Turn on Autopay 
function toggleAutopayOn() {
  document.getElementById("autopay-off").style.display = "none";
  document.getElementById("autopay-on").style.display = "inline";

  auth.onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      database.ref("cards/" + uid).update({
        autopay: true
      });


    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }
  });

}

//Turn off Autopay 
function toggleAutopayOff() {
  document.getElementById("autopay-off").style.display = "inline";
  document.getElementById("autopay-on").style.display = "none";

  auth.onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      database.ref("cards/" + uid).update({
        autopay: false
      });


    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }
  });
}


//Filling Personal Info fields with info from Database. This is a self-invoked function.

(function setPIValues() {

  //Select the appropriate elements. This works like an array, where it counts appropriate elements starting from the top.
  //Alternatively, you could find each element individually.
  var personalInfoElement = document.getElementsByClassName("personal-info");


  //Read data from database and set them to the values of each element respectively

  auth.onAuthStateChanged(function (user) {
    if (user) {

      var uid = user.uid;
      const dbEntryRef = database.ref().child("users").child(uid); //Setting where the database should look, it's ID# temporarily for practice
      dbEntryRef.get().then((snapshot) => {
        if (snapshot.exists()) {
          //use snapshot.val() to access the object sent back from the server
          personalInfoElement[0].value = snapshot.val().firstName;
          personalInfoElement[1].value = snapshot.val().lastName;

          //How to set a value for a select tag

          for (var i = 0; i < personalInfoElement[2].options.length; i++) {
            if (personalInfoElement[2].options[i].value == snapshot.val().isSenior) {
              personalInfoElement[2].value = snapshot.val().isSenior;
              break;
            }
          }

          //personalInfoElement[2].value = snapshot.val().isSenior;

          personalInfoElement[3].value = snapshot.val().householdSize;
          personalInfoElement[4].value = snapshot.val().numOfVehicles;
          personalInfoElement[5].value = snapshot.val().unitNum;
          personalInfoElement[6].value = snapshot.val().street;
          personalInfoElement[7].value = snapshot.val().email;
          personalInfoElement[8].value = snapshot.val().phone;

        }

        else {
          alert("No data available"); //This would do nothing realistically
        }


      }).catch((error) => {
        console.error(error);
      });


    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }


  });

})();





//Enables input for the personal info section of the form. Also hides edit button and displays save button.
function enableInput() {

  //Enabling input fields
  var inputs = document.getElementsByClassName("personal-info");

  for (i = 0; i < inputs.length; i++)
    inputs[i].disabled = false;

  //Hide edit button and show save button
  document.getElementById("edit-button").style.display = "none";
  document.getElementById("save-button").style.display = "inline";

}


// Validates fields before enabling input for the personal info section of the form. Afterwards, hides save button and displays edit button.
document.getElementById("save-button").addEventListener("click", savePersonalInfo);
function savePersonalInfo() {

  //Getting all the personal info elements
  var personalInfoElements = document.getElementsByClassName("personal-info");

  //Needs input validation...
  //Preventing the user from sending in blank fields

  for (var i = 0; i < personalInfoElements.length; i++) {
    if (personalInfoElements[i].value == "" || personalInfoElements[i].value == "blank") {
      return alert("You need to enter all information before sending!");
    };
  };


  //If validation passed, disable input fields
  for (i = 0; i < personalInfoElements.length; i++)
    personalInfoElements[i].disabled = true;

  //Hide save button and show edit button
  document.getElementById("edit-button").style.display = "inline";
  document.getElementById("save-button").style.display = "none";


  //Update database with new info

  auth.onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;

      database.ref('users/' + uid).update({
        firstName: personalInfoElements[0].value,
        lastName: personalInfoElements[1].value,
        isSenior: personalInfoElements[2].value,
        householdSize: personalInfoElements[3].value,
        numOfVehicles: personalInfoElements[4].value,
        unitNum: personalInfoElements[5].value,
        street: personalInfoElements[6].value,
        email: personalInfoElements[7].value,
        phone: personalInfoElements[8].value

        //Updating fields that should already be there. Be wary of initial values in database

      });

    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }
  });

};


function resetAccount(){
  auth.onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      //Reset user class
      database.ref("users/" + uid).update({ accountSetupDone: false});

      //Reset user bill
      database.ref("bills/" + uid).update({ amountOwed: 200});

      //Maybe remove clubs, and visitors as well?

      logout();

    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }
  });
}