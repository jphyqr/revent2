import { SET_ROLE, CLEAR_ROLE, SET_SUPPLIER, SET_CONTRACTOR } from './roleConstants';
import { createReducer } from '../../../app/common/util/reducerUtil';

const initialState = {
  isAdmin:false,
  authenticated: false,
  isOnboarder: false,
  isContractor:false,
  verified: false
}

export const setRole = (state, payload) => {
  console.log("setRole",  payload)
  return {
    ...state,
    authenticated: true,
    isAdmin: payload.role.isAdmin ,
    isOnboarder: payload.role.isOnboarder,
    isAlpha: payload.role.isAlpha,
    verified: payload.role.verified,
    isContractor: payload.role.isContractor
  }
}


export const setSupplier = (state, payload) => {
  return {
    ...state,
   // isSupplier: true
  }
}

export const setContractor = (state, payload) => {
  return {
    ...state,
    isContractor: true
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
    isContractor: false
  }
}

export default createReducer(initialState, {
  [SET_ROLE]: setRole,
  [CLEAR_ROLE]: clearRole,
  [SET_SUPPLIER]: setSupplier,
  [SET_CONTRACTOR]: setContractor
})