var client = require("twilio")('','');

client.sendMessage({
    to: '',
    from: '',
    body: 'Test Body'
}, function (err,data) {

    if(err)
        console.log(err);
    console.log(data);
})