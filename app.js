const express = require('express');
const path = require('path');

const db = require('./util/database');
const pnlCals = require('./models/pnl');
const socket = require('./util/socket');
const dashboardRoutes = require('./routes/dashboard');
const bfxws = require('./models/bfx-ws');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(dashboardRoutes);

const server = app.listen(8000 || process.env.PORT, () => {
	console.log(`Connected to Server (Port:${server.address().port})`);
	wsToBfx = new bfxws.BFXws();
	wsToBfx.startSocket();
	db.mongoConnect(() => {
		pnlCals.setInitialPriceArray();
	});

});
const io = socket.initialize(server);