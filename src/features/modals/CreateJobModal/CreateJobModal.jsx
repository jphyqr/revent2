import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { Loader, Dimmer } from "semantic-ui-react";
import { withFirestore, isEmpty, isLoading } from "react-redux-firebase";
import { compose } from "redux";
import JobForm from "./JobForm";
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

  state = {showModal:true
  }

  handleClose = () =>{
    this.setState({
      showModal:false
    })
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
    return (
      <Modal style={{maxWidth:700, maxHeight:800, overflow:'auto'}}closeIcon="close" open={this.state.showModal} onClose={closeModal}>
        <Modal.Header>{draft.value.taskValue}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {loading ? (
              <Dimmer active inverted>
                <Loader content="Creating Jobs" />
              </Dimmer>
            ) : showBasic ? (
             this.props.draft&& <JobForm  draft={draft} handleClose={this.handleClose}/>
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
