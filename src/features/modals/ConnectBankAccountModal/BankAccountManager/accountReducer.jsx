import { createReducer } from '../../../../app/common/util/reducerUtil';
import { FETCH_ACCOUNT, CLEAR_ACCOUNT } from './accountConstants';


const initialState = [];


export const fetchAccount = (state,payload) => {

    return payload.account.data.account

  }

  export const clearAccount = (state,payload) => {
    return []
    }
  



  export default createReducer(initialState, {
    [FETCH_ACCOUNT]: fetchAccount,
    [CLEAR_ACCOUNT]: clearAccount
  })