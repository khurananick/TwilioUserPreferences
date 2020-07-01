// Required libs
const http          = require("http");
const express       = require("express");
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const request       = require('request');
const multer        = require('multer');
const session       = require('express-session');
const path          = require('path');
const MongoClient   = require('mongodb').MongoClient;
const moment        = require('moment-timezone');

// Global reusable vars.
ObjectID            = require('mongodb').ObjectID;
ENV                 = require('dotenv').config().parsed;
FS                  = require('fs');
STATIC_DIR          = (__dirname + "/static");
NotificationTypes   = [
                        "prescription_refills_tracking",
                        "new_message_from_healthcare_team",
                        "lab_or_test_results_tracking",
                        "claim_or_appeal_status_updates",
                        "appointment_reminders",
                      ];
TwilioClient        = require('twilio')(ENV.TWILIO_ACCOUNT_SID, ENV.TWILIO_AUTH_TOKEN);

// HTTP server settings
const httpApp       = express();
const router        = express.Router();
httpApp.set('views', __dirname + "/app/views");
httpApp.set('view engine', 'pug');
httpApp.use(multer({dest:'./uploads/'}).single('file'));
httpApp.use(express.static(STATIC_DIR,{
  setHeaders: function(res, path) {
    res.setHeader('Access-Control-Allow-Headers', 'accept, authorization, content-type, x-requested-with');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Origin',  '*');
  }
}));
httpApp.use(bodyParser.json({limit: '50mb', parameterLimit: 10000}));
httpApp.use(bodyParser.urlencoded({limit: '50mb', parameterLimit: 10000, extended: true}));
httpApp.use(cookieParser());
httpApp.use(session({
  secret: 'demoapp',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
httpApp.disable('x-powered-by');
httpApp.disable('content-length');
httpApp.disable('content-type');
httpApp.disable('etag');
httpApp.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Headers', 'accept, authorization, content-type, x-requested-with');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Origin',  '*');
  next();
});
httpApp.use('/', router);

// Load models and controllers.
ProfileModel = require('./app/models/profile.js')();
NotificationModel = require('./app/models/notification.js')();
require("./app/controllers/index")(router);
require("./app/controllers/profiles")(router);
require("./app/controllers/notifications")(router);

// Start server.
const httpServer = http.createServer(httpApp).listen(ENV.PORT);
console.log("Listening on port:", ENV.PORT);

(function cronTask() {
  /* run this function at startup */
  (function doPastTasks() {
    const currentTime = moment.tz("America/New_York").format("YYYY-MM-DD hh:mm A");
    // TODO: iterate through all elements in map to find and run jobs that should have already ran.
  })();
  /* looks for jobs  in map that are supposed to run this minute */
  function doTask() {
    const currentTime = moment.tz("America/New_York").format("YYYY-MM-DD hh:mm A");
    // TODO: find jobs in map that need to be run at this time.
  }
  /* starts the interval process that calls doTask function every minute */
  function startCronTask() {
    setInterval(function() {
      doTask();
    }, (1000*60));
    doTask();
  }
  /* when the app starts, this will start the crontask at the top of the next minute */
  setTimeout(function() {
    startCronTask();
  }, ((60 - new Date().getSeconds()) * 1000) /* start at the top of next minute.*/ );
})();
