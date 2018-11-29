const admin = require("firebase-admin");
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.webhooks.restricted);
const cors = require("cors")({ origin: true });
const endpointSecret = functions.config().stripe.webhooks.secret;


module.exports = function(req, res) {
  return cors(req, res, () => {


  let sig = req.headers["stripe-signature"];

 let event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)

    console.log({event})
return  admin.database().ref('/stripe_events').push(event)
.then((snapshot) => {
    console.log({snapshot})
  return res.json({ received: true, ref: snapshot.ref.toString() });
})
.catch((err) => {
  console.error(err);
  return res.status(500).end();
});


  });
};
