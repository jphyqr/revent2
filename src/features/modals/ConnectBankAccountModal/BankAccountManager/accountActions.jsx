import moment from "moment";
import { FETCH_ACCOUNT } from "./accountConstants";
import cuid from "cuid";
import { toastr } from "react-redux-toastr";
import axios from "axios";
import firebase from "../../../../app/config/firebase";
import { request } from "http";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../../../async/asyncActions";

export const updateAccount = (accountToken, metadata) => async dispatch => {
  const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

  try {
    dispatch(asyncActionStart());
    console.log("updateAccount Token:", accountToken);
    if (metadata.tos_acceptance&&metadata.tos_acceptance.date) {
      metadata.tos_acceptance.date = 1543277868;
    }
    if (metadata.tos_acceptance&&metadata.tos_acceptance.ip) {
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

    let updatedAccount = getAccount(accountToken);
    console.log({ updatedAccount });
    dispatch(asyncActionFinish());
    toastr.success("Success", "Information sent to Stripe");
  } catch (err) {
    console.log({ err });
    dispatch(asyncActionError());
    toastr.error("Oops", "Could not send information to Stripe");
  }
};

export const getAccount = accountToken => async dispatch => {
  const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

  try {
    dispatch(asyncActionStart());
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

  console.log("addBankAccount params", params)

  // stripe.createToken('bank_account', params).then(({token})  =>{
  //   console.log('BankAccountForm token', token)
  //   this.props.addBankAccount(params)
  const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

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
const bankToken  = bankAccountResponse.data.token.id
 await firebase.push(`/stripe_bank_accounts/${user.uid}/bank_token`, bankToken);
 
 
 let externalBankAccountResponse = await axios.post(
  `${ROOT_URL}/createExternalBankAccount`,
  { bankToken:bankToken, accountToken:accountToken.value },
  {
    headers: {
      "content-type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  }
);
const externalBankToken  = externalBankAccountResponse.data.bankAccount.id
console.log({externalBankToken})
await firebase.push(`/stripe_external_bank_accounts/${user.uid}/external_bank_token`, externalBankToken);
 
  toastr.success("Success", "Bank account added");
    dispatch(asyncActionFinish());
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
    throw new Error("Problem adding bank account");
  }
};