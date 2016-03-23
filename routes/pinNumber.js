var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

function setPin(URL,phoneNumber) {
    //Set the pin number on the DB for the phoneNumber and URL
        //phoneNumber and URL are unique key
}

function getPin(URL,phoneNumber) {
    //Get the pin number from DB that matches the URL and phoneNumber
}

module.exports = router;