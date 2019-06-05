import {createReducer} from '../../../../app/common/util/reducerUtil'
import {FETCH_PHOTOS, CLEAR_PHOTOS} from './photosConstants'

const initialState = [];

export const fetchPhotos = (state,payload) => {
    console.log('fetchPhotos', payload)
    return payload.album
  }


  export const clearPhotos = (state, payload) => {
    return initialState
  }
  

  export default createReducer(initialState, {
    [FETCH_PHOTOS] : fetchPhotos,
    [CLEAR_PHOTOS]: clearPhotos
  })