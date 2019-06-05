import cuid from "cuid";
import { toastr } from "react-redux-toastr";
import firebase from "../../../../app/config/firebase";
import axios from "axios";
import {FETCH_PHOTOS, CLEAR_PHOTOS} from './photosConstants'
import { reset } from "redux-form";



import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../../../../features/async/asyncActions";
const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

export const uploadPhoto = (file, fileName, userUID, type) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const imageName = cuid();
  const firebase = getFirebase();

  // 12 uid gOueUk3AjUPXvHMjjJ34FkVQAM13
  const user = firebase.auth().currentUser;
  const path = `${type}`;
  const options = {
    name: imageName,
    type: type
  };

  try {
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

    toastr.success("Success", "File Uploaded");
  dispatch(asyncActionFinish());

  return downloadURL;
  } catch (error) {
    console.log(error.response);

    console.log(error);
    toastr.error("Oops", "Could not upload document");
    dispatch(asyncActionError());
  } 
};










export const openPhotoAlbum = (photos, startIndex) => async (dispatch, getState) =>{

  console.log('selectPhotoalbum')
  
    const firestore = firebase.firestore();
   
    // let draftUserId= draft.id
    // let draftId = draftUserId.split('_')[0]
    try {
     dispatch(asyncActionStart())
  
     const album = {photos:photos, startIndex:startIndex}

    dispatch({
        type: FETCH_PHOTOS,
        payload: {album}
    })
    dispatch (asyncActionFinish())
    } catch (error){
        console.log(error)
        dispatch(asyncActionError())
    }
      }


      export const clearAlbum = () => async (dispatch, getState) =>{


        
  
          try {
 
          dispatch({
              type: CLEAR_PHOTOS,
              payload: []
          })
          dispatch (asyncActionFinish())
          } catch (error){
              console.log(error)
              dispatch(asyncActionError())
          }
            }