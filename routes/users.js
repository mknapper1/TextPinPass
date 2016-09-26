var express = require('express');
var router = express.Router();

// Twillio setup
var twilio_live = true;
var accountSid_live = '';
var authToken_live = '';
var accountSid_test = '';
var authToken_test = '';

var phoneNumber_from_live = '';
var phoneNumber_from_test = '';
var phoneNumber_from;

var twilio;
if (twilio_live) {
  twilio = require('twilio')(accountSid_live, authToken_live);
  phoneNumber_from = phoneNumber_from_live;
} else {
  twilio = require('twilio')(accountSid_test, authToken_test);
  phoneNumber_from = phoneNumber_from_test;
}

/* GET users listing. */
router.post('/', function(req, res, next) {
  var pin = generatePinNumber(4);
  var phoneNumber = '';
  res.send('respond with a resource');
  sendPin(phoneNumber,pin);
});

function generatePinNumber(length) {
  length = length || PIN_LENGTH || 10;
  var pin = '';
  for (var i = 0; i < length; i++) {
    pin += Math.floor((Math.random() * 10)); //generates a number between 0 & 9
  }
  return pin;
}

function sendPin(phoneNumber,pin) {
  console.log(phoneNumber + '-----' + pin);
  pin = "PIN NUMBER: " + pin || 'ERROR GENERATING PIN';
  phoneNumber = phoneNumber || '';
  twilio.sendMessage({
    body: pin,
    to: phoneNumber,
    from: phoneNumber_from
  }, function(error, message) {
    if (error) {
      console.log(error.message);
    }
    console.log(message);
  });
}

function storePinNumber(phoneNumber,pin) {
  // Stores the generated pin on a db so when the user enters the pin it can authenticate against the account
}

function isPinValid(phoneNumber, pinNumber) {
  if (pinNumber === findPin(phoneNumber)) {
    return true;
  }
  return false;
}

module.exports = router;
