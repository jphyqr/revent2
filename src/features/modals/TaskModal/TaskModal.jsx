import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import { closeModal, openModal } from "../modalActions";
import { connect } from "react-redux";
import { Loader, Dimmer, Button } from "semantic-ui-react";
import FormBuilder from "./FormBuilder/FormBuilder";
import { withFirestore, isEmpty, isLoading } from "react-redux-firebase";
import { compose } from "redux";
import TaskForm from "./TaskForm";
import TaskMedia from "./TaskMedia";
import TaskContract from './TaskContract/TaskContract'
import { updateTaskPhoto, uploadTaskPhoto, updateContractPhases} from "./taskActions";
const actions = {
  closeModal,
  openModal,
  updateTaskPhoto,
  uploadTaskPhoto, updateContractPhases
};

const objIsEmpty = obj => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
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
  state = {
    showBasic: true,
    showForm: false,
    showContract: false,
    showFieldManager: false,
    showEdit: false,
    showMedia: false,
    displayPhotoHasUpdated: false,
    displayURL: "",
    currentPhases: []
  };

  async componentDidMount() {
    const { firestore, task } = this.props;
    await firestore.setListener(`fields`);
    this.setState({
      displayURL:
      task &&
        task.value &&
       task.value.displayURL,
      currentPhases: (task &&task.value&&task.value.phases) ||[]
    });
  }

  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`fields`);
  }
 

  handlePhasesUpdated = async (phases) =>{
    const current = this.state.currentPhases
       const length = current.length+1 //havent updated state yet so assuming we will add to state
   const percent = 100/length
   current.push(phases)
   for(var i=0; i<current.length; i++){
    current[i].percent= percent
   }
   
   //phases.percent=percent
  // current.percent = percent
   console.log({percent})

   //phases = {...{percent:percent}}
   
    

    await this.setState({currentPhases: current})
    await this.props.updateContractPhases(this.state.currentPhases, this.props.task);
  }


handleDeletePhaseItem = async (index)=>{

  const current=this.state.currentPhases
  const length = current.length -1
  const percent = 100/length
  current.splice(index,1)
  for(var i=0; i<current.length; i++){
    current[i].percent= percent
   }
   
  await this.setState({currentPhases: current})
  await this.props.updateContractPhases(this.state.currentPhases, this.props.task);
}

  handlePhotoUploaded = async url => {
    console.log("photo uploaded url", url);
    let displayURL = await this.props.uploadTaskPhoto(this.props.task.key, url);
    this.setState({ displayURL: displayURL });
    this.setState({ displayPhotoHasUpdated: true });
  };


  handleUpdatedDisplayPhoto = () => {
    this.setState({ displayPhotoHasUpdated: false });
  };

  toggleEdit = value => {
    this.setState({ showEdit: value });
  };
  render() {
    const {
      closeModal,
      openModal,updateContractPhases,
      userUID,
      loading,
      fields,
      field,
      task
    } = this.props;
    const {
      showBasic,
      showMedia,
      showForm,
      showContract,
      showFieldManager
    } = this.state;

    let taskIsEmpty = false;

    if (task === undefined || task.length === 0 || isEmpty(task)) {
      taskIsEmpty = true;
    }
    return (
      <Modal
        size="fullscreen"
        style={{ minHeight: 600, overflow: "auto" }}
        closeIcon="close"
        open={true}
        onClose={closeModal}
      >
        <Modal.Content>
          <Modal.Description>
            {loading ? (
              <Dimmer active inverted>
                <Loader content="Creating Task" />
              </Dimmer>
            ) : (
              <div>
                {" "}
                <div
                  style={{
                    minHeight: 500,
                    maxHeight: 500,
                    overflowX: "hidden",
                    overflowY: "auto"
                  }}
                >
                  {
                    
                    showContract?
                    <TaskContract handleDeletePhaseItem={this.handleDeletePhaseItem} task={task} handlePhasesUpdated={this.handlePhasesUpdated} currentPhases={this.state.currentPhases} updateContractPhases={updateContractPhases} />
                    : 

                    showBasic ? (
                    <TaskForm />
                  ) : showMedia ? (
                    <TaskMedia
                      displayURL={this.state.displayURL}
                      displayPhotoHasUpdated={this.state.displayPhotoHasUpdated}
                      handleUpdatedDisplayPhoto={this.handleUpdatedDisplayPhoto}
                      task={task}
                      handlePhotoUploaded={this.handlePhotoUploaded}
                    />
                  ) : (
                    <FormBuilder
                      toggleEdit={this.toggleEdit}
                      showEdit={this.state.showEdit}
                      openModal={openModal}
                      closeModal={closeModal}
                      fields={fields}
                      field={field}
                      task={task}
                    />
                  )}
                </div>
                <div>
                  <Button.Group style={{ marginTop: 20 }}>
                    <Button
                      size="large"
                      disabled={taskIsEmpty}
                      primary={showBasic ? false : true}
                      onClick={() =>
                        this.setState({
                          showBasic: true,
                          showMedia: false,
                          showForm: false,
                          showContract: false
                        })
                      }
                    >
                      Basic
                    </Button>
                    <Button.Or />
                    <Button
                      size="large"
                      disabled={taskIsEmpty}
                      primary={showMedia ? false : true}
                      onClick={() =>
                        this.setState({
                          showBasic: false,
                          showMedia: true,
                          showForm: false
                        })
                      }
                    >
                      Media
                    </Button>

                    <Button.Or />
                    <Button
                      size="large"
                      disabled={taskIsEmpty}
                      primary={showForm ? false : true}
                      onClick={() =>
                        this.setState({
                          showBasic: false,
                          showMedia: false,
                          showForm: true,
                          showContract: false
                        })
                      }
                    >
                      Form Builder
                    </Button>
                    <Button.Or />
                    <Button
                      size="large"
                      disabled={taskIsEmpty}
                      primary={showContract ? false : true}
                      onClick={() =>
                        this.setState({
                          showBasic: false,
                          showMedia: false,
                          showForm: false,
                          showContract: true
                        })
                      }
                    >
                      Contract Builder
                    </Button>
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
