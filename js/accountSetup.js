// Code copied from "Multi Step Form with progress bar jQuery and CSS3" by webbarks.
// Original Source: https://codepen.io/webbarks/pen/QWjwWNV

$( document ).ready(function() {
    var base_color = "rgb(230,230,230)";
    var active_color = "rgb(0, 27, 46)";
 
    var child = 1;
    var length = $("section").length - 1;
    $("#prev").addClass("disabled");
    $("#submit").addClass("disabled");
    
    $("section").not("section:nth-of-type(1)").hide();
    $("section").not("section:nth-of-type(1)").css('transform','translateX(100px)');
    
    var svgWidth = length * 200 + 24;
    $("#svg_wrap").html(
      '<svg version="1.1" id="svg_form_time" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ' +
        svgWidth +
        ' 24" xml:space="preserve"></svg>'
    );
    
    function makeSVG(tag, attrs) {
      var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      return el;
    }
    
    for (i = 0; i < length; i++) {
      var positionX = 12 + i * 200;
      var rect = makeSVG("rect", { x: positionX, y: 9, width: 200, height: 6 });
      document.getElementById("svg_form_time").appendChild(rect);
      // <g><rect x="12" y="9" width="200" height="6"></rect></g>'
      var circle = makeSVG("circle", {
        cx: positionX,
        cy: 12,
        r: 12,
        width: positionX,
        height: 6
      });
      document.getElementById("svg_form_time").appendChild(circle);
    }
    
    var circle = makeSVG("circle", {
      cx: positionX + 200,
      cy: 12,
      r: 12,
      width: positionX,
      height: 6
    });
    document.getElementById("svg_form_time").appendChild(circle);
    
    $('#svg_form_time rect').css('fill',base_color);
    $('#svg_form_time circle').css('fill',base_color);
    $("circle:nth-of-type(1)").css("fill", active_color);
    
     
    $(".button").click(function () {
      $("#svg_form_time rect").css("fill", active_color);
      $("#svg_form_time circle").css("fill", active_color);
      var id = $(this).attr("id");
      if (id == "next") {
        $("#prev").removeClass("disabled");
        if (child >= length) {
          $(this).addClass("disabled");
          $('#submit').removeClass("disabled");
        }
        if (child <= length) {
          child++;
        }
      } else if (id == "prev") {
        $("#next").removeClass("disabled");
        $('#submit').addClass("disabled");
        if (child <= 2) {
          $(this).addClass("disabled");
        }
        if (child > 1) {
          child--;
        }
      }
      var circle_child = child + 1;
      $("#svg_form_time rect:nth-of-type(n + " + child + ")").css(
        "fill",
        base_color
      );
      $("#svg_form_time circle:nth-of-type(n + " + circle_child + ")").css(
        "fill",
        base_color
      );
      var currentSection = $("section:nth-of-type(" + child + ")");
      currentSection.fadeIn();
      currentSection.css('transform','translateX(0)');
     currentSection.prevAll('section').css('transform','translateX(-100px)');
      currentSection.nextAll('section').css('transform','translateX(100px)');
      $('section').not(currentSection).hide();
    });
    

});

//*******************************  Multistep Form - CITATION END  ***********************************/

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
auth.onAuthStateChanged(function(user) {
  if (user) {
      // User is signed in.

  } else {
      // No user is signed in.
      window.location.href = "../index.html";
  }
});  


//Firebase standard logout function modified to route to the home/loginpage
function logout(){
  firebase.auth().signOut();
  window.location.href = "../index.html";
}


//Filling Personal Info fields with info from Database. This is a self-invoked function.
(function setPIValues(){

    //Select the appropriate elements. This works like an array, where it counts appropriate elements starting from the top.
    //Alternatively, you could find each element individually.
    var personalInfoElement = document.getElementsByClassName("personal-info"); 


    //Read data from database and set them to the values of each element respectively

    auth.onAuthStateChanged(function(user) {
      if (user) {

          var uid = user.uid;
          const dbEntryRef = database.ref().child("users").child(uid); //Setting where the database should look, it's ID# temporarily for practice
          dbEntryRef.get().then((snapshot) => {
          if (snapshot.exists()) {
              //use snapshot.val() to access the object sent back from the server
              personalInfoElement[0].value = snapshot.val().firstName;
              personalInfoElement[1].value = snapshot.val().lastName;

              //How to set a value for a select tag
              for(var i=0; i < personalInfoElement[2].options.length; i++)
              {
                if( personalInfoElement[2].options[i].value == snapshot.val().isSenior ) {
                  personalInfoElement[2].value = snapshot.val().isSenior;
                  break;
                }
              }


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

// Validates fields before enabling input for the personal info section of the form. Afterwards, hides save button and displays edit button.
document.getElementById("save-button").addEventListener("click", savePersonalInfo);
function savePersonalInfo(){

  //Getting all the personal info elements
  var personalInfoElements=document.getElementsByClassName("personal-info");
  
  //Needs input validation...
  //Preventing the user from sending in blank fields
  for(var i = 0; i < personalInfoElements.length;i++)
  {
      if(personalInfoElements[i].value == ""){
          return alert("You need to enter all information before sending!")
      };
  };


  //If validation passed, disable input fields
  for(i=0;i<personalInfoElements.length;i++)
      personalInfoElements[i].disabled=true;
  
  //Hide save button and show edit button
  document.getElementById("edit-button").style.display = "inline";
  document.getElementById("save-button").style.display = "none";


  //Update database with new info
  auth.onAuthStateChanged(function(user) {
    if (user) {
      var uid = user.uid;

      database.ref('users/' + uid).update({
        firstName: personalInfoElements[0].value,
        lastName: personalInfoElements[1].value,
        isSenior : personalInfoElements[2].value,
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


//Send Orientation Date to Database
document.getElementById("set-date-button").addEventListener("click", setOrientationDate)
function setOrientationDate(){

  //Get Date Element
  var dateElement = document.getElementById("orientation-date");

  //Validate Orientation Date
  var date_regex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/ ;

  //Gives an error for choosing a past date.
  var currentDate = new Date();
  var selectedDate = new Date();
  selectedDate.setYear(dateElement.value.substring(0,4));
  selectedDate.setMonth( parseInt(dateElement.value.substring(5,7)) - 1);
  selectedDate.setDate(dateElement.value.substring(8,10));

  if (date_regex.test(dateElement.value) == false || selectedDate <= currentDate)
    return alert("Invalid date. Please try again.");

  //If it passes, hide the Date Selection div and show the Date Selected div. Display a message with the date chosen.
  document.getElementById("date-selection").style.display = "none";
  var dateString = selectedDate.toLocaleDateString("en-US"); //changing the yyyy-mm-dd format to mm/dd/yyyy
  document.getElementById("date-selected-message").innerText = "You've chosen " + dateString + " as your orientation date. We'll follow up with a phone call as soon as possible to confirm the appointment and to work out specifics like time and meetup place.";
  document.getElementById("date-selected").style.display = "inline";

  //Send the chosen date to the database.
  auth.onAuthStateChanged(function(user) {
    if (user) {

      var uid = user.uid;
      database.ref("users/" + uid).update({
        orientationDate: dateString
      });
  
    } else {
        // No user is signed in.
        window.location.href = "../index.html";
    }
  });  


};


//Fake loading for payment simulation
function paymentConfirmation(){
  var paymentConfirmation = document.getElementById("payment-confirmation"); //should theoretically be hidden before function call
  var makingPayment = document.getElementById("making-payment"); //should theoretically be visible before function call

  makingPayment.style.display = "none";
  paymentConfirmation.style.display = "inline";
}


//Sending Card Info to the database if that was chosen
document.getElementById("submit-payment").addEventListener("click", paymentSimulation)
function paymentSimulation(){
  //Validate Fields - The cardPayment.js code already but I'll some things it didn't account for
  //Name field doesn't matter
  var cardNumber = document.getElementById("cardnumber").value;
  var expDate = document.getElementById("expirationdate").value;
  var secCode = document.getElementById("securitycode").value;

  if(cardNumber.length < 16 || expDate.length < 4 || secCode.length < 3)
    return alert("Unable to submit due to invalid field information. Please try again.");


  //After validation, do frontend animation for making transaction
  var paymentInfo = document.getElementById("payment-info"); //visible by default
  var makingPayment = document.getElementById("making-payment"); //hidden by default

  paymentInfo.style.display = "none";
  makingPayment.style.display = "inline";
  setTimeout(paymentConfirmation, 3000);

  
  auth.onAuthStateChanged((user) => {
    //Set initialFeePaid to true
    var uid = user.uid;
    database.ref("users/" + uid).update({
      initialFeePaid: true
    });

    //Send info to database if the option was chosen. Currently, only one card can be saved per account.
    var saveCardCheckboxElement = document.getElementById("save-card-info");
    if (saveCardCheckboxElement.checked == true)
      {
        
        database.ref("cards/" + uid).update({
          number: cardNumber, 
          expiration: expDate,
          CVV: secCode
        });
      };
    })
 
} 

//Agreeing to the CoC doesn't need to be sent to the server; it's not really used for anything else.


//Upon hitting continue, set their account setup status to complete
document.getElementById("submit").addEventListener("click", setupComplete);
function setupComplete()
{
  auth.onAuthStateChanged((user) => {
    var uid = user.uid;
    //Set accountSetupDone to true in Database. Should initially be false.
    database.ref("users/" + uid).update({
      accountSetupDone: true
    });
  
    //Redirect to Dashboard.
    window.location.href = "../html/dashboardPage.html";

  })
};


//Enables input for the personal info section of the form. Also hides edit button and displays save button.
function enableInput(){

    //Enabling input fields
    var inputs=document.getElementsByClassName("personal-info");

    for(i=0;i<inputs.length;i++)
        inputs[i].disabled=false;
    
    //Hide edit button and show save button
    document.getElementById("edit-button").style.display = "none";
    document.getElementById("save-button").style.display = "inline";

}


//Adjust UI based on what the user has completed - can be implemented later if time permits



