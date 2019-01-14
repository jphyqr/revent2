import {createReducer} from '../../../app/common/util/reducerUtil'
import {FETCH_TASK, UPDATE_TASK} from './taskConstants'

const initialState = [];

export const fetchTask = (state,payload) => {
  console.log('fetchTaskReducer payload', payload)
    return payload.payload || payload
  }


  export const updateTask = (state, payload) => {
    return [
      ...state.filter(task => task.id !== payload.task.id),
      Object.assign({}, payload.task)
    ]
  }


  export default createReducer(initialState, {
    [FETCH_TASK] : fetchTask,
    [UPDATE_TASK] : updateTask
  })