import { toastr } from "react-redux-toastr";

import { FETCH_LABOUR } from "./labourConstants";
import firebase from "../../../../../app/config/firebase";
import {
    asyncActionStart,
    asyncActionFinish,
    asyncActionError
  } from "../../../../async/asyncActions";





  export const getLabourForList = () => async (dispatch, getState) => {
    let today = new Date(Date.now());
    console.log('today', today)
    const firestore = firebase.firestore();
    const labourRef = firestore.collection("labour_profiles");
    try {
      dispatch(asyncActionStart());
//SHOULD SORT BY AVERAGE RATING?
      let query = labourRef.where("profileListed", "==", true)
            
           
  
      let querySnap = await query.get();
      console.log('GET LABOUR FOR LIST', querySnap)
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
      dispatch(asyncActionFinish());
      return querySnap;
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
    }
  };