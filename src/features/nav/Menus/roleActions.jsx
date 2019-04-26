
import {SET_ROLE, CLEAR_ROLE} from './roleConstants'
export const setRole = (isAdmin, isOnboarder, isAlpha, verified) => {
    return async (dispatch, getState, { getFirebase }) => {



        try {
            let role ={isAdmin:isAdmin, isOnboarder:isOnboarder, isAlpha:isAlpha, verified}
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