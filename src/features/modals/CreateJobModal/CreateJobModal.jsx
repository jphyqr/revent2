import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { Loader, Dimmer } from "semantic-ui-react";
import { withFirestore, isEmpty, isLoading } from "react-redux-firebase";
import { compose } from "redux";
import JobForm from "./JobForm";
import JobCustomForm from './JobCustomForm'
import JobOverview from './JobOverview'
import JobSchedule from './JobSchedule'
import JobConfirmForm from './JobConfirmForm'
import JobContractForm from './JobContractForm'
import JobProgress from './JobProgress'
import {Button} from 'semantic-ui-react'
import {uploadJobPhoto} from '../../job/jobActions'
const actions = {
 uploadJobPhoto, closeModal
};




const objIsEmpty = (obj) =>{
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const mapState = state => {
  



 
  return {
    userUID: state.firebase.auth.uid,
    loading: state.async.loading,
    draft: state.draft
  };
};



class CreateJobModal extends Component {

  state = {showModal:true
  }

  handlePhotoUploaded = async url => {
  console.log("Create JobModal photo uploaded url", url);
  await this.props.uploadJobPhoto(
    this.props.draft.key,
    url
  );
  //this.setState({ exampleURL: exampleURL });
  //this.setState({ examplePhotoHasUpdated: true });
}

  render() {
    const {
      closeModal,
      userUID,
      showBasic,
      showJobSpecific,
      showContractSpecific,
      job,
      loading, draft
    } = this.props;

    const {value: draftValue} = draft

    const {showState} = draftValue
    return (
      <Modal style={{maxWidth:800, maxHeight:800, overflow:'auto'}}closeIcon="close" open={this.state.showModal} onClose={closeModal}>
        <Modal.Header>{draft.value.name}</Modal.Header>
        <JobProgress showState={showState}/>
        <Modal.Content>
          <Modal.Description>
            <div style={{minHeight:500, minWidth:700}}>
            {loading ? (
              <Dimmer active inverted>
                <Loader content="Updating Job" />
              </Dimmer>
            ) : 
            showState.showOverview ? 
            <JobOverview draftValue={draftValue}/> :
            showState.showContract ? 
              <JobContractForm />
              :
            showState.showBasic ? (
             this.props.draft&& <JobForm  draft={draft} />
            ) : (
              showState.showCustom ? 
              <JobCustomForm draftValue={draftValue} handlePhotoUploaded={this.handlePhotoUploaded}/>
              :
              
              showState.showSchedule ? 
              <JobSchedule />
              :
              showState.showConfirm ? 
              <JobConfirmForm />
              :
              null
            )}
            </div>

          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default compose(
  withFirestore,
  connect(
    mapState,
    actions
  )
)(CreateJobModal);
