import { SET_ROLE, CLEAR_ROLE } from './roleConstants';
import { createReducer } from '../../../app/common/util/reducerUtil';

const initialState = {
  isAdmin:false,
  authenticated: false,
  isOnboarder: false,
  verified: false
}

export const setRole = (state, payload) => {
  return {
    ...state,
    authenticated: true,
    isAdmin: payload.role.isAdmin ,
    isOnboarder: payload.role.isOnboarder,
    isAlpha: payload.role.isAlpha,
    verified: payload.role.verified
  }
}

export const clearRole = (state, payload) => {
  return {
    ...state,
    authenticated: false,
    isAdmin: false,
    isOnboarder: false,
    isAlpha: false,
    verified: false
  }
}

export default createReducer(initialState, {
  [SET_ROLE]: setRole,
  [CLEAR_ROLE]: clearRole
})