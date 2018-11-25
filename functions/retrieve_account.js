const admin  = require('firebase-admin');
const functions = require("firebase-functions");
const stripe = require('stripe')(functions.config().stripe.token)
const cors = require('cors')({ origin: true });
module.exports = function(req, res){

//     console.log('v3 retrieve account',req.body)
//   //verify the user provided a token
//   if(!req.body.accountToken){
//      res.status(422).send({error: 'bad input'});
//   }




//   stripe.accounts.retrieve(
//     req.body.accountToken,
//     (err, account) =>{
//         if(err){
//             res.status(500).send({error: 'no account'});
//         }
//         else{
//             res.send({ success: true, account:account });
//         }
//     }
//   );
// }


//exports.addItem = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
     if(req.method !== 'POST') {
      return res.status(401).json({
       message: 'Not allowed'
      })
     }
     //verify the user provided a token
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







    //  database.push({ item });
    //  let items = [];
    //  return database.on('value', (snapshot) => {
    //   snapshot.forEach((item) => {
    //    items.push({
    //     id: item.key,
    //     items: item.val().item
    //    });
    //   });
    //   res.status(200).json(items)
    //  }, (error) => {
    //   res.status(error.code).json({
    //    message: `Something went wrong. ${error.message}`
    //   })
    //  })
    })
}
  // })