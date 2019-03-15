import { toastr } from "react-redux-toastr";

import { FETCH_QUOTE, CLEAR_QUOTE } from "./quoteConstants";
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../../async/asyncActions";
import moment from "moment";
import { createNewQuote } from "../../../app/common/util/helpers";
import firebase from "../../../app/config/firebase";
import compareAsc from "date-fns/compare_asc";
import {objectToArray} from '../../../app/common/util/helpers'
export const clearQuote = () => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart());
    console.log("clearing  quote");
    try {
      dispatch({ type: CLEAR_QUOTE, payload: {} });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionFinish());
      console.log(error);
      toastr.error("Oops", "Could not create quote");
    }
  };
};

export const createQuote = job => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart());
    console.log("createQuote quote", job);
    const firestore = getFirestore();
    const user = firestore.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    const { value: jobValues, key: jobId } = job;

    let newQuoteInDraft = createNewQuote(user, photoURL, jobValues, {
      jobId: jobId
    }); //empty object as no values yet
    console.log({ newQuoteInDraft });

    try {
      let createdQuote = await firestore.add(`quotes`, newQuoteInDraft);

      await firestore.set(
        {
          collection: "users",
          doc: user.uid,
          subcollections: [{ collection: "quotes" , doc: `${createdQuote.id}`}]
        },
        {
          quoteId: createdQuote.id,
          jobId: jobId
        }
      );
      //this step is not needed now , do it when the quote is confirmed, or editted
      // await firestore.set(`quote_attendee/${createdQuote.id}_${user.uid}`, {
      //   quoteId: createdQuote.id,
      //   created: newQuoteInDraft.created,
      //   title: newQuoteInDraft.title,
      //   userUid: user.uid,
      //   owner: true,
      //   taskID: newQuoteInDraft.taskID,
      //   taskName: newQuoteInDraft.name,
      //   inDraft: newQuoteInDraft.inDraft
      // });

      console.log("created quote", createdQuote);
      const quote = { ...newQuoteInDraft, quoteId: createdQuote.id };
      console.log("quote with ID", quote);

      dispatch({ type: FETCH_QUOTE, payload: { quote } });
      dispatch(asyncActionFinish());
      return createdQuote;
    } catch (error) {
      dispatch(asyncActionFinish());
      console.log(error);
      toastr.error("Oops", "Could not create quote");
    }
  };
};

export const selectQuoteToEdit = quoteId => {
  return async (dispatch, getState, { getFirestore }) => {
    dispatch(asyncActionStart());

    console.log("selectQuoteToEdit quote Id", quoteId);
    const firestore = getFirestore();

    try {
      let quoteDoc = await firestore.get(`quotes/${quoteId}`);
      console.log({ quoteDoc });
      let quoteData = quoteDoc.data();
      const quote = { ...quoteData, quoteId: quoteId };
      console.log("selectQuoteToEdit", quote);

      dispatch({
        type: FETCH_QUOTE,
        payload: { quote }
      });

      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionFinish());
      console.log(error);
      toastr.error("Oops", "Could not get quote");
    }
  };
};

export const goBackToStep = (quote, step) => {
  return async (dispatch, getState) => {
    console.log({ step });
    dispatch(asyncActionStart());
    let showState = {
      showBidType: false,
      showLineItems: false,
      showSchedule: false,
      showNotes: false,
      showPayments: false,
      showConfirm: false
    };

    switch (step) {
      case "showBidType":
        showState.showBidType = true;
        break;
      case "showLineItems":
      showState.showLineItems = true;
      break;
      case "showSchedule":
      showState.showSchedule = true
      break;
      case "showNotes":
      showState.showNotes = true
      break;
      case "showPayments":
      showState.showPayments = true
      break;
      case "showConfirm":
      showState.showConfirm = true
      break;
      default:
    }

    quote.showState = showState;
    const firestore = firebase.firestore();

    try {
      let quoteRef = firestore.collection("quotes").doc(quote.quoteId);

      await quoteRef.update(quote);

      dispatch({
        type: FETCH_QUOTE,
        payload: { quote }
      });

      dispatch(asyncActionFinish());
      toastr.success("Success", "Job has been updated");
    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};







export const updateQuoteBid = (quote, bidType) => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());
    //   const { key: jobId, value: draftValues } = quote;
    console.log({ quote });
    console.log({ bidType });
    let showState = {
      showBidType: false,
      showLineItems: true,
      showSchedule: false,
      showNotes: false,
      showPayments: false,
      showConfirm: false
    };

    quote.showState = showState;

    const firestore = firebase.firestore();
    quote.bidType = bidType;
    try {
      let quoteRef = firestore.collection("quotes").doc(quote.quoteId);
      if (true) {
   
        await quoteRef.update(quote);
      }

      //       const payload = {key: jobId, value:draftValues}

      dispatch({
        type: FETCH_QUOTE,
        payload: { quote }
      });

      dispatch(asyncActionFinish());
      toastr.success("Success", "Job has been updated");
    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};



const calculateTotalandTax = (quote, phase, values) =>{
  let oldTotals = quote.lineItems.totals
  let deposit = Number(values[`${phase.phaseName}_deposit`])
  let due = Number(values[`${phase.phaseName}_due`])
  let taxType = values[`${phase.phaseName}_tax`]

  let total = due+deposit
  let taxRate

   


  switch(taxType){
    case 'gst5pst5':
      taxRate = 0.1
    break;
    case 'gst5':
    taxRate=0.05
    break
    case 'pst5':
    taxRate=0.05
    break;
    case 'noTax':
    taxRate=0.00
    break;
    default:
    taxRate=0.00
  }

  let tax = total*taxRate;
  let sum = tax+total
   oldTotals.tax = ++tax
  return {tax:tax, sum:sum, total:total}
}

export const updateLineItem = (quote, isNew, values, phase) => {
  return async (dispatch, getState) => {
  
    dispatch(asyncActionStart());
    const {phaseName} = phase

    const dueMatch = `${phaseName}_due`
    const depositMatch = `${phaseName}_deposit`
    const taxMatch = `${phaseName}_tax`
    
  
    
    console.log('updateLineItem', quote)
    console.log('updateLineItem', isNew)
    console.log('updateLineItem', values)
    console.log('updateLineItem', phase)
    console.log('updateLineItem', values[dueMatch])
  

    const due = Number(values[dueMatch])
    const deposit = Number(values[depositMatch])
    const subtotal =  due+deposit
    const tax =   values[taxMatch] 
    let taxRate = 0
    switch(tax){
      case 'gst5pst5':
        taxRate = 0.1
      break;
      case 'gst5':
      taxRate=0.05
      break
      case 'pst5':
      taxRate=0.05
      break;
      case 'noTax':
      taxRate=0.00
      break;
      default:
      taxRate=0.00
    }

  


    const calculatedTax = subtotal*taxRate
    const total = subtotal+calculatedTax

    const updatedLineItem = {[`${phaseName}_due`]:due, [`${phaseName}_deposit`]:deposit, subtotal, [`${phaseName}_tax`]:tax, calculatedTax, total}
    let lineItems = quote.lineItems || {}

    lineItems[phaseName] = updatedLineItem
    quote.lineItems = lineItems

   console.log('updatedLineItem', quote)
 
    // have updated line items, now lets loop and calc
    //totals
    //to doo this we need a list of all the phases

    //now our line items are stored by phase
    //we should be able to calculate the totals for the entire bill knowing which
    //phase updated
    //let totals = calculateTotalandTax(quote, phase, values)
  //  quote.lineItems.totals = totals
    const firestore = firebase.firestore();

    try {
      let quoteRef = firestore.collection("quotes").doc(quote.quoteId);

      await quoteRef.update(quote);

      dispatch({
        type: FETCH_QUOTE,
        payload: { quote }
      });

      dispatch(asyncActionFinish());
      toastr.success("Success", "Job has been updated");
    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};



export const updateLineItemNext = (quote, total) => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());

    let showState = {
      showBidType: false,
      showLineItems: false,
      showSchedule: true,
      showNotes: false,
      showPayments: false,
      showConfirm: false
    };

    quote.showState = showState;
   quote.total=total
    const firestore = firebase.firestore();
  
    try {
      let quoteRef = firestore.collection("quotes").doc(quote.quoteId);
      if (true) {
   
        await quoteRef.update(quote);
      }

  
      dispatch({
        type: FETCH_QUOTE,
        payload: { quote }
      });

      dispatch(asyncActionFinish());

    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};




 export const updateSchedule = (quote, startDate, startHour, values) => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());

    let showState = {
      showBidType: false,
      showLineItems: false,
      showSchedule: false,
      showNotes: true,
      showPayments: false,
      showConfirm: false
    };
    let completionDate = moment(values.completionDate).toDate();
    quote.showState = showState;
   quote.schedule={startDate,startHour, completionDate}
    const firestore = firebase.firestore();
  
    try {
      let quoteRef = firestore.collection("quotes").doc(quote.quoteId);
      if (true) {
   
        await quoteRef.update(quote);
      }

  
      dispatch({
        type: FETCH_QUOTE,
        payload: { quote }
      });

      dispatch(asyncActionFinish());

    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};



export const updateNotes = (quote, values) => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());

    let showState = {
      showBidType: false,
      showLineItems: false,
      showSchedule: false,
      showNotes: false,
      showPayments: true,
      showConfirm: false
    };
  
    quote.showState = showState;
   quote.notes=values.notes
    const firestore = firebase.firestore();
  
    try {
      let quoteRef = firestore.collection("quotes").doc(quote.quoteId);
      if (true) {
   
        await quoteRef.update(quote);
      }

  
      dispatch({
        type: FETCH_QUOTE,
        payload: { quote }
      });

      dispatch(asyncActionFinish());

    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};





export const updatePaymentType = (quote, paymentType) => {
  return async (dispatch, getState) => {
    dispatch(asyncActionStart());


    let showState = {
      showBidType: false,
      showLineItems: false,
      showSchedule: false,
      showNotes: false,
      showPayments: false,
      showConfirm: true
    };

    quote.showState = showState;

    const firestore = firebase.firestore();
    quote.paymentType = paymentType;
    try {
      let quoteRef = firestore.collection("quotes").doc(quote.quoteId);
      if (true) {
   
        await quoteRef.update(quote);
      }

      //       const payload = {key: jobId, value:draftValues}

      dispatch({
        type: FETCH_QUOTE,
        payload: { quote }
      });

      dispatch(asyncActionFinish());
      toastr.success("Success", "Job has been updated");
    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};



export const updateSubmitQuote = (quote) => {
  return async (dispatch, getState, {getFirestore}) => {
    dispatch(asyncActionStart());
   const {jobId, quoteId, quoterUid} = quote



    let firestore = getFirestore();
    quote.submitted = true;
    try {

    let userSnap = await firestore.get(`users/${quoterUid}`)

        let user = userSnap.data();
    
    firestore=firebase.firestore()  
      console.log ('updateSubmitQuote', user)
      let quoteRef = firestore.collection("quotes").doc(quote.quoteId);
      let jobQuotesRef = firestore.collection("job_quotes")
      .doc(`${jobId}_${quoteId}`)
      

      let userQuotesRef = firestore.collection("users").doc(quoterUid).collection("quotes").doc(quote.quoteId)


await firestore.runTransaction(async transaction =>{
  await transaction.update(quoteRef, quote)
  await transaction.update(userQuotesRef, {submitted: true})
  await transaction.set(jobQuotesRef,{
...quote,
quoterRating: user.rating||0,
quoterVolume: user.volume||0,
quoterIsContractor: user.isContractor||false
  } )
})

      // if (true) {
   
      //   await quoteRef.update(quote);
      // }

      //       const payload = {key: jobId, value:draftValues}

      dispatch({
        type: FETCH_QUOTE,
        payload: { quote }
      });

      dispatch(asyncActionFinish());
      toastr.success("Success", "Quote has been submitted");
    } catch (error) {
      dispatch(asyncActionError());
      console.log(error);
      toastr.error("Oops", "Something went wrong");
    }
  };
};
