import cuid from "cuid";
import { toastr } from "react-redux-toastr";

import axios from "axios";

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
