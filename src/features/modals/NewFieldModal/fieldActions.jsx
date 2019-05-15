import { toastr } from "react-redux-toastr";
import { FETCH_FIELD } from "./fieldConstants";
import firebase from "../../../app/config/firebase";
import moment from "moment";
import compareAsc from "date-fns/compare_asc";
import {
    asyncActionStart,
    asyncActionFinish,
    asyncActionError
  } from '../../async/asyncActions'

  import { createNewField } from "../../../app/common/util/helpers";

  export const uploadExamplePhoto = (field,exampleURL) => {
    const {payload} = field
    const {key, value} = payload
    return async (dispatch, getState, {getFirebase, getFirestore} )=> {
      dispatch(asyncActionStart());

      console.log('upload example photo key', key)
      console.log('upload example photo url', exampleURL)
      console.log('upload example photo value', value)

      const firestore = getFirestore();


      
      try {   


        let field = await firestore.get(`fields/${key}`);
         let fieldData = field.data()
        let examplePhotos = fieldData.examplePhotos || []
        examplePhotos.push({url:exampleURL, description:"Edit description...", title:"Edit title..."})
        fieldData.examplePhotos = examplePhotos
       // if (!field.data().exampleURL) {
          // await firestore.update({
          //   exampleURL: exampleURL
          // });
     //   }


   await  firestore.set(`fields/${key}`, fieldData)

        // await firestore.update(
        //   {
        //     collection: "fields",
        //     doc: key,
        //     subcollections: [{ collection: "examplePhotos" }]
        //   },
        //   {
        //     exampleURL: exampleURL
        //   }
        // );


        const payload = {key: key, value:fieldData}
    
        dispatch({
            type: FETCH_FIELD,
            payload: {payload}
        })
    

        dispatch(asyncActionFinish());
        toastr.success("Success", "Example photo has been uploaded");
        return exampleURL
      } catch (error) {
        dispatch(asyncActionError());
        toastr.error("Oops", "Something went wrong uploading photo");
        console.log(error)
      }
    };
  };


  export const updateExamplePhoto = (key,exampleURL) => {
    return async (dispatch, getState) => {
      dispatch(asyncActionStart());
      const firestore = firebase.firestore();

 
      try {   
        let fieldDocRef = firestore.collection("fields").doc(key);
     
          console.log('updating  example photo for', key)
          await fieldDocRef.update({exampleURL:exampleURL});

        dispatch(asyncActionFinish());
        toastr.success("Success", "Field photo has been  updated");
        return exampleURL
      } catch (error) {
        dispatch(asyncActionError());
        toastr.error("Oops", "Something went wrong updating field photo");
        console.log(error)
      }
    };
  };



  export const clearField = () => async (dispatch, getState) =>{


    try {
     dispatch(asyncActionStart())

   const payload = {}
    
    dispatch({
        type: FETCH_FIELD,
        payload: payload
    })

 
    dispatch (asyncActionFinish())

    } catch (error){
        console.log(error)
        dispatch(asyncActionError())
    }
      }



  export const selectFieldToEdit = fieldObj => async (dispatch, getState) =>{

    const firestore = firebase.firestore();
    console.log('selectFieldToEdit', fieldObj)
    try {
     dispatch(asyncActionStart())
    let fieldSnap = await firestore.collection("fields").doc(`${fieldObj.id}`).get()
    let field = fieldSnap.data()
   console.log({field})
   const payload = {key: fieldObj.id, value:field}
    
    dispatch({
        type: FETCH_FIELD,
        payload: {payload}
    })

 
    dispatch (asyncActionFinish())
    return field;
    } catch (error){
        console.log(error)
        dispatch(asyncActionError())
    }
      }



  export const createField = (field, icon, example, selectItems, ) => {
    return async (dispatch, getState, { getFirestore }) => {
      const firestore = getFirestore();

      //need to shape field for what we want to store inside firestore
      let newField = createNewField(field, icon, example, selectItems, );
  
      try {
        await firestore.add(`fields`, newField);
       
        toastr.success("Success", "Field has been created");
      } catch (error) {
        console.log(error)
        toastr.error("Oops", "Something went wrong");
      }
    };
  };


  export const updateField = (field, icon, key, example, selectItems, ) => {
    return async (dispatch, getState) => {
      dispatch(asyncActionStart());
      const firestore = firebase.firestore();
   //   field.date = moment(field.date).toDate();
       console.log('updateFied field', field)
       console.log('updateFied icon', icon)
       console.log()
       let newField = createNewField(field, icon,example, selectItems, );
      console.log({newField})
      try {
        let fieldDocRef = firestore.collection("fields").doc(key);
        // let dateEqual = compareAsc(
        //   getState().firestore.ordered.categories[0].date.toDate(),
        //   field.date
        // );
  
        // if (true) {
        //   let batch = firestore.batch();
        //   await batch.update(fieldDocRef, field);
        //   let fieldTasksRef = firestore.collection("form_fields");
        //   let fieldTasksQuery = await fieldTasksRef.where(
        //     "fieldId",
        //     "==",
        //     key
        //   );
        //   let fieldTasksQuerySnap = await fieldTasksQuery.get();
  
        //   for (let i = 0; i < fieldTasksQuerySnap.docs.length; i++) {
        //     let fieldTasksDocRef = await firestore
        //       .collection("field_tasks")
        //       .doc(fieldTasksQuerySnap.docs[i].id);
  
        //     await batch.update(fieldTasksDocRef, {
        //       fieldDate: field.date
        //     });
        //   }
  
        //   await batch.commit();
        // } else {
          await fieldDocRef.update(newField);
      //  }
  
        dispatch(asyncActionFinish());
        toastr.success("Success", "Field has been updated");
      } catch (error) {
        dispatch(asyncActionError());
        toastr.error("Oops", "Something went wrong");
        console.log(error)
      }
    };
  };