import {createReducer} from '../../../app/common/util/reducerUtil'
import {FETCH_TASK} from './taskConstants'

const initialState = [];

export const fetchTask = (state,payload) => {
    return payload.task
  }


  export default createReducer(initialState, {
    [FETCH_TASK] : fetchTask
  })