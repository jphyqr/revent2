import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { Loader, Dimmer } from "semantic-ui-react";
import { withFirestore, isEmpty, isLoading } from "react-redux-firebase";
import { compose } from "redux";
import JobForm from "./JobForm";
import JobSelector from './JobSelector'
const actions = {
  closeModal
};


const objIsEmpty = (obj) =>{
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
const mapState = state => {
  

  let showBasic = true;
  let showJobSpecific = false;
  let showContractSpecific = false;

 
  return {
    userUID: state.firebase.auth.uid,
    loading: state.async.loading,
    showBasic,
    showJobSpecific,
    showContractSpecific,
    draft: state.draft
  };
};

class CreateJobModal extends Component {


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
    return (
      <Modal style={{maxWidth:500, maxHeight:800, overflow:'auto'}}closeIcon="close" open={true} onClose={closeModal}>
        <Modal.Header>{draft.value.jobTypeId}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {loading ? (
              <Dimmer active inverted>
                <Loader content="Creating Jobs" />
              </Dimmer>
            ) : showBasic ? (
              <JobForm draft={draft}/>
            ) : (
              null
            )}
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
