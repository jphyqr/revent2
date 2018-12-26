import { toastr } from "react-redux-toastr";
import { FETCH_TASK } from "./taskConstants";
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
    let taslSnap = await firestore.collection("tasks").doc(taskObj.id).get()
    let task = taslSnap.data()
   
    
    dispatch({
        type: FETCH_TASK,
        payload: {task}
    })
    dispatch (asyncActionFinish())
    } catch (error){
        console.log(error)
        dispatch(asyncActionError())
    }
      }


      export const createTask = task => {
        return async (dispatch, getState, { getFirestore }) => {
          const firestore = getFirestore();

          //need to shape task for what we want to store inside firestore
          let newTask = createNewTask(task);
      
          try {
            await firestore.add(`tasks`, newTask);
           
            toastr.success("Success", "Task has been created");
          } catch (error) {
            toastr.error("Oops", "Something went wrong");
          }
        };
      };



      export const updateTask = task => {
        return async (dispatch, getState) => {
          dispatch(asyncActionStart());
          const firestore = firebase.firestore();
          task.date = moment(task.date).toDate();
      
          try {
            let taskDocRef = firestore.collection("tasks").doc(task.id);
            let dateEqual = compareAsc(
              getState().firestore.ordered.tasks[0].date.toDate(),
              task.date
            );
      
            if (dateEqual !== 0) {
              let batch = firestore.batch();
              await batch.update(taskDocRef, task);
              let categoryTasksRef = firestore.collection("tasks");
              let categoryTasksQuery = await categoryTasksRef.where(
                "categoryId",
                "==",
                task.id
              );
              let categoryTasksQuerySnap = await categoryTasksQuery.get();
      
              for (let i = 0; i < categoryTasksQuerySnap.docs.length; i++) {
                let categoryTasksDocRef = await firestore
                  .collection("tasks")
                  .doc(categoryTasksQuerySnap.docs[i].id);
      
                await batch.update(categoryTasksDocRef, {
                  categoryDate: task.date
                });
              }
      
              await batch.commit();
            } else {
              await taskDocRef.update(task);
            }
      
            dispatch(asyncActionFinish());
            toastr.success("Success", "Task has been updated");
          } catch (error) {
            dispatch(asyncActionError());
            toastr.error("Oops", "Something went wrong");
          }
        };
      };