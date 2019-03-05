
import { toastr } from "react-redux-toastr";
import { FETCH_DRAFT } from "./draftConstants";
import firebase from "../../app/config/firebase";
import {
    asyncActionStart,
    asyncActionFinish,
    asyncActionError
  } from '../async/asyncActions'

  export const selectDraftToEdit = draftId => async (dispatch, getState) =>{

  console.log('selectDraftoEdit draft', draftId)
const firestore = firebase.firestore();
// let draftUserId= draft.id
// let draftId = draftUserId.split('_')[0]
try {
 dispatch(asyncActionStart())
let draftSnap = await firestore.collection("jobs").doc(draftId).get()
let draft = draftSnap.data()
 const payload = {key: draftId, value:draft}

dispatch({
    type: FETCH_DRAFT,
    payload: {payload}
})
dispatch (asyncActionFinish())
} catch (error){
    console.log(error)
    dispatch(asyncActionError())
}
  }



  export const postToggle = (posted, jobId) => async (dispatch, getState, {getFirestore}) =>{

    const firestore = getFirestore();
    const userUid = firestore.auth().currentUser.uid;

    const message = posted
    ? "This will dispatch the job to local contractors. Are you sure?"
    : "This will de-list the job, are you sure?";
    try {
        toastr.confirm(message, {
            onOk: () =>
             {
               firestore.update(`jobs/${jobId}`, {
                inDraft: !posted
              }).then(()=>{
                firestore.update(`job_attendee/${jobId}_${userUid}`, {inDraft:!posted})
              })
             
            }
         
          });

          let draftSnap = await firestore.collection("jobs").doc(jobId).get()
          let draft = draftSnap.data()
           const payload = {key: jobId, value:draft}
          
          dispatch({
              type: FETCH_DRAFT,
              payload: {payload}
          })
    } catch (error){
        console.log(error)
        dispatch(asyncActionError())
    }
      }



      export const cancelToggle = (cancelled, eventId) => async (
        dispatch,
        getState,
        { getFirestore }
      ) => {
        const firestore = getFirestore();
        const message = cancelled
          ? "Are you sure you want to cancel the event?"
          : "This wil reactivate the event - are you sure?";
        try {
          toastr.confirm(message, {
            onOk: () =>
              firestore.update(`events/${eventId}`, {
                cancelled: cancelled
              })
          });
        } catch (error) {
          console.log(error);
        }
      };