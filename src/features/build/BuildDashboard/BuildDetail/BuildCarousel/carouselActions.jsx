
import { toastr } from "react-redux-toastr";
import {
    asyncActionStart,
    asyncActionFinish,
    asyncActionError
  } from "../../../..//async/asyncActions";

  import firebase from "../../../../../app/config/firebase";

export const getTasksForCarousel = category => async (
    dispatch,
    getState
  ) => {
    const firestore = firebase.firestore();
    const tasksRef = firestore.collection("tasks");
    try {
      dispatch(asyncActionStart());
      let tasksSnap = await tasksRef.where("category", "==", category.id).get()


      if (tasksSnap.docs.length === 0) {
        dispatch(asyncActionFinish());
        return tasksSnap;
      }
        let tasks=[]
      for (let i = 0; i < tasksSnap.docs.length; i++) {
        let tsk = { ...tasksSnap.docs[i].data(), id: tasksSnap.docs[i].id  };
        tasks.push(tsk);
    
      }

     
      dispatch(asyncActionFinish());
      return tasks;
    } catch (error) {
      console.log(error);
      dispatch(asyncActionError());
    }
  };
  