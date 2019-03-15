import {createReducer} from '../../../app/common/util/reducerUtil'
import { CREATE_QUOTE, CLEAR_QUOTE, DELETE_QUOTE, UPDATE_QUOTE, FETCH_QUOTE } from './quoteConstants';

const initialState = [];

export const clearQuote = (state, payload) =>{
    return []
}
export const createQuote = (state, payload) => {
    return [...state, Object.assign({}, payload.quote)]
  }
  
  export const updateQuote = (state, payload) => {
    return [
      ...state.filter(quote => quote.id !== payload.quote.id),
      Object.assign({}, payload.quote)
    ]
  }
  
  export const deleteQuote = (state, payload) => {
    return [
      ...state.filter(quote => quote.id !== payload.quoteId)
    ]
  }
  
  export const fetchQuote = (state,payload) => {
    return payload.quote
  }
  
  export default createReducer(initialState, {
    [CREATE_QUOTE]: createQuote,
    [CLEAR_QUOTE] : clearQuote,
    [UPDATE_QUOTE]: updateQuote,
    [DELETE_QUOTE]: deleteQuote,
    [FETCH_QUOTE]: fetchQuote
  })