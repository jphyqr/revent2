import {createReducer} from '../../../app/common/util/reducerUtil'
import {FETCH_FIELD} from './fieldConstants'

const initialState = [];

export const fetchField = (state,payload) => {
  console.log('reducer', payload )
    return payload
  }


  export default createReducer(initialState, {
    [FETCH_FIELD] : fetchField
  })