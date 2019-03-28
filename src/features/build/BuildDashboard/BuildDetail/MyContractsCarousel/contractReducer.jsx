import { createReducer } from '../../../../../app/common/util/reducerUtil';
import {FETCH_CONTRACT, CLEAR_CONTRACT } from './contractConstants';


const initialState = [];
export const clearContract = (state, payload) =>{
    return []
}

export const fetchContracts = (state,payload) => {
    return payload.contract
  }
  

  export default createReducer(initialState, {

    [FETCH_CONTRACT]: fetchContracts,
    [CLEAR_CONTRACT] : clearContract
  })