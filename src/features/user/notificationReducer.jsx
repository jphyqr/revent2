import { SET_NOTIFICATIONS, CLEAR_NOTIFICATIONS } from './notificationConstants'
import { createReducer } from '../../app/common/util/reducerUtil';

const initialState = {
  newContract:false,
  newQuotes:[],
  newMessage:false,
  newNotification:false,
  hideHowToPost: false,

}

export const setNotifications = (state, payload) => {
  return {
    ...state,

    newContract:payload.notifications.newContract,
    newQuotes:payload.notifications.newQuotes,
    newMessage:payload.notifications.newMessage,
    newNotification:payload.notifications.newNotification,
    hideHowToPost: payload.notifications.hideHowToPost
      
  }
}

export const clearNotifications = (state, payload) => {
  return {
    ...state,
    newContract:false,
    newQuotes:[],
    newMessage:false,
    newNotification:false,
    hideHowToPost: false
  }
}

export default createReducer(initialState, {
  [SET_NOTIFICATIONS]: setNotifications,
  [CLEAR_NOTIFICATIONS]: clearNotifications
})