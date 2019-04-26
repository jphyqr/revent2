const twilio = require('twilio');
const functions = require("firebase-functions");

const TWILIO_ACCOUNT_SID = functions.config().twilio.sid;
const TWILIO_AUTH_TOKEN = functions.config().twilio.token;


module.exports = new twilio.Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
