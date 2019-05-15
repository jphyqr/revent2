import {createReducer} from '../../../app/common/util/reducerUtil'
import {FETCH_VIDEO} from './videoConstants'

const initialState = {};

export const fetchVideo = (state,payload) => {
    console.log('fetchVideo', payload)
    return payload.video
  }


  export default createReducer(initialState, {
    [FETCH_VIDEO] : fetchVideo
  })