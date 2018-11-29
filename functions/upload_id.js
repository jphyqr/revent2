const admin = require("firebase-admin");
const functions = require("firebase-functions");
const stripe = require("stripe")(functions.config().stripe.token);
const cors = require("cors")({ origin: true });

const path = require("path");
const os = require("os");
const fs = require("fs");

const { Storage } = require("@google-cloud/storage");
const gcs = new Storage();
const bucketPath = "revents-99d5b.appspot.com";
const bucket = gcs.bucket(bucketPath);

module.exports = function(req, res) {
  return cors(req, res, () => {
    console.log("v4 upload file: ", req.body);
    if (req.method !== "POST") {
      return res.status(401).json({
        message: "Not allowed"
      });
    }

    let tempFilePath = path.join(os.tmpdir(), "tempkjhgfhjnmbvgh.docx");
    let fileName = `${req.body.userUID}/verification_document/${
      req.body.fileName
    }`;

    return bucket
      .file(fileName)
      .download({
        destination: tempFilePath
      })
      .then(() => {
        console.log(fileName + " downloaded locally to", tempFilePath);
        let content = fs.readFileSync(tempFilePath, "binary");

        // do stuff with the file and data from req.body
        console.log({ content });

        const fp = fs.readFileSync(tempFilePath);

        return stripe.files.create(
          {
            purpose: "identity_document",
            file: {
              data: fp,
              name: req.body.fileName,
              type: "image/jpeg"
            }
          },
          (err, fileToken) => {
            if (err) {
              console.log("error", err);
              return res.status(500).send({ error: err });
            } else {
              console.log({ fileToken });
              return res.send({ success: true, token: fileToken.id });
            }
          }
        );
      });
  });
};
