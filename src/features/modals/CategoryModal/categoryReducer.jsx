import {createReducer} from '../../../app/common/util/reducerUtil'
import {FETCH_CATEGORY} from './categoryConstants'

const initialState = [];

export const fetchCategory = (state,payload) => {
    return payload.category
  }


  export default createReducer(initialState, {
    [FETCH_CATEGORY] : fetchCategory
  })