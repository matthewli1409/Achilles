const express = require('express');
const path = require('path');

const db = require('./util/database');
const socket = require('./util/socket');
const dashboardRoutes = require('./routes/dashboard');
const bfxws = require('./models/bfx-ws');


const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(dashboardRoutes);

const server = app.listen(8000 || process.env.PORT , () => {
  console.log(`Connected to Server (Port:${server.address().port})`);
  wsToBfx = new bfxws.BFXws();
  wsToBfx.startSocket(); 
});
const io = socket.initialize(server);

// io.on("connection", function(socket) {
//     console.log("connection is made " + socket.id);
//     socket.broadcast.emit('newUser', 'new user joined');
//   });

// let pool1 = null;

// app.get('/', (req, res, next) => {
//     res.render('dashboard');
// });

// var server = app.listen(8000, function () {
//     // pool1 = db.connection.connect();
//     console.log('Server is running..');
// });


// app.get('/', function (req, res) {

//     var sql = require("mssql");

//     pool1.then(() => {
//         var request = new sql.Request(db.connection);
//         return request.query("SELECT * FROM Trade_Table WHERE Fund_ID = '0003'")
//     })
//     .then(result => {
//         // console.log(result.recordset);
//         fs.writeFile('test.json', JSON.stringify(result.recordset), err => {
//             if(err) throw err;
//             console.log('Data written to file');

//         });
//         const df = new DataFrame(result.recordset);
//         // console.log(df);
//         console.log(df.head(2));
//         // res.send(result);
//     })
//     .catch(err => {
//         res.status(500).send({
//             message: "${err}"
//         });
//         console.log(err);
//     });

// });

