import { toastr } from "react-redux-toastr";
import { FETCH_TASK , UPDATE_TASK} from "./taskConstants";
import firebase from "../../../app/config/firebase";
import moment from "moment";
import compareAsc from "date-fns/compare_asc";
import {
    asyncActionStart,
    asyncActionFinish,
    asyncActionError
  } from '../../async/asyncActions'

  import { createNewTask} from "../../../app/common/util/helpers";

  export const selectTaskToEdit = taskObj => async (dispatch, getState) =>{

    const firestore = firebase.firestore();
    console.log('selectTaskToEdit', taskObj)
    try {
     dispatch(asyncActionStart())
    let taslSnap = await firestore.collection("tasks").doc(`${taskObj.id}`).get()
    let task = taslSnap.data()
   console.log({task})
   const payload = {key: taskObj.id, value:task}
    
    dispatch({
        type: FETCH_TASK,
        payload: {payload}
    })

 
    dispatch (asyncActionFinish())
    return task;
    } catch (error){
        console.log(error)
        dispatch(asyncActionError())
    }
      }


      export const createTask = task => {
        return async (dispatch, getState, { getFirestore }) => {
          const firestore = getFirestore();

          //need to shape task for what we want to store inside firestore
         
          const user = firestore.auth().currentUser;
          const photoURL = getState().firebase.profile.photoURL; //can hook into redux state get whatever we want: firebase is the reducer
          let newTask = createNewTask(user, photoURL, task);
          try {
            await firestore.add(`tasks`, newTask);
           
            toastr.success("Success", "Task has been created");
          } catch (error) {
            toastr.error("Oops", "Something went wrong");
          }
        };
      };



      export const updateTask = (task,values) => {
        return async (dispatch, getState) => {
          dispatch(asyncActionStart());
          const {key: taskId, value: taskValues} = task
          console.log({task})
          const firestore = firebase.firestore();
          task.date = moment(task.date).toDate();
      
          try {   
            let taskDocRef = firestore.collection("tasks").doc(taskId);
         
      
            if (true) {
              let batch = firestore.batch();
              await batch.update(taskDocRef, task);
              let categoryTasksRef = firestore.collection("tasks");
              let categoryTasksQuery = await categoryTasksRef.where(
                "taskId",
                "==",
                taskId
              );
              let categoryTasksQuerySnap = await categoryTasksQuery.get();
      
              for (let i = 0; i < categoryTasksQuerySnap.docs.length; i++) {
                let categoryTasksDocRef = await firestore
                  .collection("task_subscribed")
                  .doc(categoryTasksQuerySnap.docs[i].id);
      
                await batch.update(categoryTasksDocRef, {
                  categoryDate: task.date
                });
              }
      
              await batch.commit();
            } else {
              await taskDocRef.update(task);
            }
            dispatch({
              type: UPDATE_TASK,
              payload: {task}
          })
            dispatch(asyncActionFinish());
            toastr.success("Success", "Task has been updated");
          } catch (error) {
            dispatch(asyncActionError());
            toastr.error("Oops", "Something went wrong");
            console.log(error)
          }
        };
      };