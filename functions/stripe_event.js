const admin = require("firebase-admin");
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.webhooks.restricted);
const cors = require("cors")({ origin: true });
const endpointSecret = functions.config().stripe.webhooks.secret;
const cuid = require("cuid");
module.exports = function(req, res) {
  return cors(req, res, () => {
    let sig = req.headers["stripe-signature"];

    let event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      endpointSecret
    );
    let uid;
    let webTokens = [];
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
          console.log("data", data);
          let val = data.val();
          console.log("data.val", val);
          let valObject = val[Object.keys(val)[0]];
          console.log("objectkeys", valObject);

          uid = valObject.user_uid;

          let token = valObject.account_token;
          console.log("uid", uid);
          console.log("token", token);

          return admin
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("bank_account_status")
            .doc(token)
            .set({ verified: true });
        })
        .then(() => {
          return admin
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("web_push_token")
            .get();
        })
        .then(webTokenSnapShot => {
          const snapShot = webTokenSnapShot;
          snapShot.forEach(webToken => {
            webTokens.push(webToken.data().tokenUID);
            console.log({ webTokens });
          });
          console.log({ webTokens });
          return webTokens;
        })
        .then(webTokens => {
          console.log("webTokens", webTokens);

          const payload = {
            notification: {
              title: "Stripe Verified",
              body: "Your account has been verified"
            }
          };
          webTokens.forEach(webToken => {
            admin.messaging().sendToDevice(webToken, payload);
          });

          return payload;
        })
        .then(payload => {
          const newNotification = {
            type: "stripeSuccess",
            title: payload.notification.title,
            description: payload.notification.body,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          };
          console.log("add uid", uid);
          return admin
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("notifications")
            .add(newNotification);
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
    } else if (
      previous_attributes &&
      previous_attributes.legal_entity &&
      previous_attributes.legal_entity.verification &&
      previous_attributes.legal_entity.verification.status === "pending" &&
      object.legal_entity &&
      object.legal_entity.verification &&
      object.legal_entity.verification.status === "unverified"
    ) {
      console.log("entered pending=> unverified");
      console.log("event.account", event.account);
      return admin
        .database()
        .ref("/stripe_connected_account/")
        .orderByChild("account_token")
        .equalTo(event.account)
        .once("value")
        .then(data => {
          console.log("data", data);
          let val = data.val();
          console.log("data.val", val);
          let valObject = val[Object.keys(val)[0]];
          console.log("objectkeys", valObject);

          uid = valObject.user_uid;

          let token = valObject.account_token;
          console.log("uid", uid);
          console.log("token", token);

          return admin
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("bank_account_status")
            .doc(token)
            .set({ verified: false });
        })

        .then(() => {
          return admin
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("web_push_token")
            .get();
        })
        .then(webTokenSnapShot => {
          const snapShot = webTokenSnapShot;
          snapShot.forEach(webToken => {
            webTokens.push(webToken.data().tokenUID);
            console.log({ webTokens });
          });
          console.log({ webTokens });
          return webTokens;
        })
        .then(webTokens => {
          console.log("webTokens", webTokens);

          const payload = {
            notification: {
              title: "Stripe needs more Information",
              body: "Your account was not verfied"
            }
          };
          //REFACTOR should make a device group for each user and send to group
          webTokens.forEach(webToken => {
            console.log('sending to token', webToken)
            admin.messaging().sendToDevice(webToken, payload)
            
         
          });
          return payload;
        })
        .then(payload => {
          const newNotification = {
            type: "stripeFail",
            title: payload.notification.title,
            description: payload.notification.body,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          };
          const notificationUID = cuid();
          console.log("pending add uid", uid);
          return admin
            .firestore()
            .collection("users")
            .doc(uid)
            .collection("notifications")
            .add(newNotification);
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
