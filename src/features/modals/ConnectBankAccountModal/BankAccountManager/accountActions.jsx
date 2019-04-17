
import { FETCH_ACCOUNT, CLEAR_ACCOUNT } from "./accountConstants";
import {CLEAR_ROLE} from '../../../nav/Menus/roleConstants'
import cuid from "cuid";
import { toastr } from "react-redux-toastr";

import axios from "axios";

import {reset} from 'redux-form'

import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../../../async/asyncActions";
const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";



export const uploadGovernmentID = (
  file,
  fileName,
  userUID,
  accountToken
) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const imageName = cuid();
  const firebase = getFirebase();


  // 12 uid gOueUk3AjUPXvHMjjJ34FkVQAM13
  const user = firebase.auth().currentUser;
  const path = `${user.uid}/verification_document`;
  const options = {
    name: imageName,
    type: "verificationDoc"
  };

  dispatch(asyncActionStart());

  const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

  // upload the file to firebase storage
  let uploadedFile = await firebase.uploadFile(path, file, null, options);
  //get url of image
  let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
  let uploadedFileName = await uploadedFile.uploadTaskSnapshot.metadata.name;
  console.log({ downloadURL });
  console.log({ uploadedFileName });
  //testPath = "/assets/categoryImages/food.jpg"

  axios
    .post(
      `${ROOT_URL}/uploadID`,
      {
        userUID: userUID,
        file: downloadURL,
        fileName: uploadedFileName,
        accountToken: accountToken.value
      },
      {
        headers: {
          "content-type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    )
    .then(uploadResponse => {
      console.log("response from upload request", uploadResponse);
      const updateObj = {
        legal_entity: {
          verification: { document: uploadResponse.data.token}
        }
      };

      return axios.post(
        `${ROOT_URL}/updateAccount`,
        { accountToken: accountToken.value, metadata: updateObj },
        {
          headers: {
            "content-type": "application/json;charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    })
    .then(account => {
      console.log("updated Account returned from axios", account);
      dispatch({
        type: FETCH_ACCOUNT,
        payload: { account }
      });

      toastr.success("Success", "File Uploaded");
    return dispatch(asyncActionFinish());
    })
    .catch(error => {
      console.log(error.response);

      console.log(error);
      toastr.error("Oops", "Could not verify document");
      dispatch(asyncActionError());
    });
};


export const clearAccount = () => async (dispatch) =>{
  console.log("trying to clear account")
  dispatch({
    type: CLEAR_ACCOUNT,
    payload: {}
  })

  dispatch({
    type: CLEAR_ROLE,
    payload: {}
  })
}

export const createConnectedAccount = (userUID, countryCode) => async (
  dispatch,
  getState
) => {


  console.log("creating connected account")


  try {
    dispatch(asyncActionStart());

    let account = await axios.post(
      `${ROOT_URL}/createConnectedAccount`,
      { userUID: userUID, countryCode: countryCode  },
      {
        headers: {
          "content-type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    console.log("Created connected account..", account);

    dispatch({
      type: FETCH_ACCOUNT,
      payload: { account }
    });
    dispatch(asyncActionFinish());
    toastr.success("Success", "Created Connected Account");
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error("Problem creating connected account");
  }
};




export const updateTOS = accountToken => async dispatch => {
  console.log("updating TOS", accountToken);

  try {
    dispatch(asyncActionStart());

 //ISSUE need to grab date and ip properly
    const updateObj = {
      tos_acceptance: {
        date: 1234213213,
        ip: "69.11.6.98"
      }
    };

    let account = await axios.post(
      `${ROOT_URL}/updateAccount`,
      { accountToken: accountToken, metadata: updateObj },
      {
        headers: {
          "content-type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    console.log("updateTOS returned from axios", account);

    dispatch({
      type: FETCH_ACCOUNT,
      payload: { account }
    });
    dispatch(asyncActionFinish());
    toastr.success("Success", "Terms of Service Agreement Updated");
  } catch (err) {
    console.log({ err });
    dispatch(asyncActionError());
    toastr.error("Oops", "Could not update TOS");
  }
};

export const updateAccount = (accountToken, metadata) => async dispatch => {

  try {
    dispatch(asyncActionStart());
    console.log("updateAccount Token:", accountToken);
    if (metadata.tos_acceptance && metadata.tos_acceptance.date) {
      metadata.tos_acceptance.date = 1543277868;
    }
    if (metadata.tos_acceptance && metadata.tos_acceptance.ip) {
      metadata.tos_acceptance.ip = "69.11.6.98";
    }
    //request.connection.remoteAddress.replace(/^.*:/, '')
    console.log("metadata form update account", metadata);

    let account = await axios.post(
      `${ROOT_URL}/updateAccount`,
      { accountToken: accountToken, metadata: metadata },
      {
        headers: {
          "content-type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    console.log("getAccount returned from axios", account);

    dispatch({
      type: FETCH_ACCOUNT,
      payload: { account }
    });
    dispatch(reset('bankAccountForm'))
    dispatch(asyncActionFinish());
    toastr.success("Success", "Information sent to Stripe");
  } catch (err) {
    console.log({ err });
    dispatch(asyncActionError());
    toastr.error("Oops", "Could not send information to Stripe");
  }
};

export const getAccount = accountToken => async dispatch => {

  try {
    dispatch(asyncActionStart());

    if(accountToken){
      console.log("getAccount accountToken prop", accountToken);
      let account = await axios.post(
        `${ROOT_URL}/retrieveAccount`,
        { accountToken: accountToken },
        {
          headers: {
            "content-type": "application/json;charset=utf-8",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
      console.log("getAccount returned from axios", account);
      dispatch({
        type: FETCH_ACCOUNT,
        payload: { account }
      });
    
      dispatch(asyncActionFinish());
      return account;
    } else{
      console.log("dispatching empty asccount")
      dispatch({
        type: FETCH_ACCOUNT,
        payload: {}
      });
    }
   
 
  } catch (err) {
    console.log({ err });
    dispatch(asyncActionError());
  }
};

export const addBankAccount = (params, accountToken) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;

  console.log("addBankAccount params", params);


 
  try {
    dispatch(asyncActionStart());

    let bankAccountResponse = await axios.post(
      `${ROOT_URL}/createBankAccount`,
      { params: params },
      {
        headers: {
          "content-type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    console.log("Response  returned from axios", bankAccountResponse);
    const bankToken = bankAccountResponse.data.token.id;
    await firebase.push(
      `/stripe_bank_accounts/${user.uid}/bank_token`,
      bankToken
    );

    let externalBankAccountResponse = await axios.post(
      `${ROOT_URL}/createExternalBankAccount`,
      { bankToken: bankToken, accountToken: accountToken.value },
      {
        headers: {
          "content-type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
    const externalBankToken = externalBankAccountResponse.data.bankAccount.id;
    console.log({ externalBankToken });
    await firebase.push(
      `/stripe_external_bank_accounts/${user.uid}/external_bank_token`,
      externalBankToken
    );

    toastr.success("Success", "Bank account added");
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error("Problem adding bank account");
  }
};
