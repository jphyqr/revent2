import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { Loader, Dimmer } from "semantic-ui-react";
import { withFirestore, isEmpty, isLoading } from "react-redux-firebase";
import { compose } from "redux";
import TaskForm from "./TaskForm";
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
  



 
  return {
    userUID: state.firebase.auth.uid,
    loading: state.async.loading,

  };
};

class TaskModal extends Component {


  render() {
    const {
      closeModal,
      userUID,
      loading
    } = this.props;
    return (
      <Modal style={{maxWidth:500, maxHeight:800, overflow:'auto'}}closeIcon="close" open={true} onClose={closeModal}>
        <Modal.Header>Task Modal</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {loading ? (
              <Dimmer active inverted>
                <Loader content="Creating Task" />
              </Dimmer>
          
             
            ) : (
                <TaskForm />
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
)(TaskModal);