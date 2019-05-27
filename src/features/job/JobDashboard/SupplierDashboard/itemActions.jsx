import { toastr } from "react-redux-toastr";

import { FETCH_ITEM } from "./itemConstants";
import cuid from 'cuid'
import {
    asyncActionStart,
    asyncActionFinish,
    asyncActionError
  } from "../../../async/asyncActions";


  import firebase from "../../../../app/config/firebase";

  import { createNewItem } from "../../../../app/common/util/helpers";

  import { objectToArray } from "../../../../app/common/util/helpers";



  export const deleteItem = (item) => {
    return async (dispatch, getState, { getFirestore }) => {
      const firestore = getFirestore();
      dispatch(asyncActionStart());
  
  
   
    
      try {
      
        await firestore.delete(`items/${item.id}`);
        //  }
  
        dispatch(asyncActionFinish());
        toastr.success("Success", "Item has been deleted");
      } catch (error) {
        dispatch(asyncActionError());
        toastr.error("Oops", "Something went wrong");
        console.log(error);
      }
    };
  };
  
  

  export const createItem = fieldId => {
    return async (dispatch, getState, { getFirestore }) => {
      dispatch(asyncActionStart());
  
      const firestore = getFirestore();

    
  
      try {


        //get User who is posting job
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;

        //get field 
        let fieldDoc = await firestore.get(`fields/${fieldId}`);
        console.log({ fieldDoc });
        let fieldData = fieldDoc.data();

        let newItemInDraft = createNewItem(fieldData, fieldId, user)


        let createdItem = await firestore.add(`items`, newItemInDraft);
  
        await firestore.set(
          {
            collection: "users",
            doc: user.uid,
            subcollections: [{ collection: "items", doc: `${createdItem.id}` }]
          },
          {
            itemId: createdItem.id,
            
          }
        );
 
  
      
        const item = { ...newItemInDraft, itemId: createdItem.id };
   
  
        dispatch({ type: FETCH_ITEM, payload: { item } });
        dispatch(asyncActionFinish());
        return createdItem;
      } catch (error) {
        dispatch(asyncActionFinish());
        console.log(error);
        toastr.error("Oops", "Could not create quote");
      }
    };
  };



  export const editItem = i => {
    return async (dispatch, getState, { getFirestore }) => {
      dispatch(asyncActionStart());
  
      const firestore = getFirestore();

    
  
      try {


      
        //get field 
        let itemDoc = await firestore.get(`items/${i.id}`);
        console.log({ itemDoc });
        let data = itemDoc.data();

        const item = { ...data, itemId: i.id };
   
    
  
        dispatch({ type: FETCH_ITEM, payload: { item } });
        dispatch(asyncActionFinish());
        return item;
      } catch (error) {
        dispatch(asyncActionFinish());
        console.log(error);
        toastr.error("Oops", "Could not create quote");
      }
    };
  };




  export const updateItemPhoto = (i, file) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
      dispatch(asyncActionStart());
  
  
      const firestore = getFirestore();
      const firebase = getFirebase();
  
      const user = firebase.auth().currentUser;
  
        const imageName = cuid();
      
    
      
        const path = `${user.uid}/user_images`;
        const options = {
          name: imageName
        };
  
      try {
  
        let uploadedFile = await firebase.uploadFile(path, file, null, options);
        //get url of image
        let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;
    
  
  
        await firestore.update(
          {
            collection: "items",
            doc: i.itemId
          },
          {
           itemPhotoUrl: downloadURL
          }


          
        );

        const item = { ...i, itemPhotoUrl: downloadURL};
   
  
        dispatch({ type: FETCH_ITEM, payload: { item } });
  
  
  
       
  
        dispatch(asyncActionFinish());
        toastr.success("Success", "Item photo uploaded");
      } catch (error) {
        dispatch(asyncActionError());
        toastr.error("Oops", "Something went wrong uploading store photo");
        console.log(error);
      }
    };
  };



  export const updateItemValues = (i,values) => {
    return async (dispatch, getState, { getFirestore }) => {
      dispatch(asyncActionStart());
  
      const firestore = getFirestore();

    
  
      try {


      
        await firestore.update(
            {
              collection: "items",
              doc: i.itemId
            },
            {
             ...values
            })
  

        const item = { ...i, ...values, itemId: i.id };
   
    
  
        dispatch({ type: FETCH_ITEM, payload: { item } });
        dispatch(asyncActionFinish());
        return item;
      } catch (error) {
        dispatch(asyncActionFinish());
        console.log(error);
        toastr.error("Oops", "Could not create quote");
      }
    };
  };
 