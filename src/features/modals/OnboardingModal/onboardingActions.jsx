import firebase from "../../../app/config/firebase";
import { toastr } from "react-redux-toastr";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../../async/asyncActions";
import cuid from "cuid";
export const toggleShift = (
  myOnboarderProfile,
  day,
  shift,
  thatShift
) => async (dispatch, getState, { getFirestore }) => {
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
  console.log("day", day);
  console.log("shift", shift);
  console.log("thatshift", thatShift);
  const profile = myOnboarderProfile;
  console.log("toggleShift profile", profile);
  const { schedule } = profile;

  let scheduleToUpdate = schedule;

  if (scheduleToUpdate == undefined) {
    console.log("SCHEDULE DIDNT EXIST, ADD TRUE");
    scheduleToUpdate = {};
    scheduleToUpdate[`${day}`] = {};
    scheduleToUpdate[`${day}`][`${shift}`] = true;
  } else {
    console.log("toggleshift schedyleToUpdate", scheduleToUpdate);
    // scheduleToUpdate[`${day}`][`${shift}`] = (!thatShift)
    //let updateDay =   scheduleToUpdate[`${day}`]
    // console.log('toggleshift updateDate', updateDay)

    if (scheduleToUpdate[`${day}`] == undefined) {
      console.log("SCHEDULE  EXIST, BUT DAY DID NOT,  ADD TRUE");
      scheduleToUpdate[`${day}`] = {};
      scheduleToUpdate[`${day}`][`${shift}`] = {};
      scheduleToUpdate[`${day}`][`${shift}`] = true;
    } else {
      if (thatShift === true) {
        console.log(
          "SCHEDULE  AND DAY EXIST-- thatShift UNDEFINED, TOGGLE  ADD TRUE"
        );
        scheduleToUpdate[`${day}`][`${shift}`] = false;
      } else {
        console.log(
          "SCHEDULE  AND DAY EXIST-- thatShift DEFINED, TOGGLE  ADD TRUE"
        );

        scheduleToUpdate[`${day}`][`${shift}`] = true;
      }
    }
  }
  profile.schedule = scheduleToUpdate;
  console.log("updated profile", profile);

  try {
    dispatch(asyncActionStart());

    await firestore.update(
      {
        collection: "onboarder_users",
        doc: user.uid
      },
      profile
    );
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error("Problem following user");
  }
};


export const pauseProfile = (
  profile
) => async (dispatch, getState, { getFirestore }) => {
  
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
      

  profile.isLive=false
  try {
    dispatch(asyncActionStart());

    await firestore.update(
      {
        collection: "onboarder_users",
        doc: user.uid
      },
      profile
    );
    dispatch(asyncActionFinish());
    toastr.success("Success", "Profile is paused");
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    toastr.success("Success", "Profile is paused");
    throw new Error("Problem following user");
  }
};



export const goLive = (
  profile,
  values
) => async (dispatch, getState, { getFirestore }) => {
  
  const firestore = getFirestore();
  const user = firestore.auth().currentUser;
      
  profile.values=values
  profile.isLive=true
  try {
    dispatch(asyncActionStart());

    await firestore.update(
      {
        collection: "onboarder_users",
        doc: user.uid
      },
      profile
    );
    
    dispatch(asyncActionFinish());
    toastr.success("Success", "Profile is Live");
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    toastr.success("Oops", "Profile did not go live");
    throw new Error("Problem following user");
  }
};








export const uploadOnboardingPhoto = (profile, file) => async (
  dispatch,
  getState,
  { getFirebase , getFirestore}
) => {
  const firebase = getFirebase();
  //const { isLoaded, isEmpty, ...updatedSkills } = skills;

  // const {labourPhotos} = labourProfile || []
  // let updatedLabourPhotos = labourPhotos || []
  // let updatedLabourProfile = labourProfile || {}
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
    console.log({file})
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    //get url of image
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
    //get userdoc from firestore

    profile.onboardingPhotoURL = downloadURL

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
   

    //updatedLabourPhotos.unshift(downloadURL)
    //updatedLabourProfile.labourPhotos = updatedLabourPhotos
   // console.log({updatedLabourProfile})
   await firestore.update(
    {
      collection: "onboarder_users",
      doc: user.uid
    },
    profile
  );
      const firestoreDirect = firebase.firestore();
 
    toastr.success("Success", "Photo Uploaded");
    dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Photo was not ulpoaded");
    console.log(error);
    dispatch(asyncActionError());
  }
};








export const uploadLicensePhoto = (profile, file) => async (
  dispatch,
  getState,
  { getFirebase , getFirestore}
) => {
  const firebase = getFirebase();
  //const { isLoaded, isEmpty, ...updatedSkills } = skills;

  // const {labourPhotos} = labourProfile || []
  // let updatedLabourPhotos = labourPhotos || []
  // let updatedLabourProfile = labourProfile || {}
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
    console.log({file})
    let uploadedFile = await firebase.uploadFile(path, file, null, options);
    //get url of image
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
    //get userdoc from firestore

    profile.licensePhotoURL = downloadURL

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
   

    //updatedLabourPhotos.unshift(downloadURL)
    //updatedLabourProfile.labourPhotos = updatedLabourPhotos
   // console.log({updatedLabourProfile})
   await firestore.update(
    {
      collection: "onboarder_users",
      doc: user.uid
    },
    profile
  );
      const firestoreDirect = firebase.firestore();
 
    toastr.success("Success", "Photo Uploaded");
    dispatch(asyncActionFinish());
  } catch (error) {
    toastr.error("Ooops", "Photo was not ulpoaded");
    console.log(error);
    dispatch(asyncActionError());
  }
};





export const newRequestForOnboarding = ( values) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {


console.log({values})

    const firestore = getFirestore();
  



  try {
    dispatch(asyncActionStart());
    await firestore.add(
      {
        collection: "request_for_onboarding",
      },
      values 
    );
    toastr.success("Success", "Request has been processed");
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem processing request");
    dispatch(asyncActionError());
  }
};




export const claimRequest = ( requestId) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {



    const firestore = getFirestore();
  



  try {
    dispatch(asyncActionStart());

    const user = firestore.auth().currentUser;
    console.log({user})

    let onboarderDoc = await firestore.get(`onboarder_users/${user.uid}`);
    //check if user has photo , if not update profile w new image
    console.log('onboarder', onboarderDoc.data()) 
    await firestore.update(
      {
        collection: "request_for_onboarding",
        doc: requestId
      },
      {claimed:true,
      claimedDate: Date.now(),
      claimedByUID: user.uid,
      onboarderProfile: onboarderDoc.data().values
      
      }
    );
    toastr.success("Success", "Request has been clamined");
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem claming request");
    dispatch(asyncActionError());
  }
};