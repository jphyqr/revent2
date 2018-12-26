
import { toastr } from "react-redux-toastr";
import { FETCH_CATEGORY } from "./categoryConstants";
import firebase from "../../../app/config/firebase";
import moment from "moment";
import compareAsc from "date-fns/compare_asc";
import {
    asyncActionStart,
    asyncActionFinish,
    asyncActionError
  } from '../../async/asyncActions'

  import { createNewCategory } from "../../../app/common/util/helpers";

  export const selectCategoryToEdit = categoryID => async (dispatch, getState) =>{

    const firestore = firebase.firestore();
    
    try {
     dispatch(asyncActionStart())
    let draftSnap = await firestore.collection("categories").doc(categoryID).get()
    let category = draftSnap.data()
   
   
    dispatch({
        type: FETCH_CATEGORY,
        payload: {category}
    })
    dispatch (asyncActionFinish())
    } catch (error){
        console.log(error)
        dispatch(asyncActionError())
    }
      }




      export const createCategory = category => {
        return async (dispatch, getState, { getFirestore }) => {
          const firestore = getFirestore();

          //need to shape category for what we want to store inside firestore
          let newCategory = createNewCategory(category);
      
          try {
            await firestore.add(`categories`, newCategory);
           
            toastr.success("Success", "Category has been created");
          } catch (error) {
            toastr.error("Oops", "Something went wrong");
          }
        };
      };


      export const updateCategory = category => {
        return async (dispatch, getState) => {
          dispatch(asyncActionStart());
          const firestore = firebase.firestore();
          category.date = moment(category.date).toDate();
      
          try {
            let categoryDocRef = firestore.collection("categories").doc(category.id);
            let dateEqual = compareAsc(
              getState().firestore.ordered.categories[0].date.toDate(),
              category.date
            );
      
            if (dateEqual !== 0) {
              let batch = firestore.batch();
              await batch.update(categoryDocRef, category);
              let categoryTasksRef = firestore.collection("category_tasks");
              let categoryTasksQuery = await categoryTasksRef.where(
                "categoryId",
                "==",
                category.id
              );
              let categoryTasksQuerySnap = await categoryTasksQuery.get();
      
              for (let i = 0; i < categoryTasksQuerySnap.docs.length; i++) {
                let categoryTasksDocRef = await firestore
                  .collection("category_tasks")
                  .doc(categoryTasksQuerySnap.docs[i].id);
      
                await batch.update(categoryTasksDocRef, {
                  categoryDate: category.date
                });
              }
      
              await batch.commit();
            } else {
              await categoryDocRef.update(category);
            }
      
            dispatch(asyncActionFinish());
            toastr.success("Success", "Category has been updated");
          } catch (error) {
            dispatch(asyncActionError());
            toastr.error("Oops", "Something went wrong");
          }
        };
      };