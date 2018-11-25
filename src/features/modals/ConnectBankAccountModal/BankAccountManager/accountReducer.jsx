import { createReducer } from '../../../../app/common/util/reducerUtil';
import { FETCH_ACCOUNT } from './accountConstants';


const initialState = [];


export const fetchAccount = (state,payload) => {
    return payload.account
  }



  export default createReducer(initialState, {
    [FETCH_ACCOUNT]: fetchAccount
  })