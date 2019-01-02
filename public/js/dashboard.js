var socket = io.connect("http://localhost:8000");

socket.on('chat', function(data) {
    console.log("inside eosPrice socket");
    console.log(data.message);
    document.getElementById(data.instrument).innerHTML = data.message;
});

socket.on('newUser', function(data){
    console.log("inside new USER");
    console.log(data);
});