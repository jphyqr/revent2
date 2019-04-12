import { toastr } from "react-redux-toastr";

import { FETCH_CONTRACT, CLEAR_CONTRACT } from "./contractConstants";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../../../../async/asyncActions";
import moment from "moment";

import firebase from "../../../../../app/config/firebase";

import {objectToArray} from '../../../../../app/common/util/helpers'
export const clearContract = () => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart());
    console.log("clearing  quote");
    try {
      dispatch({ type: CLEAR_CONTRACT, payload: {} });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionFinish());
      console.log(error);
      toastr.error("Oops", "Could not create quote");
    }
  };
};



export const selectContract = contract => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart());
    const {id: contractId} = contract ||{}
     console.log("select Contract quote Id", contract);
    const firestore = getFirestore();

    try {
      let contractDoc = await firestore.get(`job_contracts/${contractId}`);
      console.log({ contractDoc });
      let contract = contractDoc.data();
     

      dispatch({
        type: FETCH_CONTRACT,
        payload: { contract }
      });

      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionFinish());
      console.log(error);
      toastr.error("Oops", "Could not get contract");
    }
  };
};
