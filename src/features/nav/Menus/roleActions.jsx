
import {SET_ROLE, CLEAR_ROLE} from './roleConstants'
export const setRole = (isAdmin, isOnboarder, isAlpha, verified, isSupplier) => {
    return async (dispatch, getState, { getFirebase }) => {



        try {
            let role ={isAdmin:isAdmin, isOnboarder:isOnboarder, isAlpha:isAlpha, verified, isSupplier: isSupplier}
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