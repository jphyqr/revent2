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
const {data} = event;
console.log({data})
const {object, previous_attributes} = data;
console.log({object})
console.log({previous_attributes})
if(previous_attributes
    &&previous_attributes.legal_entity
    &&previous_attributes.legal_entity.verification
    &&previous_attributes.legal_entity.verification.status==="pending"
    &&object.legal_entity
    &&object.legal_entity.verification
    &&object.legal_entity.verification.status==="verified" ){

        console.log("entered verified")



let accountsRef = admin.database().ref('/stripe_connected_account/');
accountsRef.child('user_uid').orderByChild('account_token').equalTo(event.account).once("value", (snapshot)=> {
    console.log(snapshot.val());
    snapshot.forEach((data)=> {
        console.log({data});

        admin
        .firestore()
        .collection("users")
        .doc(data.key)
        .collection("bank_account_status")
        .doc(event.account)
        .set("verified");


    });
});

    
    }



return  admin.database().ref('/stripe_events').push(event)
.then((snapshot) => {
  // console.log("snapshot.val", snapshot.val())
  return res.json({ received: true, ref: snapshot.ref.toString() });
})
.catch((err) => {
  console.error(err);
  return res.status(500).end();
});


  });
};
