import { createReducer } from '../../app/common/util/reducerUtil';
import { CREATE_JOB, DELETE_JOB, UPDATE_JOB, FETCH_JOBS } from './jobConstants';

 const initialState = [];

export const createJob = (state, payload) => {
  return [...state, Object.assign({}, payload.job)]
}

export const updateJob = (state, payload) => {
  return [
    ...state.filter(job => job.id !== payload.job.id),
    Object.assign({}, payload.job)
  ]
}

export const deleteJob = (state, payload) => {
  return [
    ...state.filter(job => job.id !== payload.jobId)
  ]
}

export const fetchJobs = (state,payload) => {
  return payload.jobs
}

export default createReducer(initialState, {
  [CREATE_JOB]: createJob,
  [UPDATE_JOB]: updateJob,
  [DELETE_JOB]: deleteJob,
  [FETCH_JOBS]: fetchJobs
})