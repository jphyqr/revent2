const admin  = require('firebase-admin');
const functions = require("firebase-functions");



const cors = require('cors')({ origin: true });
module.exports = function(req, res){
     var registrationToken = 'c3LR2WzXuSA:APA91bHS_K99ufUX1OaFLb5zfGIbiPRAGC5PovyXtOo7v-lXvyOemlFAK4KCJMCIurckb2iQS8tWR238kApeplYqsASL3TbfYH0aWqdqCXq1ibQIluFb0ERiQi-qlRcVrCYzPCYTpPbE'
    return cors(req, res, () => {
     if(req.method !== 'POST') {
      return res.status(401).json({
       message: 'Not allowed'
      })
     }
  
     var message = {
        data: {
          score: '850',
          time: '2:45'
        },
        token: registrationToken
      };



      const payload = {
        notification: {
            title: "title",
            body: "body"
        }
    };

    admin.messaging().sendToDevice(registrationToken, payload)
        .then( (response)=> {
            console.log("Successfully sent message:", response);
            return res.send({
                success: true,
                message: response
              });
        })
        .catch((error) =>{
            console.log("Error sending message:", error);
            return res.send({
                success: false,
                message: error
              });
        });
      
      // Send a message to the device corresponding to the provided
      // registration token.
    //   admin.messaging().send(message)
    //     .then((response) => {
    //       // Response is a message ID string.
    //       console.log('Successfully sent message:', response);
    //       return res.send({
    //         success: true,
    //         message: response
    //       });
    //     })
    //     .catch((error) => {
    //       console.log('Error sending message:', error);
    //       return res.send({
    //         success: false,
    //         message: error
    //       });
    //     });





    })
}
