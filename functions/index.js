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
      console.log("just flipped flag, skip rest")
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
