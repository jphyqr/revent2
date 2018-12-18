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
  let job = {};

  if (state.firestore.ordered.jobs && state.firestore.ordered.jobs[0]) {
    job = state.firestore.ordered.jobs[0];
  }

  let showBasic = false;
  let showJobSpecific = false;
  let showContractSpecific = false;

  if (objIsEmpty(job)){
    showBasic = true;
     showJobSpecific = false; showContractSpecific = false;
  }

  return {
    userUID: state.firebase.auth.uid,
    loading: state.async.loading,
    job,
    showBasic,
    showJobSpecific,
    showContractSpecific
  };
};

class CreateJobModal extends Component {
  async componentDidMount() {
      const { firestore, userUID } = this.props;
      await firestore.setListener(`users/${userUID}/jobs/${this.props.jobID}`);
    }
    async componentWillUnmount() {
      const { firestore, userUID } = this.props;
      await firestore.unsetListener(`users/${userUID}/jobs/${this.props.jobID}`);
    }

  render() {
    const {
      closeModal,
      userUID,
      showBasic,
      showJobSpecific,
      showContractSpecific,
      job,
      loading
    } = this.props;
    return (
      <Modal style={{maxWidth:500, maxHeight:800, overflow:'auto'}}closeIcon="close" open={true} onClose={closeModal}>
        <Modal.Header>Create a Job</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {loading ? (
              <Dimmer active inverted>
                <Loader content="Connecting to Stripe" />
              </Dimmer>
            ) : showBasic ? (
              <JobSelector />
            ) : (
              <JobForm />
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
