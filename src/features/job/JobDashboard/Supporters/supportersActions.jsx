
import moment from "moment";
import { toastr } from "react-redux-toastr";
import firebase from "../../../../app/config/firebase";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../../../async/asyncActions";



export const deleteSupporter = supporterId => async (
    dispatch,
    getState,
    { getFirebase, getFirestore }
  ) => {
    //const firebase = getFirebase();
 //   const firestore = getFirestore();
 //   const user = firebase.auth().currentUser;
    try {
        dispatch(asyncActionStart);
        var adaRef = firebase.database().ref(`/join_beta/${supporterId}`);
      await adaRef.remove()
      dispatch(asyncActionFinish);
      toastr.success("Success", "Supporter Deleted");
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError);
      toastr.error("Oops", "Problem deleting supporter");
      
    }
  };



  export const toggleChampion = (id, isAChampion) => async (dispatch) =>{
    try {
        dispatch(asyncActionStart);
        var adaRef = firebase.database().ref(`/join_beta/${id}`);
      await adaRef.update({isAChampion:isAChampion})
      dispatch(asyncActionFinish);
      toastr.success("Success", "Updated supplier");
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError);
      toastr.error("Oops", "Failed to update Is a supplier");
      
    }
  }

  export const toggleSupplier = (id, isASupplier) => async (dispatch) =>{
    try {
        dispatch(asyncActionStart);
        var adaRef = firebase.database().ref(`/join_beta/${id}`);
      await adaRef.update({isASupplier:isASupplier})
      dispatch(asyncActionFinish);
      toastr.success("Success", "Updated supplier");
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError);
      toastr.error("Oops", "Failed to update Is a supplier");
      
    }
  }




  export const toggleContractor = (id, isAContractor) => async (dispatch) =>{
    try {
        dispatch(asyncActionStart);
        var adaRef = firebase.database().ref(`/join_beta/${id}`);
      await adaRef.update({isAContractor:isAContractor})
      dispatch(asyncActionFinish);
      toastr.success("Success", "Updated contractor");
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError);
      toastr.error("Oops", "Failed to update Is a Contracto");
      
    }
  }


  


  export const selectIndustry = (id, industry) => async (dispatch) =>{
    try {
        dispatch(asyncActionStart);
        var adaRef = firebase.database().ref(`/join_beta/${id}`);
      await adaRef.update({industry:industry})
      dispatch(asyncActionFinish);
      toastr.success("Success", "Updated industry");
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError);
      toastr.error("Oops", "Failed to update Is a industry");
      
    }
  }