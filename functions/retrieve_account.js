const admin  = require('firebase-admin');
const functions = require("firebase-functions");
const stripe = require('stripe')(functions.config().stripe.token)
const cors = require('cors')({ origin: true });
module.exports = function(req, res){


    return cors(req, res, () => {
     if(req.method !== 'POST') {
      return res.status(401).json({
       message: 'Not allowed'
      })
     }
  if(!req.body.accountToken){
    return res.status(420).json({
        message: 'No Token'
       })
 }
     console.log('v2 body: ' , req.body)


     stripe.accounts.retrieve(
        req.body.accountToken,
        (err, account) =>{
            if(err){
                res.status(500).send({error: 'no account'});
            }
            else{
                res.send({ success: true, account:account });
            }
        }
      );






    })
}
