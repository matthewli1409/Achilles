const sio = require('socket.io');
let io = null;

exports.io = () => {
    return io;
};

exports.initialize = server => {
    return io = sio(server);
};