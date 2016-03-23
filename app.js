var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

var PIN_LENGTH = 4;

//Express setup

app.post('/phoneNumberPost', function (req, res) {
  console.log('Got a POST request from /txtPinAuth');
  console.log('req:' + JSON.stringify(req));

  res.send({
    'status': 'SUCCESS'
  });

  var phoneNumber = phoneNumberAuthenticate(req.region,req.phoneNumber);

  if (phoneNumber === null) {
    res.send({
      'status': 'ERROR',
      'message': req.phoneNumber + ' is not a valid ' + req.region + ' phone number'
    });
  }  else {
    var pin = generatePinNumber(PIN_LENGTH);

    storePinNumber(phoneNumber,pin);

    sendPin(phoneNumber,pin);

    res.send({
      'status': 'SUCCESS'
    });
  }

});

app.post('/pinNumPost', function (req, res) {
  console.log('Got a POST request from /pinNumPost');
  console.log('req:' + req);

  if (isPinValid(req.phoneNumber, req.pinNumber)) {
    res.send({
      'status': 'SUCCESS'
    });
  }  else {
    res.send({
      'status': 'FAIL'
    });
  }
});


// DynamoDB setup
var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com",
  accessKeyId: 'AKIAIPXMKLR536VMYY7Q',
  secretAccessKey: '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'
});

// Twillio setup
var twilio_live = true;
var accountSid_live = 'AC438b5dfe281da6684cfd6eafa5054cfd';
var authToken_live = '858373e32e8dafef5e245ee3f757b956';
var accountSid_test = 'AC8e403ecded02c3cdacdcde5af4e64398';
var authToken_test = '475b9f37eb9a8e0733d0688901900630';

var phoneNumber_from_live = '+12693388071';
var phoneNumber_from_test = '+15005550006';
var phoneNumber_from;

var twilio;
if (twilio_live) {
  twilio = require('twilio')(accountSid_live, authToken_live);
  phoneNumber_from = phoneNumber_from_live;
} else {
  twilio = require('twilio')(accountSid_test, authToken_test);
  phoneNumber_from = phoneNumber_from_test;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// Our functions
function phoneNumberAuthenticate(region,phoneNumber) {
  region = region || 'US';
  switch (region) {
    case 'US':
      if (phoneNumber.match(/\d/g).length===10) {
        phoneNumber =  1 + phone.match(/\d/g);
      } else if (phoneNumber.match(/\d/g).length===11 && phoneNumber[0] ==='1'){
        phoneNumber = phoneNumber.match(/\d/g);
      } else {
        return null;
      }
      phoneNumber = phoneNumber.join('');
      return(phoneNumber);
  }
}

function sendPin(phoneNumber,pin) {
  console.log(phoneNumber + '-----' + pin);
  return;
  pin = "PIN NUMBER: " + pin || 'ERROR GENERATING PIN';
  phoneNumber = phoneNumber || '2698158815';
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

function generatePinNumber(length) {
  length = length || PIN_LENGTH || 10;
  var pin = '';
  for (var i = 0; i < length; i++) {
    pin += Math.floor((Math.random() * 10)); //generates a number between 0 & 9
  }
  return pin;
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


//FUN SESSION STUFF WE WILL PROBABLY FAKE FOR NOW
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

function findPin(phoneNumber) {
  var params = {
    TableName : "pins",
    KeyConditionExpression: "#phoneNumber = :PHONENUMBER",
    ExpressionAttributeNames:{
      "#phoneNumber": "phoneNumber"
    },
    ExpressionAttributeValues: {
      ":PHONENUMBER": phoneNumber
    }
  };
  docClient.query(params, function(err, data) {
    if (err) {
      // console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      if(data){
        data.Items.forEach(function(item) {
          console.log("Query returns: ", item.pinNumber );
          return item.pinNumber
        });
      }
      else if (data == false){
        console.log("No user associated with that phone number");
          return null
      }
    }
  });
}

function findByPhoneNumber(phoneNumber) {
  var params = {
    TableName : "users",
    KeyConditionExpression: "#phoneNumber = :PHONENUMBER",
    ExpressionAttributeNames:{
      "#pNum": "phoneNumber"
    },
    ExpressionAttributeValues: {
      ":PHONENUMBER": phoneNumber
    }
  };
  docClient.query(params, function(err, data) {
    if (err) {
      // console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      if(data){
        data.Items.forEach(function(item) {
          console.log("Query returns: ", item.userPassword );
        });
      }
      else if (data == false){
        console.log("No user associated with that phone number");
      }
    }
  });
}

function addPin(phoneNumber,pin) {
  var params = {
    TableName:'pins',
    Item:{
      "phoneNumber": phoneNumber,
      "pinNumber": pin
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
}

function addUser(phoneNumber, userPassword, pin) {
  var params = {
    TableName:'users',
    Item:{
      "phoneNumber": phoneNumber,
      "userPassword": userPassword,
    }
  };

  docClient.put(params, function(err, data) {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });
}

function deleteUser(phoneNumber) {
  var params = {
    TableName:'users',
    Key:{
      "phoneNumber": phoneNumber
    }
  };

  console.log("Attempting a conditional delete...");
  docClient.delete(params, function(err, data) {
    if (err) {
      console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
}


module.exports = app;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
