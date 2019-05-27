import {createReducer} from '../../../../app/common/util/reducerUtil'
import { FETCH_ITEM } from './itemConstants';
const initialState = [];




export const fetchItem = (state,payload) => {
    return payload.item
  }


    
  export default createReducer(initialState, {

    [FETCH_ITEM]: fetchItem
  })