var client = require("twilio")('AC88516c3faacacf67fd1b8279332f7be5','9182d28c8c98497a93c01bb4c16db5d0');

client.sendMessage({
    to: '+12693034073',
    from: '+12692206313',
    body: 'Youre gay'
}, function (err,data) {

    if(err)
        console.log(err);
    console.log(data);
})