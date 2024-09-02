const express = require("express")
const cors = require("cors")
const fs = require("fs")

const schedule = require("node-schedule");
const garmin = require("./utils/updateGarmin");

// Update the garmin users every hour, at hh:58
const job = schedule.scheduleJob('58 * * * *', function(){
    garmin.update();
});

const { HTTP_HOST } = process.env;
if (HTTP_HOST) {
	var http=require('http');
} else {
	var https = require('https');
}

var indexRouter = require('./routes/index');
var restRouter = require('./routes/rest');

var app = express();

if (HTTP_HOST) {
	http.createServer(app).listen(HTTP_HOST);
} else {
	const options={
		key:	fs.readFileSync('/etc/letsencrypt/live/vps.urwick.co.uk/privkey.pem'),
		cert:	fs.readFileSync('/etc/letsencrypt/live/vps.urwick.co.uk/fullchain.pem')
	}
	https.createServer(options,app).listen(9443);
}

app.set('view engine', 'pug');

app.use(cors({
        origin: '*'
}));
app.use('/', indexRouter);
app.use('/rest',restRouter);
app.use(express.static('node_modules/materialize-css/dist'));

module.exports = app;

