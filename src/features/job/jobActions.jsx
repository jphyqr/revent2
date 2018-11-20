import { toastr } from "react-redux-toastr";

import { FETCH_JOBS } from "./jobConstants";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions";
import moment from "moment";
import { createNewJob } from "../../app/common/util/helpers";
import firebase from "../../app/config/firebase";
import compareAsc from "date-fns/compare_asc";

export const createJob = job => {
  return async (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    //dont need to bring in getFIrebase just to get the user
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL; //can hook into redux state get whatever we want: firebase is the reducer
    //need to shape job for what we want to store inside firestore
    let newJob = createNewJob(user, photoURL, job);

    try {
      let createdJob = await firestore.add(`jobs`, newJob);
      await firestore.set(`job_attendee/${createdJob.id}_${user.uid}`, {
        jobId: createdJob.id,
        userUid: user.uid,
        jobDate: job.date,
        owner: true
      });
      toastr.success("Success", "Job has been created");
    } catch (error) {
      toastr.error("Oops", "Something went wrong");
    }
  };
};

export const updateJob = job => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());
    const firestore = firebase.firestore();
    job.date = moment(job.date).toDate();

    try {
      let jobDocRef = firestore.collection("jobs").doc(job.id);
      let dateEqual = compareAsc(
        getState().firestore.ordered.jobs[0].date.toDate(),
        job.date
      );

      if (dateEqual !== 0) {
        let batch = firestore.batch();
        await batch.update(jobDocRef, job);
        let jobAttendeeRef = firestore.collection("job_attendee");
        let jobAttendeeQuery = await jobAttendeeRef.where(
          "jobId",
          "==",
          job.id
        );
        let jobAttendeeQuerySnap = await jobAttendeeQuery.get();

        for (let i = 0; i < jobAttendeeQuerySnap.docs.length; i++) {
          let jobAttendeeDocRef = await firestore
            .collection("job_attendee")
            .doc(jobAttendeeQuerySnap.docs[i].id);

          await batch.update(jobAttendeeDocRef, {
            jobDate: job.date
          });
        }

        await batch.commit();
      } else {
        await jobDocRef.update(job);
      }

      dispatch(asyncActionFinish());
      toastr.success("Success", "Job has been updated");
    } catch (error) {
      dispatch(asyncActionError());
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

export const getJobsForDashboard = lastJob => async (
  dispatch,
  getState
) => {
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
          .where("date", ">=", today)
          .orderBy("date")
          .startAfter(startAfter)
          .limit(4))
      : (query = jobsRef
          .where("date", ">=", today)
          .orderBy("date")
          .limit(4));

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
