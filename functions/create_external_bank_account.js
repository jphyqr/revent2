const admin = require("firebase-admin");
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.token);
const cors = require("cors")({ origin: true });
module.exports = function(req, res) {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.send({ success: false, message: "Only Post Requests" });
    }
    if (!req.body.accountToken) {
      return res.send({ success: false, message: "No Account Token" });
   
    }
    if (!req.body.bankToken) {
      return res.send({ success: false, message: "No Bank Token" });
   
    }
    console.log("v2 create external bank account body: ", req.body);

    stripe.accounts.createExternalAccount(
      req.body.accountToken,
      {external_account:req.body.bankToken}
      ,
      (err, bankAccount) => {
        if (err) {
          return res.status(500).send({ error: err });
        } else {
          return res.send({ success: true, bankAccount: bankAccount });
        }
      }
    );
  });
};
