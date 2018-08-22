

// Initialize Firebase
var config = {
 apiKey: "AIzaSyBW2RYpOwkAUsPv41T6F8nrCSotxDDDH_g",
 authDomain: "train-schedule-f159d.firebaseapp.com",
 databaseURL: "https://train-schedule-f159d.firebaseio.com",
 projectId: "train-schedule-f159d",
 storageBucket: "train-schedule-f159d.appspot.com",
 messagingSenderId: "791263906458"
};

firebase.initializeApp(config);

// Firebase reference
var database = firebase.database();

// Adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // User input
    var trnName = $("#train-input").val().trim();
    var trnDest = $("#dest-input").val().trim();
    var trnFrst = $("#first-input").val().trim();
    var trnFreq = $("#freq-input").val().trim();    
    
    // TESTING 
    // var trnFrst = "3:00";
    // var trnFreq = 3;

    // Temp
    var newTrain = {
        name: trnName,
        dest: trnDest,
        firstTrain: trnFrst,
        frequency: trnFreq
    };

    // To database
    database.ref().push(newTrain);

    // Did it work?
    console.log(newTrain.name);
    console.log(newTrain.dest);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
   

    // clear
    $("#train-input").val("");
    $("#dest-input").val("");
    $("#first-input").val("");
    $("#freq-input").val("");
});

// Firebase event 
database.ref().on("child_added", function(childSnapshot) {
    // initial success?
    console.log(childSnapshot.val());

    // Storage
    var trnName = childSnapshot.val().name;
    var trnDest = childSnapshot.val().dest;
    var trnFrst = childSnapshot.val().firstTrain;
    var trnFreq = childSnapshot.val().frequency;

    // CALCULATIONS
    var frstConvert = moment(trnFrst, "HH:mm").subtract(1, "years");
    console.log(frstConvert);

    var currentTime = moment();
    console.log("The current time is: " + moment(currentTime).format("HH:mm"));
    
    var timeDif = moment().diff(moment(frstConvert), "minutes");
    console.log("Difference in time: " + timeDif);

    var minAway = timeDif % trnFreq;
    console.log(minAway);

    var nextArr = moment().add(minAway, "minutes");
    console.log("Time until next arrival: " + moment(nextArr).format("HH:mm"));

    var nextArrFormat = moment(nextArr).format('h:mm a');


    // New rows
    var newRow = $("<tr>").append(
        $("<td>").text(trnName),
        $("<td>").text(trnDest),
        $("<td>").text(trnFreq),
        $("<td>").text(nextArrFormat),
        $("<td>").text(minAway),
    );

    // Appending
    $("#train-table > tbody").append(newRow);
})