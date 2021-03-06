import moment from "moment";
import { toastr } from "react-redux-toastr";
import { FETCH_JOBS } from "../job/jobConstants";

import {
  SET_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS
} from "./notificationConstants";
import { FETCH_TASK } from "../modals/TaskModal/taskConstants";
import {SET_SUPPLIER} from '../nav/Menus/roleConstants'
import { FETCH_LABOUR } from "../job/JobDashboard/Labour/LabourList/labourConstants";
import cuid from "cuid";
import firebase from "../../app/config/firebase";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";

import { OPEN_MESSAGE } from "../popup/popupConstants";
import {SET_CONTRACTOR} from '../nav/Menus/roleConstants'
export const storeDeviceToken = () => async (
  dispatch,
  getState,
  { getFirestore }
) => {

  dispatch(asyncActionStart);

  const messaging = firebase.messaging();
  messaging
    .requestPermission()
    .then(() => {
 
      return messaging.getToken();
    })
    .then(token => {
    
      //you probably want to send your new found FCM token to the
      //application server so that they can send any push
      //notification to you.
     // storeDeviceToken(token)
      const firestore = getFirestore();
      const userUID = firestore.auth().currentUser.uid;
      const tokenUID = cuid();
      firestore.set(
        {
          collection: "users",
          doc: userUID,
          subcollections: [{ collection: "web_push_token", doc: token }]
        },

        { tokenUID: token, dateSet: Date.now() }
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

export const resendEmailVerificationLink = user => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  const firestore = getFirestore();
  try {
    dispatch(asyncActionStart());

    const user = firebase.auth().currentUser;
    user.sendEmailVerification();

    dispatch(asyncActionFinish());
    toastr.success("Success", "Email Link Sent");
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    toastr.error("Oops", "Problem sending link");
    throw new Error("Problem uploading photo");
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

export const subscribeToTask = task2 => async (dispatch, getState) => {
  dispatch(asyncActionStart());

  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  const photoURL = getState().firebase.profile.photoURL;
  const subscriber = {
    subscribed: true,
    joinDate: Date.now(),
    photoURL: photoURL || "/assets/user.png",
    displayName: user.displayName,
    manager: false
  };

  try {
    let updated;
    let taskDocRef = firestore.collection("tasks").doc(task2.key);
    let taskSubscribedDocRef = firestore
      .collection("task_subscribed")
      .doc(`${task2.key}_${user.uid}`);

    await firestore.runTransaction(async transaction => {
      await transaction.get(taskDocRef);
      await transaction.update(taskDocRef, {
        [`subscribers.${user.uid}`]: subscriber
      });

      await transaction.set(taskSubscribedDocRef, {
        taskId: task2.key,
        userUid: user.uid,
        manager: false,
        active: true,
        photoURL: photoURL || "/assets/user.png",
        created: Date.now()
      });
    });
 
    const key = task2.key;
    let taslSnap = await firestore
      .collection("tasks")
      .doc(key)
      .get();

    let task = taslSnap.data();

    const payload = { key: task2.key, value: task };

    dispatch({
      type: FETCH_TASK,
      payload: { payload }
    });

    dispatch(asyncActionFinish());
    toastr.success("Success", "You have subscrived to the event");
  } catch (error) {
    dispatch(asyncActionFinish());
    console.log(error);
    toastr.error("Oops", "Problem subscribing to event");
  }
};

export const unsubscribeToTask = task2 => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  try {
    //remove attendee from object map
    await firestore.update(`tasks/${task2.key}`, {
      [`subscribers.${user.uid}`]: firestore.FieldValue.delete()
    });
    //remove documennt from lookup
    await firestore.delete(`task_subscribed/${task2.key}_${user.uid}`);

    const key = task2.key;
    //let taskSnap = await firestore.getcollection("tasks").doc(key).get()

    let taskSnap = await firestore.get(`tasks/${key}`);
  
    let task = taskSnap.data();
 
    const payload = { key: task2.key, value: task };
   
    dispatch({
      type: FETCH_TASK,
      payload: { payload }
    });

    toastr.success("Success", "You have unsubscribed from the task");
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Something went wrong");
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

    // dispatch({ type: FETCH_EVENTS, payload: { events } });

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
        .where("owner", "==", true);
      // .orderBy("jobDate", "desc");
      break;
    default:
      query = jobsRef
        .where("userUid", "==", userUid)
        .orderBy("jobDate", "desc");
  }

  try {
    let querySnap = await query.get();
    console.log("querySnap", querySnap);
    let jobs = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = await firestore
        .collection("jobs")
        .doc(querySnap.docs[i].data().jobId)
        .get();
      jobs.push({ ...evt.data(), id: evt.id });
    }

    dispatch({ type: FETCH_JOBS, payload: { jobs } });

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const deleteJobDraft = job => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
 

  const firebase = getFirebase();
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    await firestore.delete({
      collection: "jobs",
      doc: job.jobId
    });
    await firestore.delete(`job_attendee/${job.jobId}_${user.uid}`);
    toastr.success("Success", "You have removed yourself from the job");
  } catch (error) {
    console.log(error);
    throw new Error("Problem deleting the photo");
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

export const newChatLabourer = labourer => async (
  dispatch,
  getState,
  { getFirestore }
) => {

  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
    dispatch(asyncActionStart());
    await firestore.set(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "last_message", doc: user.uid }]
      },
      {
        id: labourer.id
      }
    );

    let message = {
      newMessage: false,
      id: labourer.id,
      displayName: labourer.displayName,
      photoURL: labourer.photoURL,
      rating: labourer.rating,
      jobsCompleted: labourer.jobsCompleted,
      jobsStarted: labourer.jobsStarted,
      updatedSkills: labourer.updatedSkills,

      date: Date.now()
    };

    await firestore.set(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "messaging", doc: labourer.id }]
      },
      message
    );

    dispatch({
      type: OPEN_MESSAGE,
      payload: { message }
    });

    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const newChat = receiver => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const user = firebase.auth().currentUser;
  try {
  
    await firestore.set(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "last_message", doc: user.uid }]
      },
      {
        id: receiver.quoterUid
      }
    );

    let message = {
      newMessage: false,
      id: receiver.quoterUid,
      displayName: receiver.quotedBy,
      photoURL: receiver.quotedByPhotoURL,
      rating: receiver.quoterRating,
      volume: receiver.quoterVolume,
      isContractor: receiver.quoterIsContractor,
      jobReferenceId: receiver.jobId,

      date: Date.now()
    };

    await firestore.set(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "messaging", doc: receiver.quoterUid }]
      },
      message
    );

    dispatch({
      type: OPEN_MESSAGE,
      payload: { message }
    });

  
 
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const addDirectMessage = (receiverId, values) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
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
  const id = token.token.id;
  try {
    await firebase.push(`stripe_customers/${user.uid}/charges/`, token);
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem adding card");
  }
};

export const updateSkills = skills => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const { isLoaded, isEmpty, ...updatedSkills } = skills;
  console.log({ updatedSkills });

  let labourSkills = { updatedSkills };
  labourSkills.skillsHaveBeenUpdated = true;

  try {
    await firebase.updateProfile(labourSkills); //react redux firebase method
    toastr.success("Success", "Profile updated");
  } catch (error) {
    console.log(error);
  }
};


export const createContractorProfile = (first, last, signature, date) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();

  const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;


  let updatedProfile = {
    isContractor: true,
    firstName: first,
    lastName: last,
    signatureURL: signature,
    dateSigned: date,
    displayName: userProfile.displayName,
    photoURL: userProfile.photoURL || "/assets/user.png",
    uid: user.uid,
    jobsCompleted:0,
    jobsStarted: 0,
    rating: {clean:0, craftsmanship:0, professionalism:0, punctuality:0},
    volumeTotal: 0,
    hasValidConnectedAccount: false,
    hasValidCreditCard: false,
  };

  const firestore = getFirestore();

  try {
    await firestore.set(`contractor_profiles/${user.uid}`, updatedProfile);



    dispatch({
      type: SET_CONTRACTOR,
      payload: { }
    });


    toastr.success("Success", "Profile Created and Listed");
    dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
  }
};

export const createLabourProfile = (profile, profileListed) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  //const { isLoaded, isEmpty, ...updatedSkills } = skills;
  
  const { labourProfile, updatedSkills } = profile || {};
  const { jobsCompleted, jobsStarted, rating } = labourProfile || {};

  //const firebase = getFirebase();
  const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;

  labourProfile.isALabourer = true;

  let updatedProfile = {
    profileListed: profileListed,
    displayName: userProfile.displayName,
    photoURL: userProfile.photoURL || "/assets/user.png",
    uid: user.uid,
    jobsCompleted: jobsCompleted || 0,
    jobsStarted: jobsStarted || 0,
    rating: rating || {},
    updatedSkills: updatedSkills || {}
  };

  const firestore = getFirestore();

  try {
    await firestore.set(`labour_profiles/${user.uid}`, updatedProfile);

    const firestoreDirect = firebase.firestore();
    const labourRef = firestoreDirect.collection("labour_profiles");
    let query = labourRef.where("profileListed", "==", true);
    let querySnap = await query.get();
    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    let labour = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      labour.push(evt);
    }

    dispatch({
      type: FETCH_LABOUR,
      payload: { labour }
    });
    await firebase.updateProfile({
      profileListed: profileListed,
      isALabourer: true,
      skillsHaveBeenUpdated: false
    });
    toastr.success("Success", "Profile Created and Listed");
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
  }
};


export const deleteLabourPhoto = (id) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();


  const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;


  const firestore = getFirestore();



  try {
    dispatch(asyncActionStart());
    //upload the file to firebase storage
    

    await firestore.delete(
      {
        collection: "labour_profiles",
        doc: user.uid,
        subcollections: [{ collection: "labour_photos", doc: `${id}` }]
      }
    );

    const firestoreDirect = firebase.firestore();
    const labourRef = firestoreDirect.collection("labour_profiles");
    let query = labourRef.where("profileListed", "==", true);
    let querySnap = await query.get();
    
    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    let labour = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      labour.push(evt);
    }

    dispatch({
      type: FETCH_LABOUR,
      payload: { labour }
    });
    //HERE



    toastr.success("Success", "Photo Deleted");
    dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const deleteContractorVideo = (id) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();


  const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;


  const firestore = getFirestore();



  try {
    dispatch(asyncActionStart());
  
    await firestore.delete(
      {
        collection: "contractor_profiles",
        doc: user.uid,
        subcollections: [{ collection: "contractor_videos", doc: `${id}` }]
      }
    );




    toastr.success("Success", "Video Deleted");
    dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
    dispatch(asyncActionError());
  }
};


export const deleteContractorPhoto = (id) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();


  const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;


  const firestore = getFirestore();



  try {
    dispatch(asyncActionStart());
    //upload the file to firebase storage
    

    await firestore.delete(
      {
        collection: "contractor_profiles",
        doc: user.uid,
        subcollections: [{ collection: "contractor_photos", doc: `${id}` }]
      }
    );




    toastr.success("Success", "Photo Deleted");
    dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
    dispatch(asyncActionError());
  }
};


export const uploadContractorPhoto = (file) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();


  const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;

  const imageName = cuid();

  const firestore = getFirestore();

  const path = `${user.uid}/contractor_photos`;
  const options = {
    name: imageName
  };

  try {
    dispatch(asyncActionStart());
    //upload the file to firebase storage
    
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    //get url of image
    console.log({uploadedFile})
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
    const photos = {originalURL:downloadURL, date: Date.now()}
   

    await firestore.set(
      {
        collection: "contractor_profiles",
        doc: user.uid,
        subcollections: [{ collection: "contractor_photos", doc: `${imageName}` }]
      },
      {
        ...photos
        
      }
    );



 dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
    dispatch(asyncActionError());
  }
};




export const uploadLabourPhoto = (file) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();


  const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;

  const imageName = cuid();

  const firestore = getFirestore();

  const path = `${user.uid}/labour_photos`;
  const options = {
    name: imageName
  };

  try {
    dispatch(asyncActionStart());
    //upload the file to firebase storage
    
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    //get url of image
    console.log({uploadedFile})
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
    const photos = {originalURL:downloadURL, date: Date.now()}
   

    await firestore.set(
      {
        collection: "labour_profiles",
        doc: user.uid,
        subcollections: [{ collection: "labour_photos", doc: `${imageName}` }]
      },
      {
        ...photos
        
      }
    );

    const firestoreDirect = firebase.firestore();
    const labourRef = firestoreDirect.collection("labour_profiles");
    let query = labourRef.where("profileListed", "==", true);
    let querySnap = await query.get();
    
    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    let labour = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      labour.push(evt);
    }

    dispatch({
      type: FETCH_LABOUR,
      payload: { labour }
    });
    //HERE



    toastr. dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
    dispatch(asyncActionError());
  }
};



export const changeContractorVideoThumbnail = (video, file) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();

 const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  const imageName = cuid();

  const firestore = getFirestore();

  const path = `${user.uid}/new_thumbs`;
  const options = {
    name: `thumb_${imageName}`
  };
 
  try {
    dispatch(asyncActionStart());
    //upload the file to firebase storage
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    //get url of image
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;



   const updatedVideo = video
   updatedVideo.thumb = downloadURL  

    await firestore.update(
      {
        collection: "contractor_profiles",
        doc: user.uid,
        subcollections: [{ collection: "contractor_videos", doc: `${video.id}` }]
      },
      {
       ...updatedVideo
      }
    );




    //get userdoc from firestore
    // await firestore.set(`users/${user.uid}/contractorVideo/${user.uid}`);
 
    // await firebase.updateProfile({
    //   contractorProfile: updatedContractorProfile
    // });
   dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
    dispatch(asyncActionError());
  }
};


export const updateContractorVideoTitle = (video, title) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();

 const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  const firestore = getFirestore();
 
  try {
    dispatch(asyncActionStart());
    //upload the file to firebase storage
    


    await firestore.update(
      {
        collection: "contractor_profiles",
        doc: user.uid,
        subcollections: [{ collection: "contractor_videos", doc: `${video.id}` }]
      },
      {
        title:title
      }
    );




    //get userdoc from firestore
    // await firestore.set(`users/${user.uid}/contractorVideo/${user.uid}`);
 
    // await firebase.updateProfile({
    //   contractorProfile: updatedContractorProfile
    // });
   dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
    dispatch(asyncActionError());
  }
};





export const uploadContractorVideo = (file) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();

 const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;

  const imageName = cuid();

  const firestore = getFirestore();

  const path = `${user.uid}/contractor_videos`;
  const options = {
    name: imageName
  };

  try {
    dispatch(asyncActionStart());
    //upload the file to firebase storage
    
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    //get url of image
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;



    const video = {originalURL:downloadURL, date: Date.now(),}
   

    await firestore.set(
      {
        collection: "contractor_profiles",
        doc: user.uid,
        subcollections: [{ collection: "contractor_videos", doc: `${imageName}` }]
      },
      {
        ...video,
        
      }
    );




    //get userdoc from firestore
    // await firestore.set(`users/${user.uid}/contractorVideo/${user.uid}`);
 
    // await firebase.updateProfile({
    //   contractorProfile: updatedContractorProfile
    // });
   dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
    dispatch(asyncActionError());
  }
};









export const uploadBuilderPhoto = (builderProfile, file) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  //const { isLoaded, isEmpty, ...updatedSkills } = skills;

  const { builderPhotos } = builderProfile || [];
  let updatedBuilderPhotos = builderPhotos || [];
  let updatedBuilderProfile = builderProfile;
  //const firebase = getFirebase();
  const userProfile = getState().firebase.profile;
  const user = firebase.auth().currentUser;

  const imageName = cuid();

  const firestore = getFirestore();

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

    updatedBuilderPhotos.unshift(downloadURL);
    updatedBuilderProfile.builderPhotos = updatedBuilderPhotos;

    await firebase.updateProfile({ builderProfile: updatedBuilderProfile });
    toastr.success("Success", "Builder profile updated");
    dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Profile was not Created");
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const joinBeta = values => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
 

  const firestore = getFirestore();

  let userDoc = await firestore.get(`sales_team/${values.salesperson}`);
  const userDocData = userDoc.data();
  
  let email_list = userDocData.email_list;
  email_list.push(values.email);
  let count = userDocData.count;
  let newcount = count + 1;
  
  userDocData.email_list = email_list;
  userDocData.count = newcount;

  await firestore.set(
    {
      collection: "sales_team",
      doc: values.salesperson
    },
    userDocData
  );

  // if (userDoc.data()) {
  //   await firestore.add(
  //     {
  //       collection: "sales_team",
  //       doc: values.salesperson,
  //     },
  //     {
  //       count: 1,
  //       email_list: [values.email]
  //     }
  //   );
  //   } else {
  //     console.log('sales exists')
  //   }

  const firebase = getFirebase();

  let newPost = {
    name: values.name || "No Name",
    company: values.company || "No Company",
    interest: values.interest || "No Interest",
    role: values.role || "No Role",
    industry: values.industry || "No Industry",
    notes: values.notes || "No Notes",
    email: values.email || "No Email",
    phone: values.phone || "No Phone"
  };

  try {
    dispatch(asyncActionStart());
    await firebase.push(`join_beta`, newPost);
    toastr.success("Success", "Joined Beta");
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem adding direct message");
    dispatch(asyncActionError());
  }
};

export const joinAlpha = values => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  

  const firestore = getFirestore();

  const firebase = getFirebase();

  let userUid = firestore.auth().currentUser.uid;

  let alpha = { isAlpha: true };

  try {
    dispatch(asyncActionStart());

    await firebase.updateProfile(alpha); //react redux firebase method

    await firestore.set(
      {
        collection: "join_alpha",
        doc: userUid
      },
      { ...values, isAlpha: true }
    );
    toastr.success("Success", "Joined Alpha");
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem joining Alpha");
    dispatch(asyncActionError());
  }
};

export const setNotifications = (
  newContract,
  newQuotes,

  newMessage,
  newNotification,
  hideHowToPost
) => {
  return async (dispatch, getState, { getFirebase }) => {
    try {
      let notifications = {
        newContract: newContract,
        newQuotes: newQuotes,
       
        newMessage: newMessage,
        newNotification: newNotification,
        hideHowToPost: hideHowToPost
      };
      dispatch({
        type: SET_NOTIFICATIONS,
        payload: { notifications }
      });
    } catch (error) {
      console.log(error);
    }
  };
};






export const handleNewQuoteSelected = (jobId) => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
  


    let userDoc = await firestore.get(`users/${user.uid}`);
    //check if user has photo , if not update profile w new image
     let newQuotesArray = []

     newQuotesArray = (userDoc.data().newQuotes) || []
   
    let filteredArray = newQuotesArray&&newQuotesArray.filter(quote=>{
      return quote!==jobId
    })
    
    try {
      await firestore.update(
        {
          collection: "users",
          doc: user.uid
        },
        {
          newQuotes: filteredArray
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
};


export const contractsClicked = () => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    user.newContract = false;
    
    try {
      await firestore.update(
        {
          collection: "users",
          doc: user.uid
        },
        {
          newContract: false
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
};


export const hideHowToPost = () => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {


    const firebase = getFirebase();
    //const { isLoaded, isEmpty, ...updatedSkills } = skills;
 
    const user = firebase.auth().currentUser;


    const firestore = getFirestore();
 //   const user = firestore.auth().currentUser;
 
    try {
      await firestore.update(
        {
          collection: "users",
          doc: user.uid
        },
        {
          hideHowToPost: true
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
};





export const createSupplierProfile = supplier => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  //const { isLoaded, isEmpty, ...updatedSkills } = skills;

 console.log('createSupplierProfile', supplier)

  const firestore = getFirestore();
   const user = firestore.auth().currentUser;

  try {
    await firestore.set(
      {
        collection: "supplier_users",
        doc: user.uid
      },
      {
        ...supplier,
        isSupplier:true
      }
    );

    await firestore.update(
      {
        collection: "users",
        doc: user.uid
      },
      {
        isSupplier:true
      }
    );


    dispatch({
      type: SET_SUPPLIER,
      payload: { supplier }
    });

    
  } catch (error) {
    console.log(error);
  }
};



export const updateSupplierProfile = supplier => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase();
  //const { isLoaded, isEmpty, ...updatedSkills } = skills;

 

  const firestore = getFirestore();
   const user = firestore.auth().currentUser;

  try {
    await firestore.update(
      {
        collection: "supplier_users",
        doc: user.uid
      },
      {
        ...supplier
      }
    );
  } catch (error) {
    console.log(error);
  }
};





export const updateSupplierPhoto = (file) => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch(asyncActionStart());


    const firestore = getFirestore();
    const firebase = getFirebase();

    const user = firebase.auth().currentUser;

      const imageName = cuid();
    
  
    
      const path = `${user.uid}/user_images`;
      const options = {
        name: imageName
      };

    try {

      let uploadedFile = await firebase.uploadFile(path, file, null, options);
      //get url of image
      let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
  


      await firestore.update(
        {
          collection: "supplier_users",
          doc: user.uid
        },
        {
         storePhotoUrl: downloadURL
        }
      );



     

      dispatch(asyncActionFinish());
      toastr.success("Success", "Example store photo uploaded");
    } catch (error) {
      dispatch(asyncActionError());
      toastr.error("Oops", "Something went wrong uploading store photo");
      console.log(error);
    }
  };
};


