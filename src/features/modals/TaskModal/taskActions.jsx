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


  export const clearTask = () => async (dispatch, getState) =>{

    console.log('clearing task')
    try {
     dispatch(asyncActionStart())

   const payload = {}
    
    dispatch({
        type: FETCH_TASK,
        payload: payload
    })

 
    dispatch (asyncActionFinish())
 
    } catch (error){
        console.log(error)
        dispatch(asyncActionError())
    }
      }


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


      export const createTask = (task, displayURL) => {
        return async (dispatch, getState, { getFirestore }) => {
          const firestore = getFirestore();

          //need to shape task for what we want to store inside firestore
         
          const user = firestore.auth().currentUser;
          const photoURL = getState().firebase.profile.photoURL; //can hook into redux state get whatever we want: firebase is the reducer
          let newTask = createNewTask(user, photoURL, task, displayURL);

          try {
          let addedTask=  await firestore.add(`tasks`, newTask);
           console.log('addedTask id', addedTask.id )
           const payload = {key: addedTask.id, value:newTask}
    
           dispatch({
               type: FETCH_TASK,
               payload: {payload}
           })


            toastr.success("Success", "Task has been created");
          } catch (error) {
            toastr.error("Oops", "Something went wrong");
          }
        };
      };



      export const updateTask = (task,key,displayURL) => {
        return async (dispatch, getState) => {
          dispatch(asyncActionStart());
          const firestore = firebase.firestore();
          const {key: taskId, value: taskValues} = task
          console.log({task})
          const user = firebase.auth().currentUser;
          const photoURL = getState().firebase.profile.photoURL; //can hook into redux state get whatever we want: firebase is the reducer
        
         
          task.date = moment(task.date).toDate();
          let newTask = createNewTask(user, photoURL, task, displayURL);
          try {   
            let taskDocRef = firestore.collection("tasks").doc(taskId);
         
  
              await taskDocRef.update(newTask);
  
            dispatch(asyncActionFinish());
            toastr.success("Success", "Task has been updated");
          } catch (error) {
            dispatch(asyncActionError());
            toastr.error("Oops", "Something went wrong");
            console.log(error)
          }
        };
      };


      export const updateTaskPhoto = (key,displayURL) => {
        return async (dispatch, getState) => {
          dispatch(asyncActionStart());
          const firestore = firebase.firestore();
  
     
          try {   
            let taskDocRef = firestore.collection("tasks").doc(key);
         
              console.log('updating photo for', key)
              await taskDocRef.update({displayURL:displayURL});
  
            dispatch(asyncActionFinish());
            toastr.success("Success", "Task has been updated");
            return displayURL
          } catch (error) {
            dispatch(asyncActionError());
            toastr.error("Oops", "Something went wrong");
            console.log(error)
          }
        };
      };