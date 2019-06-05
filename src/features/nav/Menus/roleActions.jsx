import { SET_ROLE, CLEAR_ROLE } from "./roleConstants";
export const setRole = (
  isAdmin,
  isOnboarder,
  isAlpha,
  verified,
  isContractor
) => {
  return async (dispatch, getState, { getFirebase }) => {
    console.log('roleACtions', isContractor)
    try {
      let role = {
        isAdmin: isAdmin || false,
        isOnboarder: isOnboarder || false,
        isAlpha: isAlpha || false,
        verified:verified || false,
        isContractor: isContractor|| false
      };
      dispatch({
        type: SET_ROLE,
        payload: { role }
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const clearRole = () => {
  return async (dispatch, getState, { getFirestore }) => {
    try {
      dispatch({ type: CLEAR_ROLE, payload: {} });
    } catch (error) {
      console.log(error);
    }
  };
};
