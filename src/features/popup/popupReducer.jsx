import {createReducer} from '../../app/common/util/reducerUtil'
import { OPEN_MESSAGE, CLOSE_MESSAGE } from './popupConstants';


const initialState = [];


export const openMessage = (state, payload) => {
  console.log({state})
  let alreadyExists = false
   let filtered =  state.filter(openMessage => {if(openMessage.id===payload.message.id) alreadyExists=true})
    if(alreadyExists)
    return state
    else
      return [...state, Object.assign({}, payload.message)]
  }
  

  export const closeMessage = (state, payload) => {
    console.log({payload})
    return [
       
      ...state.filter(openMessages => openMessages.id !== payload.message.id)
    ]
  }



  export default createReducer(initialState, {
    [OPEN_MESSAGE]: openMessage,
    [CLOSE_MESSAGE]: closeMessage
  })