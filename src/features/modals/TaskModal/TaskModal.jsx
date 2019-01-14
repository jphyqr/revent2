import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import { closeModal, openModal } from "../modalActions";
import { connect } from "react-redux";
import { Loader, Dimmer, Button } from "semantic-ui-react";
import FormBuilder from './FormBuilder/FormBuilder'
import { withFirestore, isEmpty, isLoading } from "react-redux-firebase";
import { compose } from "redux";
import TaskForm from "./TaskForm"
import TaskMedia from "./TaskMedia"
import {updateTaskPhoto} from "./taskActions"
const actions = {
  closeModal, openModal, updateTaskPhoto
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
    fields: state.firestore.ordered.fields,
    field: state.field,
    task: state.task
  };
};

class TaskModal extends Component {

state={
  showBasic:true,
  showFieldManager: false,
  showEdit: false,
  showMedia: false,
 displayPhotoHasUpdated:false,
 displayURL:""
}

async componentDidMount() {
  const { firestore } = this.props;
  await firestore.setListener(`fields`);
  this.setState({
    displayURL: this.props.task&&this.props.task.value&&this.props.task.value.displayURL
  })
}

async componentWillUnmount() {
  const { firestore } = this.props;
  await firestore.unsetListener(`fields`);
}
handleUpdatedDisplayPhoto = () =>{
  this.setState({displayPhotoHasUpdated:false})
}


handlePhotoUploaded = async (url) =>{
  console.log('photo uploaded url', url)
  let displayURL = await this.props.updateTaskPhoto(this.props.task.key, url);
  this.setState({displayURL: displayURL})
  this.setState({displayPhotoHasUpdated:true})
}


toggleEdit=(value)=>{
 this.setState({showEdit: value})
}
  render() {
    const {
      closeModal,
      openModal,
      userUID,
      loading,
      fields,
      field,
      task
    } = this.props;
    const {showBasic, showMedia, showFieldManager} = this.state

    let taskIsEmpty = false

    if (task === undefined || task.length == 0) {
      taskIsEmpty = true
  }
    return (
      <Modal size="fullscreen" style={{ minHeight:600, overflow:'auto'}}closeIcon="close" open={true} onClose={closeModal}>
        
        <Modal.Content>
          <Modal.Description>
            {loading ? (
              <Dimmer active inverted>
                <Loader content="Creating Task" />
              </Dimmer>
          
             
            ) : (
            <div >   <div style={{minHeight: 500, maxHeight:500,  overflowX: "hidden",
               overflowY: "auto",}}> 
                 
                 {
                
                   showBasic ? <TaskForm /> :  showMedia? <TaskMedia displayURL={this.state.displayURL} displayPhotoHasUpdated={this.state.displayPhotoHasUpdated} handleUpdatedDisplayPhoto={this.handleUpdatedDisplayPhoto} task={task} handlePhotoUploaded={this.handlePhotoUploaded}/>: <FormBuilder toggleEdit={this.toggleEdit} showEdit={this.state.showEdit} openModal={openModal} closeModal={closeModal} fields={fields} field={field} task={task}/>}
                </div>
                  <div>
                <Button.Group style={{marginTop:20}}>
                <Button size='large' disabled={taskIsEmpty} primary={showBasic?false:true} onClick={()=>this.setState({showBasic:true, showMedia:false})}>Basic</Button>
                <Button.Or />
                <Button size='large' disabled={taskIsEmpty} primary={showMedia?false:true}onClick={()=>this.setState({showBasic:false, showMedia: true})} >Media</Button>
              
               
                <Button.Or />
                <Button size='large' disabled={taskIsEmpty} primary={(showBasic||showMedia)?true:false}onClick={()=>this.setState({showBasic:false, showMedia:false})} >Form Builder</Button>
               
              </Button.Group>
              </div>
              </div>
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