import moment from "moment";
import { toastr } from "react-redux-toastr";
export const updateProfile = user => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const {isLoaded, isEmpty, ...updatedUser} = user;
  if (updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth) {
    //moment object coming in, need to deal with it
    updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
  }

  try {
    await firebase.updateProfile(updatedUser); //react redux firebase method
    toastr.success("Success", "Profile updated");
  } catch (error) {
    console.log(error);
  }
};
