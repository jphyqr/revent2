import { toastr } from "react-redux-toastr";

import { FETCH_JOBS } from "./jobConstants";
import {FETCH_DRAFT} from '../build/draftConstants'
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
import moment from "moment";
import { createNewJob } from "../../app/common/util/helpers";
import firebase from "../../app/config/firebase";
import compareAsc from "date-fns/compare_asc";
import { addMinutes } from "date-fns";

export const subscribeToJob = currentJob => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart());
    //UPDATE : NEED TO MOVE ALL OUR CATEGORIES TO FIRESTORE SO CAN ATTEND/QUERY

    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;

    try {
      await firestore.set(`task_subscribed/${currentJob.id}_${user.uid}`, {
        userUid: user.uid,
        active: true,
        created: Date.now(),
        taskId: currentJob.id,
        photoURL: photoURL || "/assets/user.png"
      });

      dispatch(asyncActionFinish());
      toastr.success("Success", "Subscribed to category");
    } catch (error) {
      dispatch(asyncActionFinish());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};

export const createJobDraft = (job, jobId) => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart());
    console.log("createJobDraft job", job);
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;

    let newJobInDraft = createNewJob(user, photoURL, job, { taskID: jobId }); //empty object as no values yet
    console.log({ newJobInDraft });

    try {
      let createdJob = await firestore.add(`jobs`, newJobInDraft);

      await firestore.set(`job_attendee/${createdJob.id}_${user.uid}`, {
        jobId: createdJob.id,
        created: newJobInDraft.created,
        title: newJobInDraft.title,
        userUid: user.uid,
        owner: true,
        taskID: newJobInDraft.taskID,
        taskName: newJobInDraft.name,
        inDraft: newJobInDraft.inDraft
      });
      dispatch(asyncActionFinish());
      return createdJob;
    } catch (error) {
      dispatch(asyncActionFinish());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};

export const createJob = job => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    //dont need to bring in getFIrebase just to get the user
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL; //can hook into redux state get whatever we want: firebase is the reducer
    //need to shape job for what we want to store inside firestore
    let newJob = createNewJob(user, photoURL, job);

    console.log('createJob after showstate', newJob)
    try {
      let createdJob = await firestore.add(`jobs`, newJob);
      await firestore.set(`job_attendee/${createdJob.id}_${user.uid}`, {
        jobId: createdJob.id,
        userUid: user.uid,
        jobDate: job.date,
        title: createdJob.title,
        inDraft: true,
        owner: true
      });
      toastr.success("Success", "Job has been created");
    } catch (error) {
      toastr.error("Oops", "Something went wrong");
    }
  };
};

export const uploadJobPhoto = (key,jobPhotoURL) => {
  return async (dispatch, getState, {getFirebase, getFirestore} )=> {
    dispatch(asyncActionStart());

    console.log('upload job photo key', key)
    console.log('upload job photo url', jobPhotoURL)

    const firestore = getFirestore();


    
    try {   


      let job = await firestore.get(`jobs/${key}`);
       let jobData = job.data()
      let jobPhotos = jobData.jobPhotos || []
      jobPhotos.push({url:jobPhotoURL})
      jobData.jobPhotos = jobPhotos



 await  firestore.set(`jobs/${key}`, jobData)

      // await firestore.update(
      //   {
      //     collection: "fields",
      //     doc: key,
      //     subcollections: [{ collection: "examplePhotos" }]
      //   },
      //   {
      //     exampleURL: exampleURL
      //   }
      // );


      const payload = {key: key, value:jobData}
  
      dispatch({
          type: FETCH_DRAFT,
          payload: {payload}
      })
  

      dispatch(asyncActionFinish());
      toastr.success("Success", "Example job photo uploaded");
    } catch (error) {
      dispatch(asyncActionError());
      toastr.error("Oops", "Something went wrong uploading job photo");
      console.log(error)
    }
  };
};

export const updateJob = (draft, values, timesSelected, draftState) => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());
    const { key: jobId, value: draftValues } = draft;
    console.log({ draft });
    let showState = {showCustom:false, showBasic:false, showContract:false, showConfirm:false, showSchedule:false, showOverview:false}
    console.log({draftState})
   
    switch(draftState){
      case "showCustom" :
       showState.showCustom = true
       console.log('clicked showCustom')
      break;
      case "showBasic" :
      showState.showBasic = true
      break;
      case "showContract":
      showState.showContract = true
      break;
      case "showConfirm" :
      showState.showConfirm = true
      
      break;
      case "showSchedule" :
      showState.showSchedule = true
      
      break;
      case "showOverview" :
      showState.showOverview = true
      
      break;

      default: 
      showState.showBasic = true
      
      break;
    }
    console.log({showState})
    values.showState=showState
    const firestore = firebase.firestore();
    values.date = moment(values.date).toDate();
    values.startDate = moment(values.startDate).toDate();
    values.timesSelected = timesSelected
    try {
      let jobDocRef = firestore.collection("jobs").doc(jobId);
      let dateEqual = compareAsc(draftValues.date.toDate(), values.date);
      //ALERT, changed from check on date switch, should INVESTIGATE from videos what this was done for
      if (true) {
        let batch = firestore.batch();
        await batch.update(jobDocRef, values);
        let jobAttendeeRef = firestore.collection("job_attendee");
        let jobAttendeeQuery = await jobAttendeeRef.where("jobId", "==", jobId);
        let jobAttendeeQuerySnap = await jobAttendeeQuery.get();

        for (let i = 0; i < jobAttendeeQuerySnap.docs.length; i++) {
          let jobAttendeeDocRef = await firestore
            .collection("job_attendee")
            .doc(jobAttendeeQuerySnap.docs[i].id);

          await batch.update(jobAttendeeDocRef, {
            jobDate: values.date,
            title: values.title
          });
        }

        await batch.commit();
      } else {
        await jobDocRef.update(values);
      }


      const payload = {key: jobId, value:values}

      dispatch({
          type: FETCH_DRAFT,
          payload: {payload}
      })

      dispatch(asyncActionFinish());
      toastr.success("Success", "Job has been updated");
    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};

export const cancelToggle = (cancelled, jobId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const message = cancelled
    ? "Are you sure you want to cancel the job?"
    : "This wil reactivate the job - are you sure?";
  try {
    toastr.confirm(message, {
      onOk: () =>
        firestore.update(`jobs/${jobId}`, {
          cancelled: cancelled
        })
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobsForDashboard = lastJob => async (dispatch, getState) => {
  let today = new Date(Date.now());
  const firestore = firebase.firestore();
  const jobsRef = firestore.collection("jobs");
  try {
    dispatch(asyncActionStart());
    let startAfter =
      lastJob &&
      (await firestore
        .collection("jobs")
        .doc(lastJob.id)
        .get());
    let query;

    lastJob
      ? (query = jobsRef
          //#DATE UPDATE JOBS
          .where("inDraft", "==", false)
          //   .where("date", ">=", today)
          //   .orderBy("date")
          .startAfter(startAfter))
      : //     .limit(4)
        (query = jobsRef.where("inDraft", "==", false));
        //   .where("date", ">=", today)
        //    .orderBy("date")
        //    .limit(4)

    let querySnap = await query.get();

    if (querySnap.docs.length === 0) {
      dispatch(asyncActionFinish());
      return querySnap;
    }

    let jobs = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
      jobs.push(evt);
    }

    dispatch({
      type: FETCH_JOBS,
      payload: { jobs }
    });
    dispatch(asyncActionFinish());
    return querySnap;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const addJobComment = (jobId, values, parentId) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  let newComment = {
    parentId: parentId,
    displayName: profile.displayName,
    photoURL: profile.photoURL || "/assets/user.png",
    uid: user.uid,
    text: values.comment,
    date: Date.now()
  };
  try {
    await firebase.push(`job_chat/${jobId}`, newComment);
  } catch (error) {
    console.log(error);
    toastr.error("Oops", "Problem adding comments");
  }
};
