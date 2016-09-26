var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send("SUCCESS");
    var pin = generatePinNumber(4);
    var phoneNumber = req.phoneNumber;
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
    return;
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