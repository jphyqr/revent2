import { toastr } from "react-redux-toastr";
import moment from "moment";
import { createNewJournalEntry } from "../../../../app/common/util/helpers"
import firebase from "../../../../app/config/firebase";
import format from 'date-fns/format'
import {
    asyncActionStart,
    asyncActionFinish,
    asyncActionError
  } from "../../../async/asyncActions";

export const addJournalEntry = (day, dayIndex, values) => {
    return async (dispatch, getState, { getFirestore }) => {
      dispatch(asyncActionStart());
      console.log("add Journal entry ", values);
      const firestore = getFirestore();
      const user = firestore.auth().currentUser;
      const photoURL = getState().firebase.profile.photoURL;
      const string = format(moment(day).toDate(), "ddd Do YYYY")
      let newJournalEntry = createNewJournalEntry(user, photoURL, values); //empty object as no values yet
      console.log({ newJournalEntry });
  
      try {
     //   let createdEntry = await firestore.add(`journals/${day}/enteries`, newJournalEntry);
        await firestore.add(
            {
              collection: "journals",
              doc: string,
              subcollections: [{ collection: "enteries" }]
            },
            {
              newJournalEntry
            })
        dispatch(asyncActionFinish());
      
      } catch (error) {
        dispatch(asyncActionFinish());
        console.log(error);
        toastr.error("Oops", "Could not add journal entry");
      }
    };
  };