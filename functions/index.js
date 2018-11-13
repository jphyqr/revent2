const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

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
  .onCreate((info, context) => {
    const senderId = context.params.senderId;
    const receiverId = context.params.receiverId;
    console.log("v3");
    const senderDoc = admin
      .firestore()
      .collection("users")
      .doc(senderId);

    console.log({senderDoc});
    console.log({senderId});
    console.log({receiverId});
    return senderDoc.get().then(doc => {
      let userData = doc.data();
      console.log({userData});
      let receivingMessagesFrom = {
        displayName: userData.displayName,
        photoURL: userData.photoURL || "/assets/user.png",
        city: userData.city || "Unknown City"
      };

      console.log({receivingMessagesFrom});
      return admin
        .firestore()
        .collection("users")
        .doc(receiverId)
        .collection("messaging")
        .doc(senderId)
        .set(receivingMessagesFrom);
    });
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
