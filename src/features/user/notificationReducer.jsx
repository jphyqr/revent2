import { SET_NOTIFICATIONS, CLEAR_NOTIFICATIONS } from './notificationConstants'
import { createReducer } from '../../app/common/util/reducerUtil';

const initialState = {
  newContract:false,
  newQuote:false,
  newMessage:false,
  newNotification:false,

}

export const setNotifications = (state, payload) => {
  return {
    ...state,

    newContract:payload.notifications.newContract,
    newQuote:payload.notifications.newQuote,
    newMessage:payload.notifications.newMessage,
    newNotification:payload.notifications.newNotification,
      
  }
}

export const clearNotifications = (state, payload) => {
  return {
    ...state,
    newContract:false,
    newQuote:false,
    newMessage:false,
    newNotification:false,
  }
}

export default createReducer(initialState, {
  [SET_NOTIFICATIONS]: setNotifications,
  [CLEAR_NOTIFICATIONS]: clearNotifications
})