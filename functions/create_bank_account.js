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
    if (!req.body.params) {
      return res.status(420).json({
        message: "No Params"
      });
    }
    console.log("v2 create external bank account body: ", req.body);

    stripe.tokens.create(
      {
        bank_account: req.body.params
      },
      (err, token) => {
        if (err) {
          return res.status(500).send({ error: err });
        } else {
          return res.send({ success: true, token: token });
        }
      }
    );
  });
};
