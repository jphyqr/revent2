import moment from "moment";
import { toastr } from "react-redux-toastr";
import { FETCH_ACCOUNT } from "./accountConstants";
import cuid from "cuid";
import axios from 'axios'
import firebase from "../../../../app/config/firebase";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../../../async/asyncActions";




export const getAccount = accountToken => async(dispatch) =>{
    const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";
  
    try {
      dispatch(asyncActionStart());
      console.log("getAccount accountToken prop", accountToken)
    let account=  await axios.post(`${ROOT_URL}/retrieveAccount`, {accountToken: accountToken}, {
        headers: {
          "content-type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
      console.log('getAccount returned from axios', account);
      
      dispatch({
        type: FETCH_ACCOUNT,
        payload: { account }
      });
      dispatch(asyncActionFinish());
      return account;
  
    } catch (err) {
      console.log({ err });
      dispatch(asyncActionError());
    }
  }