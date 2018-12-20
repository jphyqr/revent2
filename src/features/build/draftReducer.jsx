import {createReducer} from '../../app/common/util/reducerUtil'
import {FETCH_DRAFT} from './draftConstants'

const initialState = [];

export const fetchDraft = (state,payload) => {
    return payload.payload
  }


  export default createReducer(initialState, {
    [FETCH_DRAFT] : fetchDraft
  })