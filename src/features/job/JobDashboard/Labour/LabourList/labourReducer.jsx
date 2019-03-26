import { createReducer } from '../../../../../app/common/util/reducerUtil';
import { FETCH_LABOUR } from '././labourConstants';


const initialState = [];



export const fetchLabour = (state,payload) => {
    return payload.labour
  }


  export default createReducer(initialState, {

    [FETCH_LABOUR]: fetchLabour
  })