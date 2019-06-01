import { SET_ROLE, CLEAR_ROLE, SET_SUPPLIER } from './roleConstants';
import { createReducer } from '../../../app/common/util/reducerUtil';

const initialState = {
  isAdmin:false,
  authenticated: false,
  isOnboarder: false,
 // isSupplier:false,
  verified: false
}

export const setRole = (state, payload) => {
  return {
    ...state,
    authenticated: true,
    isAdmin: payload.role.isAdmin ,
    isOnboarder: payload.role.isOnboarder,
    isAlpha: payload.role.isAlpha,
    verified: payload.role.verified,
    //isSupplier: payload.role.isSupplier
  }
}


export const setSupplier = (state, payload) => {
  return {
    ...state,
   // isSupplier: true
  }
}


export const clearRole = (state, payload) => {
  return {
    ...state,
    authenticated: false,
    isAdmin: false,
    isOnboarder: false,
    isAlpha: false,
    verified: false,
  //  isSupplier: false
  }
}

export default createReducer(initialState, {
  [SET_ROLE]: setRole,
  [CLEAR_ROLE]: clearRole,
  [SET_SUPPLIER]: setSupplier
})