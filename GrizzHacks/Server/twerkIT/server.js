//express init
var express = require('express');
var express_app = new express();


//twilio init
var twilio_live = true;
var accountSid_live = 'AC438b5dfe281da6684cfd6eafa5054cfd';
var authToken_live = '858373e32e8dafef5e245ee3f757b956';
var accountSid_test = 'AC8e403ecded02c3cdacdcde5af4e64398';
var authToken_test = '475b9f37eb9a8e0733d0688901900630';

var pNum_to = '+12693034073';
var pNum_from_live = '+12693388071';
var pNum_from_test = '+15005550006';
var pNum_from;

var message_body = 'I AM A TEST';

var twilio;
if (twilio_live) {
    twilio = require('twilio')(accountSid_live, authToken_live);
    pNum_from = pNum_from_live;
} else {
    twilio = require('twilio')(accountSid_test, authToken_test);
    pNum_from = pNum_from_test;
}

function sendMessage() {
    twilio.sendMessage({
        body: message_body,
        to: pNum_to,
        from: pNum_from
    }, function(error, message) {
        if (error) {
            console.log(error.message);
        }
        console.log(message);
    });
}

function generatePinNumber() {
    //Generates authentication pin
}

function storePinNumber() {
    // Stores the generated pin on a db so when the user enters the pin it can authenticate against the account
}

function sendPinNumber() {
    // uses send message to send the pin
}

function gotPin() {
  //runs functions once a pin nummber has been entered into the text box
}

function authenticatePin() {
    // tests whether or not the pin and phone numbers match
}

function authenticated() {

    function newUser() {

    }

    function existingUser() {

        function success() {

        }

        function error() {

        }

    }


}

