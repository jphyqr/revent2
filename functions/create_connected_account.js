const admin = require("firebase-admin");
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.token);
const cors = require("cors")({ origin: true });
module.exports = function(req, res) {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }
    if (!req.body.countryCode) {
      return res.status(420).json({
        message: "No Country Code"
      });
    }
    if (!req.body.userUID) {
        return res.status(420).json({
          message: "No User UID"
        });
      }
    console.log("v1 creating a connected account body: ", req.body);


     stripe.accounts
      .create({
        type: "custom",
        country: req.body.countryCode
      })
      .then(account => {
        console.log("creating account");
        console.log({ account });
        const accountObj = {account_token : account.id, user_uid : req.body.userUID}
         admin
          .database()
          .ref(`/stripe_connected_account/${req.body.userUID}/`)
          .set(accountObj);
          return res.send({ success: true, account:account });
      }).catch(error => {
        return res.status(500).send({ success:false, error: err });
      });








  });
};
