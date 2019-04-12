const admin = require("firebase-admin");
const functions = require("firebase-functions");

const cors = require("cors")({ origin: true });
module.exports = function(req, res) {
  return cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }


  console.log(req.body)




  });
};
