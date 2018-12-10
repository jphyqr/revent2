import { OPEN_MESSAGE, CLOSE_MESSAGE } from "./popupConstants";



export const openMessage = (message) => async (
    dispatch,
    getState
  ) => {
  
  
    console.log('Open message action')
  
  
    try {
 
   
      dispatch({
        type: OPEN_MESSAGE,
        payload: { message }
      });
    
    } catch (error) {
      console.log(error);
      throw new Error("Problem opening message");
    }
  };
  

  export const closeMessage = (message) => async (
    dispatch,
    getState
  ) => {
  
  
    console.log('Close message action')
  
  
    try {
 
   
      dispatch({
        type: CLOSE_MESSAGE,
        payload: { message }
      });
    
    } catch (error) {
      console.log(error);
      throw new Error("Problem closing message");
    }
  };
  