const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const stripe = require("stripe")(functions.config().stripe.token);
const logging = require("@google-cloud/logging");
const currency = functions.config().stripe.currency || "USD";
const retrieveAccount = require("./retrieve_account.js");
const stripeEvent = require("./stripe_event.js");
const SENDGRID_API_KEY = functions.config().sendgrid.key;
const Distance = require("geo-distance");
const twilio = require("./twilio");
const sharp = require("sharp");
const sgClient = require("@sendgrid/client");
sgClient.setApiKey(SENDGRID_API_KEY);
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(SENDGRID_API_KEY);
sgMail.setSubstitutionWrappers("-", "-");

const testFCM = require("./test_fcm.js");
const createExternalBankAccount = require("./create_external_bank_account.js");
const createConnectedAccount = require("./create_connected_account.js");
const createBankAccount = require("./create_bank_account.js");
const sendgridWebhook = require("./sendgrid_webhook.js");
const axios = require("axios");
const uploadID = require("./upload_id.js");
const updateAccount = require("./update_account.js");
const { tmpdir } = require("os");
//const fs = require("fs-extra");

const { join, dirname } = require("path");
const { Storage } = require("@google-cloud/storage");

const gcs = new Storage();

const mkdirp = require("mkdirp-promise");
const spawn = require("child-process-promise").spawn;
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const path = require("path");
const os = require("os");
const fs = require("fs");
const fse = require("fs-extra");
const db = admin.firestore();
const THUMB_MAX_WIDTH = 300;
const THUMB_MAX_HEIGHT = 150;

const newFollow = (type, event, id) => {
  return {
    type: type,
    followerId: id,
    photoURL: event.hostPhotoURL,
    displayName: event.displayName
  };
};

const newActivity = (type, event, id) => {
  return {
    type: type,
    eventDate: event.date,
    hostedBy: event.hostedBy,
    title: event.title,
    photoURL: event.hostPhotoURL,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    hostUid: event.hostUid,
    eventId: id
  };
};

const createMessage = (type, message) => {
  return {
    type: type,
    date: message.date,
    displayName: message.displayName,
    photoURL: message.photoURL,
    text: message.text,
    uid: message.uid
  };
};

exports.generateThumbnail = functions.storage.object().onFinalize(object => {
  // [END generateThumbnailTrigger]
  // [START eventAttributes]
  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.
  // [END eventAttributes]

  // [START stopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith("image/")) {
    return console.log("This is not an image.");
  }

  // Get the file name.
  const fileName = path.basename(filePath);
  // Exit if the image is already a thumbnail.
  if (fileName.startsWith("thumb_")) {
    return console.log("Already a Thumbnail.");
  }
  // [END stopConditions]

  // [START thumbnailGeneration]
  // Download file from bucket.
  const bucket = admin.storage().bucket(fileBucket);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const metadata = {
    contentType: contentType
  };
  return bucket
    .file(filePath)
    .download({ destination: tempFilePath })
    .then(() => {
      console.log("Image 1 downloaded locally to", tempFilePath);
      // Generate a thumbnail using ImageMagick.
      return spawn("convert", [
        tempFilePath,
        "-resize",
        "400X400>",
        tempFilePath
      ]);
    })

    .then(() => {
      console.log("Thumbnail 1 created at", tempFilePath);

      // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
      const thumbFileName = `thumb_200_200_${fileName}`;
      const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
      return bucket.upload(tempFilePath, {
        destination: thumbFilePath,
        metadata: metadata
      });
    })
    .then(() => {
      console.log("Image  2 downloaded locally to", tempFilePath);
      // Generate a thumbnail using ImageMagick.
      return spawn("convert", [
        tempFilePath,
        "-resize",
        "100x100>",
        tempFilePath
      ]);
    })
    .then(() => {
      console.log("Thumbnail 2 created at", tempFilePath);

      // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
      const thumbFileName = `thumb_400_400_${fileName}`;
      const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
      return bucket.upload(tempFilePath, {
        destination: thumbFilePath,
        metadata: metadata
      });
    })
    .then(() => {
      return fs.unlinkSync(tempFilePath);
    })
    .catch(error => {
      console.log({ error });
    });

  // Once the thumbnail has been uploaded delete the local file to free up disk space.

  // [END thumbnailGeneration]
});

exports.generateThumbs = functions.storage
  .object()
  .onFinalize((object, context) => {
    // console.log({ object });
    // const bucket = gcs.bucket(object.bucket); //tell which bucket to use, use bucket triggered function
    // const filePath = object.name;
    // const fileName = filePath.split("/").pop();
    // const contentType = object.contentType;
    // console.log({fileName})
    // const bucketDir = dirname(filePath);
    // console.log({bucketDir})
    // //download src file to local directory and store thumbs
    // const workingDir = join(tmpdir(), "thumbs");
    // console.log({workingDir})
    // const tmpFilePath = join(workingDir, fileName);
    // console.log({tmpFilePath})
    // //stop infinite loop w name trigger
    // //exit if triggered from file already resized
    // if (
    //   fileName.includes("thumb@") ||
    //   !(
    //     object.contentType.includes("image")
    // ) ){
    //   console.log("exiing function");
    //   return false;
    // }
    // //ensure dir exists
    // fse.ensureDir(workingDir)
    //   .then(dir => {
    //     //download source file
    //     return bucket.file(filePath).download({
    //       destination: tmpFilePath
    //     });
    //   })
    //   .then(download => {
    //     //resize the images and define array of upload promises
    //     const sizes = [65, 128, 256];
    //     for (var i = 0; i < sizes.length; i++) {
    //       const size = sizes[i];
    //       const thumbName = `thumb@${size}_${fileName}`;
    //       const thumbPath = join(workingDir, thumbName);
    //       const metadata = { contentType : contentType }
    //       sharp.cache(false)
    //       console.log({thumbPath})
    //       console.log('size', size)
    //        sharp(tmpFilePath)
    //         .resize(size, size)
    //         .toFile(thumbPath)
    //         .then(() => {
    //           return bucket.upload(thumbPath, {
    //             destination: join(bucketDir, thumbName),
    //             metadata:metadata
    //           });
    //         })    .catch(error => {
    //           console.log("error", error);
    //         });
    //     }
    //     return fse.remove(workingDir);
    //   })
    //   .catch(error => {
    //     console.log("error", error);
    //     // We want to capture errors and render them in a user-friendly way, while
    //     // still logging an exception with StackDriver
    //     return snap.ref.child("error").set(userFacingMessage(error));
    //   });
  });

exports.sendgridWebhook = functions.https.onRequest(sendgridWebhook);

exports.testFCM = functions.https.onRequest(testFCM);

exports.uploadID = functions.https.onRequest(uploadID);

exports.createExternalBankAccount = functions.https.onRequest(
  createExternalBankAccount
);

exports.createBankAccount = functions.https.onRequest(createBankAccount);

exports.retrieveAccount = functions.https.onRequest(retrieveAccount);

exports.updateAccount = functions.https.onRequest(updateAccount);
exports.createConnectedAccount = functions.https.onRequest(
  createConnectedAccount
);

exports.stripeEvent = functions.https.onRequest(stripeEvent);

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate(user => {
  console.log("Stripe Customer function reached");
  console.log({ user });
  return stripe.customers
    .create({
      email: user.email
    })
    .then(customer => {
      console.log("Stripe Customer created");
      console.log({ customer });
      return admin
        .database()
        .ref(`/stripe_customers/${user.uid}/customer_id`)
        .set(customer.id);
    });
});

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(user => {
  return admin
    .database()
    .ref(`/stripe_customers/${user.uid}`)
    .once("value")
    .then(snapshot => {
      return snapshot.val();
    })
    .then(customer => {
      console.log("Stripe Customer delete reached");
      console.log({ customer });
      return stripe.customers.del(customer.customer_id);
    })
    .then(() => {
      return admin
        .database()
        .ref(`/stripe_customers/${user.uid}`)
        .remove();
    });
});

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeCharge = functions.database
  .ref("/stripe_customers/{userId}/charges/{id}")
  .onCreate((snap, context) => {
    const val = snap.val();
    // Look up the Stripe customer id written in createStripeCustomer
    return admin
      .database()
      .ref(`/stripe_customers/${context.params.userId}/customer_id`)
      .once("value")
      .then(snapshot => {
        console.log("snap.val", snapshot.val());
        return snapshot.val();
      })
      .then(customer => {
        // Create a charge using the pushId as the idempotency key
        // protecting against double charges
        console.log(" Create Stripe Charge: Customer found");
        console.log({ customer });
        const amount = val.amount;
        const idempotencyKey = context.params.id;
        const charge = { amount, currency, customer };
        if (val.source !== null) {
          charge.source = val.source;
        }

        return stripe.charges.create(charge, {
          idempotency_key: idempotencyKey
        });
      })
      .then(response => {
        // If the result is successful, write it back to the database
        console.log(" Charge success");
        console.log({ response });
        return snap.ref.set(response);
      })
      .catch(error => {
        // We want to capture errors and render them in a user-friendly way, while
        // still logging an exception with StackDriver
        return snap.ref.child("error").set(userFacingMessage(error));
      })
      .then(() => {
        return reportError(error, { user: context.params.userId });
      });
  });
// [END chargecustomer]]

// Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
exports.addPaymentSource = functions.database
  .ref("/stripe_customers/{userId}/sources/{pushId}/token")
  .onWrite((change, context) => {
    const source = change.after.val();
    console.log("Stripe Payment source reached v8");
    console.log({ source });
    if (source === null) {
      return null;
    }

    return admin
      .database()
      .ref(`/stripe_customers/${context.params.userId}/customer_id`)
      .once("value")
      .then(snapshot => {
        const val = snapshot.val();
        console.log({ val });
        return snapshot.val();
      })
      .then(customer => {
        console.log({ customer });
        return stripe.customers.createSource(customer, { source });
      })
      .then(
        response => {
          return change.after.ref.parent.set(response);
        },
        error => {
          return change.after.ref.parent
            .child("error")
            .set(userFacingMessage(error));
        }
      )
      .then(() => {
        return reportError(error, { user: context.params.userId });
      });
  });

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = "errors";
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: "cloud_function",
      labels: { function_name: process.env.FUNCTION_NAME }
    }
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: "cloud_function"
    },
    context: context
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), error => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}
// [END reporterror]

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type
    ? error.message
    : "An error occurred, developers have been alerted";
}

exports.newUser = functions.firestore
  .document("users/{newUserUid}")
  .onCreate((info, context) => {
    const newUserUid = context.params.newUserUid;
    console.log("v2 newUser");
    const adminId = "QCQUWoSTnONyaiPfvOCleawwyK93";

    let threadId = "";
    if (newUserUid < adminId) {
      threadId = `${newUserUid}_${adminId}`;
    } else {
      threadId = `${adminId}_${newUserUid}`;
    }

    try {
      const message =
        "Welcome to Yaybour. I am the admin for this Region,  You can contact me directly here.";

      let welcomeMessage = {
        displayName: "Admin",
        photoURL: "/assets/user.png",
        uid: adminId,
        text: message,
        date: Date.now()
      };

      admin
        .database()
        .ref(`direct_messages/${threadId}`)
        .push(welcomeMessage);

      const nowMessaging = {
        id: adminId,
        photoURL: "/assets/user.png",
        city: "Regina",
        displayName: "Admin",
        newMessage: false
      };

      console.log({ nowMessaging });

      admin
        .firestore()
        .collection("users")
        .doc(newUserUid)
        .collection("messaging")
        .doc(adminId)
        .set(nowMessaging);

      let userRecord = admin
        .auth()
        .getUser(newUserUid)
        .then(userRecord => {
          console.log(userRecord);

          return userRecord;
        });

      return admin
        .firestore()
        .collection("users")
        .doc(newUserUid)
        .collection("last_message")
        .doc(newUserUid)
        .set(nowMessaging);
    } catch (error) {
      console.log({ error });
    }
  });

exports.unfollowUser = functions.firestore
  .document("users/{unfollowerUid}/following/{unfollowedUid}")
  .onDelete((info, context) => {
    const unfollowerUid = context.params.unfollowerUid;
    const unfollowedUid = context.params.unfollowedUid;
    console.log("v1");
    return admin
      .firestore()
      .collection("users")
      .doc(unfollowedUid)
      .collection("followers")
      .doc(unfollowerUid)
      .delete()
      .then(() => {
        return console.log("doc deleted");
      });
  });

exports.dispatchTask = functions.firestore
  .document("jobs/{jobID}")
  .onWrite((info, context) => {
    const jobID = context.params.jobID;
    const after = info.after.data();
    const before = info.before.data();

    console.log("dispatchTask job id", jobID);
    console.log("dispatch job info", info.after.data());
    console.log("beforeInDraft", before.inDraft);
    console.log("afterInDraft", after.inDraft);
    if (before.inDraft === true && after.inDraft === false) {
      const payload = {
        notification: {
          title: `New ${after.title} job`,
          body: after.title
        }
      };
      return admin
        .messaging()
        .sendToTopic(`/topics/${after.taskID}`, payload)
        .then(response => {
          console.log("notification sent successfuly:", response);
          return after.taskID;
        })
        .then(taskID => {
          //add a notification to all of the users who follow this task
          //REFACTOR can probably combine these 3 into one call
          return admin.firestore().collection("task_subscribed");
        })
        .then(taskSubscribedRef => {
          console.log({ taskSubscribedRef });
          return taskSubscribedRef.where("taskId", "==", after.taskID);
        })
        .then(taskSubscribedQuery => {
          console.log({ taskSubscribedQuery });
          return taskSubscribedQuery.get();
        })

        .then(taskSubscirbedQuerySnap => {
          let batch = admin.firestore().batch();
          console.log("snap length", taskSubscirbedQuerySnap.docs.length);
          for (let i = 0; i < taskSubscirbedQuerySnap.docs.length; i++) {
            //change this for user ref??
            let data = taskSubscirbedQuerySnap.docs[i].data();
            console.log("taskSibQierySnapd.docs[i].data()", data);
            let subscriberUserDocRef = admin
              .firestore()
              .collection("users")
              .doc(data.userUid)
              .collection("notifications")
              .doc();

            batch.set(subscriberUserDocRef, {
              type: "newJob",
              jobId: jobID,
              title: after.title,
              description: after.title,
              photoURL: data.photoURL,
              created: data.created,
              timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
          }
          return batch;
        })
        .then(batch => {
          return batch.commit();
        })

        .catch(error => {
          console.log("notification sent failed:", error);
        });
    }

    return info.after.data();
  });

exports.unsubscribeFromTask = functions.firestore
  .document("task_subscribed/{taskSubscriptionId}")
  .onDelete((info, context) => {
    const unsubscribedTaskId = context.params.taskSubscriptionId;
    console.log("unsubscribedFromTask", unsubscribedTaskId);
    const split = unsubscribedTaskId.split("_");
    const userUID = split[1];
    const taskUID = split[0];
    console.log({ userUID });
    console.log({ taskUID });
    let webTokens = [];
    return admin
      .firestore()
      .collection("users")
      .doc(userUID)
      .collection("web_push_token")
      .get()
      .then(webTokenSnapShot => {
        const snapShot = webTokenSnapShot;
        snapShot.forEach(webToken => {
          webTokens.push(webToken.data().tokenUID);
          console.log({ webTokens });
        });
        console.log({ webTokens });
        return webTokens;
      })
      .then(webTokens => {
        return admin.messaging().unsubscribeFromTopic(webTokens, taskUID);
      })
      .then(response => {
        console.log("successfuly unsubscribed from topic", response);
        return response;
      })
      .catch(error => console.log(error));
  });

exports.subscribeToTask = functions.firestore
  .document("task_subscribed/{taskSubscriptionId}")
  .onCreate((info, context) => {
    const taskSubscriptionId = context.params.taskSubscriptionId;
    const split = taskSubscriptionId.split("_");
    const userUID = split[1];
    const taskUID = split[0];
    console.log({ userUID });
    console.log({ taskUID });
    let webTokens = [];

    return admin
      .firestore()
      .collection("users")
      .doc(userUID)
      .collection("web_push_token")
      .get()
      .then(webTokenSnapShot => {
        const snapShot = webTokenSnapShot;
        snapShot.forEach(webToken => {
          webTokens.push(webToken.data().tokenUID);
          console.log({ webTokens });
        });
        console.log({ webTokens });
        return webTokens;
      })
      .then(webTokens => {
        return admin.messaging().subscribeToTopic(webTokens, taskUID);
      })
      .then(response => {
        console.log("successfuly subscribed to topic", response);
        return response;
      })
      .catch(error => console.log(error));
  });

exports.messageUser = functions.firestore
  .document("users/{senderId}/messaging/{receiverId}")
  .onWrite((info, context) => {
    const senderId = context.params.senderId;
    const receiverId = context.params.receiverId;
    const before = info.before.data();
    const after = info.after.data();

    if (before.newMessage === true || after.newMessage === true) {
      console.log("just flipped flag, skip rest");
    } else {
      console.log("v6");
      const senderDoc = admin
        .firestore()
        .collection("users")
        .doc(senderId);
      console.log("messageUser");
      console.log({ info });
      console.log({ context });
      console.log({ before });
      console.log({ after });
      console.log({ senderId });
      console.log({ receiverId });
      console.log({ senderDoc });
      return senderDoc.get().then(doc => {
        let userData = doc.data();
        let receivingMessagesFrom = {
          displayName: userData.displayName,
          photoURL: userData.photoURL || "/assets/user.png",
          city: userData.city || "Unknown City",
          id: senderId,
          newMessage: true,
          date: new Date(Date.now())
        };

        console.log({ receivingMessagesFrom });
        return admin
          .firestore()
          .collection("users")
          .doc(receiverId)
          .collection("messaging")
          .doc(senderId)
          .set(receivingMessagesFrom);
      });
    }
  });

exports.followUser = functions.firestore
  .document("users/{followerUid}/following/{followingUid}")
  .onCreate((info, context) => {
    const followingUid = context.params.followingUid;
    const followerUid = context.params.followerUid;
    console.log("v1");
    const followerDoc = admin
      .firestore()
      .collection("users")
      .doc(followerUid);

    console.log(followerDoc);

    return followerDoc.get().then(doc => {
      let userData = doc.data();
      console.log({ userData });

      let follower = {
        displayName: userData.displayName,
        photoURL: userData.photoURL || "/assets/user.png",
        city: userData.city || "Unknown City"
      };
      return admin
        .firestore()
        .collection("users")
        .doc(followingUid)
        .collection("followers")
        .doc(followerUid)
        .set(follower);
    });
  });

exports.createActivity = functions.firestore
  .document("events/{eventId}")
  .onCreate(event => {
    let newEvent = event.data();
    console.log(newEvent);
    const activity = newActivity("newEvent", newEvent, event.id);

    console.log(activity);

    return admin
      .firestore()
      .collection("activity")
      .add(activity)
      .then(docRef => {
        return console.log("Activity created with ID: ", docRef.id);
      })
      .catch(err => {
        return console.log("Error adding activity", err);
      });
  });

exports.cancelActivity = functions.firestore
  .document("events/{eventId}")
  .onUpdate((event, context) => {
    let updatedEvent = event.after.data();
    let previousEventData = event.before.data();

    console.log({ event });
    console.log({ context });
    console.log({ updatedEvent });
    console.log({ previousEventData });

    if (
      !updatedEvent.cancelled ||
      updatedEvent.cancelled === previousEventData.cancelled
    )
      return false;

    const activity = newActivity(
      "cancelledEvent",
      updatedEvent,
      context.params.eventId
    );
    console.log({ activity });

    return admin
      .firestore()
      .collection("activity")
      .add(activity)
      .then(docRef => {
        return console.log("Activity created with ID: ", docRef.id);
      })
      .catch(err => {
        return console.log("Error adding activity", err);
      });
  });

exports.homeShowJoin = functions.database
  .ref("/join_beta/{joinId}")
  .onCreate(event => {
    console.log("Home Show join v1");
    let newEvent = event.val();
    console.log(newEvent);
    //const activity = newActivity("newEvent", newEvent, event.id);

    //console.log(activity);

    const msg = {
      to: newEvent.email,
      from: "admin@yaybour.com",
      subject: "Welcome to YaYbour!",
      templateId: "d-34b370f795424cf99b2e35044a14916c",
      reply_to: "admin@yaybour.com",
      //  content: [{"type":"text/html","value":"0"}],
      //  html: ' ',
      substitutionWrappers: ["{{", "}}"],
      substitutions: {
        name: "New Yaybour",
        city: "Regina"
      }
    };

    return sgMail
      .send(msg)
      .then(() => console.log("email sent"))
      .catch(err => {
        const { message, code, response } = error;
        const { headers, body } = response;
        console.log({ body });
        console.log(err.toString());
      });
  });

const objectToArray = object => {
  if (object) {
    return Object.keys(object).map(function(key) {
      return Object.assign({ key: key }, { value: object[key] });
      //    return [, ];
    });
  }
};

const renderJobDescription = (job, jobId) => {
  let photos = job.jobPhotos || [];
  let photoList = "";
  for (var j = 0; j < photos.length; j++) {
    let photoUrl = photos[j].url;
    photoList += `<br><img src=${photoUrl} alt="Smiley face" height="200" width="200">`;
  }

  let fieldList = "";

  for (var i = 0; i < job.customFields.length; i++) {
    fieldList += `<br><p> ${job.customFields[i].fieldName}: ${
      job.customFields[i].fieldData
    }</p>`;
  }

  let customList = "";

  for (var k = 0; k < job.customMaterials.length; k++) {
    const material = job.customMaterials[k];
    customList += `<br><p> ${material.fieldName}: ${material.itemData
      .productName || "No Name"}</p>`;
    customList += `<br><p> ${material.itemData.price || "No Price"}: ${material
      .itemData.pricingUnit || "No Unit"}</p>`;
    customList += `<br><p> ${(material.itemData.supplierData &&
      material.itemData.supplierData.storeName) ||
      "No Store"}</p>`;
  }

  return [
    `<div style="width:200px;background:#F9EECF;border:1px dotted black;text-align:center">
     <p>Generic content...</p>
     </div><p>Description: ${
       job.description
     }</p><br/><h2>Job Details</h2>${fieldList}
     <h2>Material Details</h2>${customList}<h2>Job Photos</h2>${photoList}
     <br/>
     
     <a href="https://yaybour.com/job/${jobId}">More Info</a>
     `
  ];
};

exports.dispatchTaskToEmail = functions.firestore
  .document("jobs/{jobID}")
  .onWrite((info, context) => {
    const jobID = context.params.jobID;
    const after = info.after.data();
    const before = info.before.data();

    console.log("dispatchTask job id", jobID);
    console.log("dispatch job info", info.after.data());
    console.log("beforeInDraft", before.inDraft);
    console.log("afterInDraft", after.inDraft);
    if (before.inDraft === true && after.inDraft === false) {
      return admin
        .firestore()
        .collection("task_subscribed")
        .where("taskId", "==", after.taskID)
        .get()

        .then(taskSubscirbedQuerySnap => {
          for (let i = 0; i < taskSubscirbedQuerySnap.docs.length; i++) {
            console.log(taskSubscirbedQuerySnap.docs[i]);
            admin
              .auth()
              .getUser(taskSubscirbedQuerySnap.docs[i].data().userUid)
              .then(userRecord => {
                console.log(userRecord);
                email = userRecord.email;

                const msg = {
                  to: email,
                  from: "admin@yaybour.com",
                  subject: "New Job!",
                  //templateId: "d-77320f6599ed4c57acf755099d7c6c6e", //NewJob
                  reply_to: "admin@yaybour.com",
                  content: [
                    {
                      type: "text/html",
                      value: `<html><body> ${renderJobDescription(after, jobID)}

                  </body></html>`
                    }
                  ],
                  // html: ' ',

                  //   dynamic_template_data: {"body":"<html><body> -name- </body></html>", "title": info.data().description, "name": userRecord.displayName},

                  substitutionWrappers: ["{{", "}}"],
                  substitutions: {
                    title: "Test Title", //info.data().description,
                    photoURL: after.displayURL,
                    name: "Test Name" //userRecord.displayName
                  }
                };

                return sgMail
                  .send(msg)
                  .then(() => console.log("email sent"))
                  .catch(err => {
                    const { message, code, response } = error;
                    const { headers, body } = response;
                    console.log({ body });
                    console.log(err.toString());
                  });
              })

              .catch(error => {
                console.log("notification sent failed:", error);
              });
          }
          return;
        });
    }
  });

// exports.notificationToEmail = functions.firestore
//   .document("users/{userUid}/notifications/{notificationID}")
//   .onCreate((info, context) => {
//     const userUID = context.params.userUid;
//     console.log("info.data()", info.data());
//     let job;
//     let email;
//     return admin
//       .auth()
//       .getUser(userUID)
//       .then(userRecord => {
//         console.log(userRecord);

//         return userRecord;
//       })
//       .then(userRecord => {
//         email = userRecord.email;
//         return admin
//           .firestore()
//           .collection("jobs")
//           .doc(info.data().jobId)
//           .get()

//           .then(job => {
//             return job.data();
//           })
//           .then(job => {
//             console.log("job", job);

//             const msg = {
//               to: email,
//               from: "admin@yaybour.com",
//               subject: "New Job!",
//               //templateId: "d-77320f6599ed4c57acf755099d7c6c6e", //NewJob
//               reply_to: "admin@yaybour.com",
//               content: [
//                 {
//                   type: "text/html",
//                   value: `<html><body> ${renderJobDescription(
//                     job,
//                     info.data().jobId
//                   )}

//                   </body></html>`
//                 }
//               ],
//               // html: ' ',

//               //   dynamic_template_data: {"body":"<html><body> -name- </body></html>", "title": info.data().description, "name": userRecord.displayName},

//               substitutionWrappers: ["{{", "}}"],
//               substitutions: {
//                 title: "Test Title", //info.data().description,
//                 photoURL: info.data().photoURL,
//                 name: "Test Name" //userRecord.displayName
//               }
//             };

//             return sgMail
//               .send(msg)
//               .then(() => console.log("email sent"))
//               .catch(err => {
//                 const { message, code, response } = error;
//                 const { headers, body } = response;
//                 console.log({ body });
//                 console.log(err.toString());
//               });
//           });
//       });
//   });

exports.alphaJoin = functions.firestore
  .document("join_alpha/{alphaId}")
  .onCreate((info, context) => {
    console.log("Alpha Join v1");
    let newAlphaUser = info.data();
    console.log(newAlphaUser);
    //const activity = newActivity("newEvent", newEvent, event.id);

    //console.log(activity);

    const msg = {
      to: newAlphaUser.email,
      from: "admin@yaybour.com",
      subject: "Thanks for joining our alpha!",
      //  templateId: "d-34b370f795424cf99b2e35044a14916c",
      reply_to: "admin@yaybour.com",
      content: [
        {
          type: "text/html",
          value: `<html><body> Thanks for joining alpha!  
          </body></html>`
        }
      ],
      substitutionWrappers: ["{{", "}}"],
      substitutions: {
        name: "New Yaybour",
        city: "Regina"
      }
    };

    const data = [
      {
        first_name: newAlphaUser.first_name,
        last_name: newAlphaUser.last_name,
        email: newAlphaUser.email,
        kitchenAndBath: newAlphaUser.kitchenAndBath ? "true" : "false", //.toString()|| "",
        renovations: newAlphaUser.renovations ? "true" : "false", //.toString()|| "",,

        paint: newAlphaUser.paint ? "true" : "false", //.toString()|| "",,
        electrical: newAlphaUser.electrical ? "true" : "false", //.toString()|| "",,
        plumbing: newAlphaUser.plumbing ? "true" : "false", //.toString()|| "",,
        landscaping: newAlphaUser.landscaping ? "true" : "false", //.toString()|| "",,
        exterior: newAlphaUser.exterior ? "true" : "false", //.toString()|| "",,
        design: newAlphaUser.design ? "true" : "false", //.toString()|| "",,
        other: newAlphaUser.other ? "true" : "false", //.toString()|| "",

        newBuilds: newAlphaUser.newBuilds ? "true" : "false", //.toString()|| "",,
        engineering: newAlphaUser.engineering ? "true" : "false", //.toString()|| "",,
        carpentry: newAlphaUser.carpentry ? "true" : "false", //.toString()|| "",,
        concrete: newAlphaUser.concrete ? "true" : "false", //.toString()|| "",,
        solar: newAlphaUser.solar ? "true" : "false", //.toString()|| "",,
        drywall: newAlphaUser.drywall ? "true" : "false", //.toString()|| "",,
        blinds: newAlphaUser.blinds ? "true" : "false", //.toString()|| "",,
        windowsdoors: newAlphaUser.windowsdoors ? "true" : "false", //.toString()|| "",,
        fencing: newAlphaUser.fencing ? "true" : "false" //.toString()|| "",,
      }
    ];
    let request = {
      body: data,
      method: "POST",
      url: "/v3/contactdb/recipients"
    };

    return sgClient
      .request(request)
      .then(([response, body]) => {
        console.log("response", response);
        return body;
      })

      .then(body => {
        const newRecipientId = body.persisted_recipients;

        let request = {
          method: "POST",
          url: `/v3/contactdb/lists/7723731/recipients/${newRecipientId}`
        };
        return sgClient.request(request).then(([response, body]) => {
          console.log(response.statusCode);
          return console.log(response.body);
        });
      })
      .then(() => {
        return sgMail.send(msg).then(() => console.log("email sent"));
      })
      .catch(error => {
        console.log(error);
      });
  });

exports.requestOnboarding = functions.firestore
  .document("request_for_onboarding/{requestId}")
  .onCreate((info, context) => {
    const requestId = context.params.requestId;
    console.log("Request For Onboardging V1");
    let newRequest = info.data();
    console.log("new request Lat Lng", newRequest.venueLatLng);

    const phone = String(newRequest.phone).replace(/[^\d]/g, "");

    let onboarders = [];
    let available = [];
    let day = newRequest.day.split("-")[0];
    let timeBlock = "";

    let hour = newRequest.hour;
    console.log("hour", hour);
    if (hour < 13) {
      timeBlock = "8-12";
    } else if (hour < 18) {
      timeBlock = "12-5";
    } else {
      timeBlock = "5-9";
    }

    console.log("day", day);
    console.log("time block", timeBlock);
    return admin
      .firestore()
      .collection("onboarder_users")

      .get()
      .then(onboardersSnapshot => {
        const snapShot = onboardersSnapshot;
        snapShot.forEach(onboarder => {
          onboarders.push(onboarder.data());

          console.log({ onboarder });
          //  console.log('values', onboarder.data().values );
          console.log("onboarderLatLng", onboarder.data().values.venueLatLng);

          console.log("schedule", onboarder.data().schedule);

          const schedule = onboarder.data().schedule;

          const workingThatDay = schedule[`${day}`];
          console.log("workingThatDay", workingThatDay);
          if (workingThatDay) {
            console.log("working that day");
            console.log("shifts that day", schedule[`${day}`]);

            const workingThatShift = schedule[`${day}`][`${timeBlock}`];
            if (workingThatShift) {
              console.log("working that shift");

              var jobLocation = {
                lat: newRequest.venueLatLng.lat,
                lon: newRequest.venueLatLng.lng
              };
              var onboarderLocation = {
                lat: onboarder.data().values.venueLatLng.lat,
                lon: onboarder.data().values.venueLatLng.lng
              };
              var jobDistance = Distance.between(
                jobLocation,
                onboarderLocation
              );

              console.log("" + jobDistance.human_readable());

              available.push({
                claimURL: `http://yaybour.com/claimOnboard/${requestId}`,
                jobDistance: jobDistance.human_readable(),
                first_name: onboarder.data().values.first_name,
                last_name: onboarder.data().values.last_name,
                phone_number: onboarder.data().values.phone_number
              });
            } else {
              console.log("not working that shift");
            }
          } else {
            console.log("not working that day");
          }
        });
        console.log({ onboarders });
        console.log({ available });
        return available;
      })
      .then(available => {
        return available.forEach(onboarder => {
          return twilio.messages.create(
            {
              body:
                "Sent to: [" +
                available.length +
                "] JOB: " +
                newRequest.description +
                ".  " +
                onboarder.jobDistance +
                "from you. LINK: " +
                onboarder.claimURL,
              to: onboarder.phone_number,
              from: "13069937236"
            },
            err => {
              if (err) {
                return console.log(err);
              }

              // admin.database().ref('users/' + phone)
              //   .update({ code: code, codeValid: true }, () => {
              //     res.send({ success: true });
              //   });
            }
          );
        });
      });
  });
// .catch((err) => {
//   res.status(422).send({ error: err });
// });

const renderQuoteDescription = (
  quotedBy,
  taskName,
  jobTitle,
  total,
  quoteId,
  jobId
) => {
  return [
    `<div style="width:200px;background:#F9EECF;border:1px dotted black;text-align:center">
     <p>Generic content...</p>
     </div>
     
     <p style="fontSize:16">${quotedBy} has quoted your ${taskName} job "${jobTitle}" at $${total}.</p><br/>
     <br/>
     
     <a href="https://yaybour.com/quote/${jobId}_${quoteId}">VIEW QUOTE</a>
     `
  ];
};

const renderHiredDescription = (taskName, jobTitle) => {
  return [
    `<div style="width:200px;background:#F9EECF;border:1px dotted black;text-align:center">
     <p>Generic content...</p>
     </div>
     
     <p style="fontSize:16">Congratulations.  You have been hired for the ${taskName} job "${jobTitle}".</p><br/>
     <br/>
     
     <a href="https://yaybour.com/build">GO TO APP</a>
     `
  ];
};

exports.hireContractor = functions.firestore
  .document("job_contracts/{contractId}")
  .onCreate((info, context) => {
    console.log("New Function v1");
    let newContract = info.data();
    const { contract, jobData, jobId, ownerData, schedule, total, created } =
      newContract || {};
    const { acceptedDate, hiredContractorUid, jobOwnerUid, payments } =
      contract || {};
    const { jobPhotoURL, jobTitle, taskName } = jobData || {};
    const { ownerPhotoURL, owneredBy } = ownerData || {};
    const { completionDate, startDate, startHour } = schedule || {};

    console.log(newContract);

    const notification = {
      type: "hiredForJob",
      jobId: jobId,
      owner: owneredBy,
      photoURL: jobPhotoURL,
      created: created,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };
    return admin
      .firestore()
      .collection("users")
      .doc(hiredContractorUid)
      .collection("notifications")
      .add(notification)
      .then(docRef => {
        return console.log("Notification created with ID: ", docRef.id);
      })
      .then(() => {
        return admin.auth().getUser(hiredContractorUid);
      })

      .then(contractorRecord => {
        console.log("sending email to", contractorRecord);

        const msg = {
          to: contractorRecord.email,
          from: "admin@yaybour.com",
          subject: `Hired for ${jobTitle}`,
          //templateId: "d-77320f6599ed4c57acf755099d7c6c6e", //NewJob
          reply_to: "admin@yaybour.com",
          content: [
            {
              type: "text/html",
              value: `<html><body> ${renderHiredDescription(taskName, jobTitle)}
                
                   
                
                </body></html>`
            }
          ],
          // html: ' ',

          //   dynamic_template_data: {"body":"<html><body> -name- </body></html>", "title": info.data().description, "name": userRecord.displayName},

          substitutionWrappers: ["{{", "}}"],
          substitutions: {
            title: "Test Title", //info.data().description,
            photoURL: info.data().photoURL,
            name: "Test Name" //userRecord.displayName
          }
        };

        return sgMail
          .send(msg)
          .then(() => console.log("email sent"))
          .catch(err => {
            const { message, code, response } = error;
            const { headers, body } = response;
            console.log({ body });
            console.log(err.toString());
          });
      })
      .catch(err => {
        return console.log("Error adding notification", err);
      });
  });

exports.submitQuote = functions.firestore
  .document("job_quotes/{quoteId}")
  .onCreate((info, context) => {
    console.log("Quote v1 v1");

    let newQuote = info.data();

    const {
      bidType,
      created,
      jobData,
      jobId,
      lineItems,
      notes,
      ownerData,
      paymentType,
      quoteDate,
      quoteId,
      quotedBy,
      quotedByPhotoURL,
      quoterUid,
      total
    } = newQuote || {};

    const { jobTitle, taskName } = jobData || {};
    console.log("submitQuote quoteInfo", newQuote);
    const { ownerUid } = ownerData || {};

    const notification = {
      type: "quoteSubmitted",
      jobId: jobId,
      quoteId: quoteId,
      quotedBy: quotedBy,
      quoterUid: quoterUid,
      photoURL: quotedByPhotoURL,
      total: total,
      created: created,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    //  const userUID = context.params.userUid;
    //  console.log("info.data()", info.data());
    let job;
    let email;

    return admin
      .firestore()
      .collection("users")
      .doc(ownerUid)
      .collection("notifications")
      .add(notification)
      .then(docRef => {
        return console.log("Notification created with ID: ", docRef.id);
      })
      .then(() => {
        return admin.auth().getUser(ownerUid);
      })

      .then(ownerRecord => {
        console.log("sending email to", ownerRecord);

        const msg = {
          to: ownerRecord.email,
          from: "admin@yaybour.com",
          subject: `Quote for ${jobTitle}`,
          //templateId: "d-77320f6599ed4c57acf755099d7c6c6e", //NewJob
          reply_to: "admin@yaybour.com",
          content: [
            {
              type: "text/html",
              value: `<html><body> ${renderQuoteDescription(
                quotedBy,
                taskName,
                jobTitle,
                total,
                quoteId,
                jobId
              )}
                  
                     
                  
                  </body></html>`
            }
          ],
          // html: ' ',

          //   dynamic_template_data: {"body":"<html><body> -name- </body></html>", "title": info.data().description, "name": userRecord.displayName},

          substitutionWrappers: ["{{", "}}"],
          substitutions: {
            title: "Test Title", //info.data().description,
            photoURL: info.data().photoURL,
            name: "Test Name" //userRecord.displayName
          }
        };

        return sgMail
          .send(msg)
          .then(() => console.log("email sent"))
          .catch(err => {
            const { message, code, response } = error;
            const { headers, body } = response;
            console.log({ body });
            console.log(err.toString());
          });
      })
      .catch(err => {
        return console.log("Error adding notification", err);
      });
  });
