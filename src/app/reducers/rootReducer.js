import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import testReducer from '../../features/testarea/testReducer';
import eventReducer from '../../features/event/eventReducer';
import accountReducer from '../../features/modals/ConnectBankAccountModal/BankAccountManager/accountReducer'
import jobReducer from '../../features/job/jobReducer'
import modalsReducer from '../../features/modals/modalReducer';
import messagesReducer from '../../features/popup/popupReducer'
import categoryReducer from '../../features/modals/CategoryModal/categoryReducer'
import taskReducer from '../../features/modals/TaskModal/taskReducer'
import authReducer from '../../features/auth/authReducer';  
import fieldReducer from '../../features/modals/NewFieldModal/fieldReducer'
import asyncReducer from '../../features/async/asyncReducer'
import {firebaseReducer} from 'react-redux-firebase'
import {firestoreReducer} from 'redux-firestore'
import {reducer as toastrRedcer} from 'react-redux-toastr';
import draftReducer from '../../features/build/draftReducer'
import quoteReducer from '../../features/modals/QuoteJobModal/quoteReducer'
import labourReducer from '../../features/job/JobDashboard/Labour/LabourList/labourReducer'
 
const rootReducer = combineReducers({
  test: testReducer,
  events: eventReducer,
  jobs: jobReducer,
  form: FormReducer,
  modals: modalsReducer,
  auth: authReducer,
  async: asyncReducer,
  toastr: toastrRedcer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  account: accountReducer,
  openMessages: messagesReducer,
  draft: draftReducer,
  category: categoryReducer,
  task: taskReducer,
  field: fieldReducer,
  quote: quoteReducer,
  labour: labourReducer
})

export default rootReducer