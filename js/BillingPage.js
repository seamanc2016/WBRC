//variables to save for email function
var userEmail;
var userFLname;
var userAddress;
var userNumber;
var BillingPeriodOpen;
var todayDate;


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
          } else {
            var noCardSection = document.getElementById("no-card-section");
            var addCardSection = document.getElementById("add-card-section");
            var currentCardSection = document.getElementById("current-card-section");
            noCardSection.style.display = "inline";
            addCardSection.style.display = "none";
            currentCardSection.style.display = "none";
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

 
function submitPayment() {
    
    auth.onAuthStateChanged(function (user) {
    if (user) {
        
      var uid = user.uid;
      database.ref("bills/" + uid).update({
        amountOwed: 0
      });
        
        
     let savePayment = document.getElementById("savePay").checked;
        
        
     if (savePayment == false) {
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

     }
        
        
    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }
  }); 
}


(function getNameAndAddress() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      cardRef = database.ref().child("users").child(uid);
      cardRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            
           //adress, name (first and last), amount owed 
            document.getElementById("name").innerHTML = snapshot.val().firstName + " " + snapshot.val().lastName;
            document.getElementById("address").innerHTML = snapshot.val().unitNum + " " + snapshot.val().street + ", Boca Raton";
            document.getElementById("phone").innerHTML = "+" + snapshot.val().phone;
            
            
            
            document.getElementById("receiptName").innerHTML = "Billed To:&emsp;&emsp;&emsp;" + snapshot.val().firstName + " " + snapshot.val().lastName;
            document.getElementById("receiptAddress").innerHTML = "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"+snapshot.val().unitNum + " " + snapshot.val().street + ", Boca Raton";
            document.getElementById("receiptPhone").innerHTML = "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;+" + snapshot.val().phone;
            
            userFLname = "Billed To:&emsp;&emsp;&emsp;" + snapshot.val().firstName + " " + snapshot.val().lastName;
            userAddress  = "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;"+snapshot.val().unitNum + " " + snapshot.val().street + ", Boca Raton";
            userNumber = "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;+" + snapshot.val().phone;
            userEmail = snapshot.val().email;
            
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

(function getAmountOwed() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      cardRef = database.ref().child("bills").child(uid);
      cardRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            
           //adress, name (first and last), amount owed 
            document.getElementById("TotalDue").innerHTML = "USD: $" + snapshot.val().amountOwed;
        
        } else {
          console.log("No data available");
          
        }
      }).catch((error) => {
        console.error(error);
          console.log("No data available");
        //Should really do nothing in this case
      });


    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }
  });
})();

(function setDate() {
    
   
    let q1 = new Date('March 31, 2022 23:59:00');
    let q2 = new Date('June 30, 2022 23:59:00');
    let q3 = new Date('September 30, 2022 23:59:00');
    let q4 = new Date('December 31, 2022 23:59:00');
    
    let today = new Date();
    
    
    q1.setFullYear(today.getFullYear());
    q2.setFullYear(today.getFullYear());
    q3.setFullYear(today.getFullYear());
    q4.setFullYear(today.getFullYear());
    
    if (today <= q1) {
        console.log("Q1");
        document.getElementById("paymentDue").innerHTML = (q1.getMonth()+1) + "/" + q1.getDate() + "/" + q1.getFullYear();
        document.getElementById("nextDueDate").innerHTML = "Next billing period will open on: " + (q1.getMonth()+2) + "/1/" + q1.getFullYear();
        billingPeriodOpen = "Next billing period will open on: " + (q1.getMonth()+2) + "/1/" + q1.getFullYear();
        
    } else if (today <= q2) {
        console.log("Q2");
        document.getElementById("paymentDue").innerHTML = (q2.getMonth()+1) + "/" + q2.getDate() + "/" + q2.getFullYear();
        document.getElementById("nextDueDate").innerHTML = "Next billing period will open on: " + (q2.getMonth()+2) + "/1/" + q2.getFullYear();
        billingPeriodOpen = "Next billing period will open on: " + (q2.getMonth()+2) + "/1/" + q2.getFullYear();
    } else if (today <= q3) {
        console.log("Q3");
        document.getElementById("paymentDue").innerHTML = (q3.getMonth()+1) + "/" + q3.getDate() + "/" + q3.getFullYear();
        document.getElementById("nextDueDate").innerHTML = "Next billing period will open on: " + (q3.getMonth()+2) + "/1/" + q3.getFullYear();
        billingPeriodOpen = "Next billing period will open on: " + (q3.getMonth()+2) + "/1/" + q2.getFullYear();
    } else if (today <= q4) {
        console.log("Q4");
        document.getElementById("paymentDue").innerHTML = (q4.getMonth()+1) + "/" + q4.getDate() + "/" + q4.getFullYear();
        document.getElementById("nextDueDate").innerHTML = "Next billing period will open on: " + (q1.getMonth()+1) + "/1/" + (q4.getFullYear()+1);
        billingPeriodOpen = "Next billing period will open on: " + (q1.getMonth()+1) + "/1/" + (q4.getFullYear()+1);
    }
    
    //for receipt page, sets page's date.
    document.getElementById("receiptDate").innerHTML = "Date:&emsp;&emsp;&emsp;&emsp;&ensp;" + (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
    todayDate = "Date:&emsp;&emsp;&emsp;&emsp;&ensp;" + (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
    
})();

(function paymentCheck() {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      var uid = user.uid;
      cardRef = database.ref().child("bills").child(uid);
      cardRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            
           //adress, name (first and last), amount owed 
            if (snapshot.val().amountOwed == 0) {
                document.getElementById("paymentComplete").style.display = "inline";
                document.getElementById("paymentRequired").style.display = "none";
            } else if (snapshot.val().amountOwed > 0) {
                document.getElementById("paymentComplete").style.display = "none";
                document.getElementById("paymentRequired").style.display = "inline";
            }
        
        } else {
          console.log("No data available");
          
        }
      }).catch((error) => {
        console.error(error);
          console.log("No data available");
        //Should really do nothing in this case
      });


    } else {
      // No user is signed in.
      window.location.href = "../index.html";
    }
  });
})();




//library for sending emails
src="https://smtpjs.com/v3/smtp.js";

function sendEmail() {
    
    //for testing. Delete this when no longer needed.
   // userEmail = "colchalmoderator@gmail.com";
    
    
      Email.send({
        Host: "smtp.gmail.com",
        Username: "colchalmoderator@gmail.com",
        Password: "colchal1",
        To: userEmail,
        From: "colchalmoderator@gmail.com",
        Subject: "Email confirmation of HOA Payment - West Boca Retirement Community",
        Body: "Your HOA payment for the West Boca Retirement Community has been received.<br><br>Your balance is now clear until the next billing period.<br><br>Payment Information:<br><br>" + todayDate + "<br>" + userFLname + "<br>" + userAddress + "<br>" + userNumber + "<br><br>" + billingPeriodOpen,
      })
        .then(function (message) {
          alert("mail sent successfully")
        });
}