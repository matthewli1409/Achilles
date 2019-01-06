var socket = io.connect("http://localhost:8000");

socket.on('chat', function(data) {
    console.log(data.message);
    document.getElementById(data.instrument).innerHTML = data.message;
    document.getElementById(data.instrument + '-YTD').innerHTML = data.PnlYtd;
});

socket.on('newUser', function(data){
    console.log("inside new USER");
    console.log(data);
});