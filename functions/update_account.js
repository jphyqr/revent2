const admin = require("firebase-admin");
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.token);
const cors = require("cors")({ origin: true });
const _ = require("lodash");
const assign = require("assign-deep");

function nestObj(keys, val) {
  var o = {},
    k = keys.split(".");
  return (
    k.reduce((r, e, i) => r[e] || (r[e] = k.length - 1 !== i ? {} : val), o), o
  );
}

module.exports = function(req, res) {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }
    if (!req.body.accountToken) {
      return res.status(420).json({
        message: "No Token"
      });
    } else {
      console.log("v1 update_account metadata: ", req.body.metadata);

      let i = 0;
      let stripeObj = {};

      _.forEach(req.body.metadata, (value, key) => {
        if (key !== "TOS") {
          const obj = nestObj(key, value);
          console.log("obj", obj);

          stripeObj = assign(stripeObj, obj);
          i += 1;

          if (i === Object.keys(req.body.metadata).length-1) {
            console.log("end", stripeObj);
               
        return    stripe.accounts.update(
                req.body.accountToken,
                 stripeObj
                 ).then(() => {
           return      res.send({
                  success: true,
                  message: "Saved"
                });
              }, (err) => {
                  console.log(err)
                return res.send({
                  success: false,
                  message: "error"
                });
            });
              }
             }
            
            }
              );
            //   stripe.accounts.update(
            //     req.body.accountToken,
            //     stripeObj,
            //     (err, account) => {
            //       if (err) {
            //         res.status(500).send({ error: err});
            //       } else {
            //           console.log('updated account', account)
            //         res.send({ success: true, account: account });
            //       }
            //     }
            //   );
          }
        })
      }
      
