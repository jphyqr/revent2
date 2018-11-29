const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const stripe = require("stripe")(functions.config().stripe.token);
const logging = require("@google-cloud/logging");
const currency = functions.config().stripe.currency || "USD";
const retrieveAccount = require("./retrieve_account.js");
const createExternalBankAccount = require("./create_external_bank_account.js");
const createBankAccount = require("./create_bank_account.js");
const uploadID = require("./upload_id.js");
const updateAccount = require("./update_account.js");
const os = require("os");
const fs = require("fs");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const gcs = new Storage();
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



exports.uploadID = functions.https.onRequest(uploadID);

exports.createExternalBankAccount = functions.https.onRequest(
  createExternalBankAccount
);

exports.createBankAccount = functions.https.onRequest(createBankAccount);

exports.retrieveAccount = functions.https.onRequest(retrieveAccount);

exports.updateAccount = functions.https.onRequest(updateAccount);

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
        "Welcome to Skidsteer. I am the admin for this Region,  You can contact me directly here.";

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

exports.createContractorAccount = functions.firestore
  .document("users/{userUid}/registeredContractorFor/{userUid2}")
  .onCreate((info, context) => {
    const userUid = context.params.userUid;
    console.log("v2 createContractorAccount");
    console.log({ context });
    const val = info.data();
    console.log({ val });

    return stripe.accounts
      .create({
        type: "custom",
        country: val.countryCode
      })
      .then(account => {
        console.log("creating account");
        console.log({ account });
        return admin
          .database()
          .ref(`/stripe_accounts/${userUid}/account_token`)
          .set(account.id);
      });
  });
