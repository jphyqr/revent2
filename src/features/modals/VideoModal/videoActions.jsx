import { FETCH_VIDEO } from "./videoConstants";


import firebase from "../../../app/config/firebase";
import {
    asyncActionStart,
    asyncActionFinish,
    asyncActionError
  } from '../../async/asyncActions'





  export const selectVideoToWatch = videoId => async (dispatch, getState) =>{

console.log('selectVideoToWatch')

  const firestore = firebase.firestore();
  const video = {videoId}
  // let draftUserId= draft.id
  // let draftId = draftUserId.split('_')[0]
  try {
   dispatch(asyncActionStart())

  dispatch({
      type: FETCH_VIDEO,
      payload: {video}
  })
  dispatch (asyncActionFinish())
  } catch (error){
      console.log(error)
      dispatch(asyncActionError())
  }
    }