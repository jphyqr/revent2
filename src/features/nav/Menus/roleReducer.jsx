import { SET_ROLE, CLEAR_ROLE } from './roleConstants';
import { createReducer } from '../../../app/common/util/reducerUtil';

const initialState = {
  isAdmin:false,
  authenticated: false
}

export const setRole = (state, payload) => {
  return {
    ...state,
    authenticated: true,
    isAdmin: payload.role.isAdmin 
  }
}

export const clearRole = (state, payload) => {
  return {
    ...state,
    authenticated: false,
    isAdmin: false
  }
}

export default createReducer(initialState, {
  [SET_ROLE]: setRole,
  [CLEAR_ROLE]: clearRole
})