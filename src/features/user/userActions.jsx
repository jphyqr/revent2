import moment from "moment";
import { toastr } from "react-redux-toastr";
import { FETCH_EVENTS } from "../event/eventConstants";
import cuid from "cuid";
import firebase from "../../app/config/firebase";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";



export const storeDeviceToken = () => async (dispatch, getState, {getFirestore}) => {
  console.log('storeDeviceToken Code Reached')
  dispatch(asyncActionStart);


  const messaging = firebase.messaging();
  messaging
    .requestPermission()
    .then(() => {
      console.log("Have Permission");
      return messaging.getToken();
    })
    .then(token => {
      console.log("FCM Token:", token);
      //you probably want to send your new found FCM token to the
      //application server so that they can send any push
      //notification to you.
      console.log('initialize push code reached, about to storeDeviceToken')
    // storeDeviceToken(token)
    const firestore = getFirestore();
    const userUID = firestore.auth().currentUser.uid;

    console.log('sdt uid', userUID)
     firestore.set(
      {
        collection: "users",
        doc: userUID,
        subcollections: [{ collection: "web_push_token", doc: userUID }]
      },
      {FCM_token: token}
    );

     dispatch(asyncActionError());
    })
    .catch(error => {
      if (error.code === "messaging/permission-blocked") {
          dispatch(asyncActionError());
        console.log("Please Unblock Notification Request Manually");
      } else {
        console.log("Error Occurred", error);
      }
    });







  // const firestore = firebase.firestore();
  // const userUID = firestore.auth().currentUser.uid;
  // console.log('storeDeviceToken UID', userUID)
  // try {
  //   dispatch(asyncActionStart());

  //   await firestore.set(
  //     {
  //       collection: "users",
  //       doc: userUID,
  //       subcollections: [{ collection: "deviceToken", doc: deviceToken }]
  //     },
  //     deviceToken
  //   );
  //   dispatch(asyncActionFinish());
  // } catch (error) {
  //   console.log(error);
  //   dispatch(asyncActionError());
  //   throw new Error("Problem following user");
  // }


};





export const updateProfile = user => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const { isLoaded, isEmpty, ...updatedUser } = user;
  if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
    //moment object coming in, need to deal with it
    updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
  }

  try {
    await firebase.updateProfile(updatedUser); //react redux firebase method
    toastr.success("Success", "Profile updated");
  } catch (error) {
    console.log(error);
  }
};

export const uploadProfileImage = (file, fileName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const imageName = cuid();
  const firebase = getFirebase();
  const firestore = getFirestore();

  const user = firebase.auth().currentUser;
  const path = `${user.uid}/user_images`;
  const options = {
    name: imageName
  };
  try {
    dispatch(asyncActionStart());
    //upload the file to firebase storage
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    //get url of image
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
    //get userdoc from firestore
    let userDoc = await firestore.get(`users/${user.uid}`);
    //check if user has photo , if not update profile w new image
    if (!userDoc.data().photoURL) {
      await firebase.updateProfile({
        photoURL: downloadURL
      });
      await user.updateProfile({
        photoURL: downloadURL
      });
    }
    //add the new photo as a new image in photos collection
    await firestore.add(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "photos" }]
      },
      {
        name: imageName,
        url: downloadURL
      }
    );
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error("Problem uploading photo");
  }
};

export const setMainPhoto = photo => async (dispatch, getState) => {
  dispatch(asyncActionStart);
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const today = new Date(Date.now());
  let userDocRef = firestore.collection("users").doc(user.uid);
  let eventAttendeeRef = firestore.collection("event_attendee");

  try {
    let batch = firestore.batch();
    await batch.update(userDocRef, { photoURL: photo.url });

    let eventQuery = await eventAttendeeRef
      .where("userUid", "==", user.uid)
      .where("eventDate", ">", today);
    let eventQuerySnap = await eventQuery.get();
    for (let i = 0; i < eventQuerySnap.docs.length; i++) {
      let eventDocRef = await firestore
        .collection("events")
        .doc(eventQuerySnap.docs[i].data().eventId);
      let event = await eventDocRef.get();
      if (event.data().hostUid === user.uid) {
        batch.update(eventDocRef, {
          hostPhotoURL: photo.url,
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      } else {
        batch.update(eventDocRef, {
          [`attendees.${user.uid}.photoURL`]: photo.url
        });
      }
    }
    console.log(batch);
    await batch.commit();
    dispatch(asyncActionFinish);
  } catch (error) {
    dispatch(asyncActionError);
    console.log(error);
    throw new Error("Problem setting main photo");
  }
};

export const deletePhoto = photo => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
    await firestore.delete({
      collection: "users",
      doc: user.uid,
      subcollections: [{ collection: "photos", doc: photo.id }]
    });
  } catch (error) {
    console.log(error);
    throw new Error("Problem deleting the photo");
  }
};

export const bidJob = job => async (dispatch, getState) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const photoURL = getState().firebase.profile.photoURL;
  const bidder = {
    going: true,
    joinDate: Date.now(),
    photoURL: photoURL || "/assets/user.png",
    displayName: user.displayName,
    host: false
  };

  try {
    let jobDocRef = firestore.collection("jobs").doc(job.id);
    let jobBidderDocRef = firestore
      .collection("job_bid")
      .doc(`${job.id}_${user.uid}`);

    await firestore.runTransaction(async transaction => {
      await transaction.get(jobDocRef);
      await transaction.update(jobDocRef, {
        [`bids.${user.uid}`]: bidder
      });
      await transaction.set(jobBidderDocRef, {
        jobId: job.id,
        userUid: user.uid,
        jobDate: job.date,
        host: false
      });
    });

    dispatch(asyncActionFinish());
    toastr.success("Success", "You have bid on job");
  } catch (error) {
    dispatch(asyncActionFinish());
    console.log(error);
    toastr.error("Oops", "Problem bidding on job");
  }
};

export const goingToEvent = event => async (dispatch, getState) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const photoURL = getState().firebase.profile.photoURL;
  const attendee = {
    going: true,
    joinDate: Date.now(),
    photoURL: photoURL || "/assets/user.png",
    displayName: user.displayName,
    host: false
  };

  try {
    let eventDocRef = firestore.collection("events").doc(event.id);
    let eventAttendeeDocRef = firestore
      .collection("event_attendee")
      .doc(`${event.id}_${user.uid}`);

    await firestore.runTransaction(async transaction => {
      await transaction.get(eventDocRef);
      await transaction.update(eventDocRef, {
        [`attendees.${user.uid}`]: attendee
      });
      await transaction.set(eventAttendeeDocRef, {
        eventId: event.id,
        userUid: user.uid,
        eventDate: event.date,
        host: false
      });
    });

    dispatch(asyncActionFinish());
    toastr.success("Success", "You have signed up to the event");
  } catch (error) {
    dispatch(asyncActionFinish());
    console.log(error);
    toastr.error("Oops", "Problem signing up to event");
  }
};

export const cancelBidForJob = job => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  try {
    //remove attendee from object map
    await firestore.update(`jobs/${job.id}`, {
      [`bids.${user.uid}`]: firestore.FieldValue.delete()
    });
    //remove documennt from lookup
    await firestore.delete(`job_bid/${job.id}_${user.uid}`);
    toastr.success("Success", "You have removed yourself from the job");
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Something went wrong");
  }
};

export const cancelGoingToEvent = event => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  try {
    //remove attendee from object map
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    });
    //remove documennt from lookup
    await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
    toastr.success("Success", "You have removed yourself from the event");
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Something went wrong");
  }
};

export const getUserEvents = (userUid, activeTab) => async (
  dispatch,
  getState
) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const today = new Date(Date.now());
  let eventsRef = firestore.collection("event_attendee");
  let query;
  switch (activeTab) {
    case 1: //past events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", "<=", today)
        .orderBy("eventDate", "desc");
      break;
    case 2: //future events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", ">=", today)
        .orderBy("eventDate");
      break;
    case 3: //hosted events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("host", "==", true)
        .orderBy("eventDate", "desc");
      break;
    default:
      query = eventsRef
        .where("userUid", "==", userUid)
        .orderBy("eventDate", "desc");
  }

  try {
    let querySnap = await query.get();

    let events = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = await firestore
        .collection("events")
        .doc(querySnap.docs[i].data().eventId)
        .get();
      events.push({ ...evt.data(), id: evt.id });
    }

    dispatch({ type: FETCH_EVENTS, payload: { events } });

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const getUserJobs = (userUid, activeTab) => async (
  dispatch,
  getState
) => {
  dispatch(asyncActionStart());
  const firestore = firebase.firestore();
  const today = new Date(Date.now());
  let jobsRef = firestore.collection("job_attendee");
  let query;
  switch (activeTab) {
    case 1: //past jobs
      query = jobsRef
        .where("userUid", "==", userUid)
        .where("jobDate", "<=", today)
        .orderBy("jobDate", "desc");
      break;
    case 2: //future jobs
      query = jobsRef
        .where("userUid", "==", userUid)
        .where("jobDate", ">=", today)
        .orderBy("jobDate");
      break;
    case 3: //hosted jobs
      query = jobsRef
        .where("userUid", "==", userUid)
        .where("host", "==", true)
        .orderBy("jobDate", "desc");
      break;
    default:
      query = jobsRef
        .where("userUid", "==", userUid)
        .orderBy("jobDate", "desc");
  }

  try {
    let querySnap = await query.get();

    let jobs = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = await firestore
        .collection("jobs")
        .doc(querySnap.docs[i].data().jobId)
        .get();
      jobs.push({ ...evt.data(), id: evt.id });
    }

    dispatch({ type: FETCH_EVENTS, payload: { jobs } });

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const unfollowUser = userToUnfollow => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;

  try {
    dispatch(asyncActionStart());

    await firestore.delete({
      collection: "users",
      doc: user.uid,
      subcollections: [{ collection: "following", doc: userToUnfollow }]
    });
  } catch (error) {
    dispatch(asyncActionError());
    throw new Error("Problem unfollowing user");
  }
};

export const followUser = userToFollow => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  const following = {
    photoURL: userToFollow.photoURL || "/assets/user.png",
    city: userToFollow.city || "Unknown city",
    displayName: userToFollow.displayName
  };

  try {
    dispatch(asyncActionStart());

    await firestore.set(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "following", doc: userToFollow.id }]
      },
      following
    );
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error("Problem following user");
  }
};

export const messageUser = userToMessage => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  console.log("userActions/messageUser");
  console.log({ userToMessage });
  const messaging = {
    id: userToMessage.id,
    photoURL: userToMessage.photoURL || "/assets/user.png",
    city: userToMessage.city || "Unknown city",
    displayName: userToMessage.displayName,
    newMessage: false,
    date: new Date(Date.now())
  };

  console.log({ messaging });

  try {
    dispatch(asyncActionStart());

    await firestore.set(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "messaging", doc: userToMessage.id }]
      },
      messaging
    );

    await firestore.set(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "last_message", doc: user.uid }]
      },
      {
        id: userToMessage.id,
        photoURL: userToMessage.photoURL || "/assets/user.png",
        city: userToMessage.city || "Unknown city",
        displayName: userToMessage.displayName
      }
    );

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error("Problem messaging user");
  }
};

export const selectLastMessage = lastRecipient => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  console.log("selectLastMessage:");
  console.log({ lastRecipient });
  try {
    await firestore.set(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "last_message", doc: user.uid }]
      },
      {
        id: lastRecipient.id,
        photoURL: lastRecipient.photoURL || "/assets/user.png",
        city: lastRecipient.city || "Unknown city",
        displayName: lastRecipient.displayName
      }
    );

    await firestore.update(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "messaging", doc: lastRecipient.id }]
      },
      {
        newMessage: false
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const addDirectMessage = (receiverId, values) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  console.log("userActions/addDirectMessage");
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;

  let newComment = {
    displayName: profile.displayName,
    photoURL: profile.photoURL || "/assets/user.png",
    uid: user.uid,
    text: values.comment,
    date: Date.now()
  };

  let threadId = "";

  if (user.uid < receiverId) {
    threadId = `${user.uid}_${receiverId}`;
  } else {
    threadId = `${receiverId}_${user.uid}`;
  }

  try {
    await firebase.push(`direct_messages/${threadId}`, newComment);
    toastr.success("Success", "Message Sent");
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem adding direct message");
  }
};

export const getLastMessage = () => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;

  try {
    dispatch(asyncActionStart());

    let nextMessage = await firestore.get({
      collection: "users",
      doc: user.uid,
      subcollections: [{ collection: "last_message", doc: user.uid }]
    });
    let data;
    if (nextMessage) {
      data = nextMessage.data();
      console.log("userActions/getLastMessage");
      console.log({ data });
      console.log({ user });
    }

    dispatch(asyncActionFinish());
    return data;
  } catch (error) {
    dispatch(asyncActionError());
    console.log(error);
  }
};

export const addPaymentCard = token => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  console.log({ user });
  console.log("addPaymentCard:");
  console.log({ token });
  try {
    dispatch(asyncActionStart());

    await firebase
      .ref(`/stripe_customers/${user.uid}/sources`)
      .push({ token: token.id });

    toastr.success("Success", "Card Added");
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    toastr.error("Oops", "Problem adding card");
  }
};

export const chargeCard = token => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  const pushId = cuid();
  console.log("addPaymentCard:");
  const id = token.token.id;
  console.log({ id });
  console.log({ pushId });
  try {
    await firebase.push(`stripe_customers/${user.uid}/charges/`, token);
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem adding card");
  }
};






