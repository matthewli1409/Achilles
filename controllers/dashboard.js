const soi = require('../util/socket');
const db = require('../util/database')
// const bfxws = require('../models/bfx-ws');

// exports.getIndex = (req, res, next) => {

//     bfxws.bfxInit();
//     soi.io().on("connection", function(socket) {
//         console.log("connection is made " + socket.id);
//         socket.broadcast.emit('newUser', 'new user joined');
//       });

//     res.render('dashboard');
// };

exports.getIndex = (req, res, next) => {

    // wsToBfx = new bfxws.BFXws();
    // wsToBfx.startSocket(); 
    soi.io().on("connection", function (socket) {
        console.log("connection is made " + socket.id);
        socket.broadcast.emit('newUser', 'new user joined');
    });

    res.render('dashboard');
    // db.getDb().collection('Trade').insertOne({name: 'a book', price: 200})
};