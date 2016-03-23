$(function() {
    console.log( "ready!" );


    $( "#button_submit" ).click(function() {
//        alert("Phone Number: " + document.getElementById("pNum").value);
        
        $.post("localhost:3000/users",
               {
            name: "Donald Duck",
            city: "Duckburg"
        },
               function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });
    });

});