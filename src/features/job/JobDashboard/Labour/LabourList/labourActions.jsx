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
        console.log('ZERO SNAP LENGTH')
        dispatch(asyncActionFinish());
        return querySnap;
      }
  
      let labour = [];
      console.log('length', querySnap.docs.length)
      for (let i = 0; i < querySnap.docs.length; i++) {
        console.log('item', querySnap.docs[i].data())
        let evt = { ...querySnap.docs[i].data(), id: querySnap.docs[i].id };
        labour.push(evt);
      }
      
      console.log({labour})
      dispatch({
        type: FETCH_LABOUR,
        payload: { labour }
      });
      dispatch(asyncActionFinish());
    //  return querySnap;
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
    }
  };