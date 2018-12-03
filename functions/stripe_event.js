const admin = require("firebase-admin");
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.webhooks.restricted);
const cors = require("cors")({ origin: true });
const endpointSecret = functions.config().stripe.webhooks.secret;

module.exports = function(req, res) {
  return cors(req, res, () => {
    let sig = req.headers["stripe-signature"];

    let event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      endpointSecret
    );

    const { data } = event;
    const { object, previous_attributes } = data;
    if (
      previous_attributes &&
      previous_attributes.legal_entity &&
      previous_attributes.legal_entity.verification &&
      previous_attributes.legal_entity.verification.status === "pending" &&
      object.legal_entity &&
      object.legal_entity.verification &&
      object.legal_entity.verification.status === "verified"
    ) {
      console.log("entered verified");
      console.log("event.account", event.account);
      return admin
        .database()
        .ref("/stripe_connected_account/")
        .orderByChild("account_token")
        .equalTo(event.account)
        .once("value")
        .then(data => {
            console.log('data', data)
            let val = data.val()
            console.log('data.val', val)
            let valObject = val[Object.keys(val)[0]]
            console.log('objectkeys', valObject)

          let uid = valObject.user_uid;

          let token = valObject.account_token
          console.log('uid', uid)
          console.log('token', token)
          return admin
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("bank_account_status")
            .doc(token)
            .set({verified:true});
        })
        .then(() => {
          return admin
            .database()
            .ref("/stripe_events")
            .push(event);
        })
        .then(snapshot => {
          return res.json({ received: true, ref: snapshot.ref.toString() });
        })
        .catch(err => {
          console.error(err);
          return res.status(500).end();
        });
    } else {
      return admin
        .database()
        .ref("/stripe_events")
        .push(event)
        .then(snapshot => {
          return res.json({ received: true, ref: snapshot.ref.toString() });
        })
        .catch(err => {
          console.error(err);
          return res.status(500).end();
        });
    }
  });
};
