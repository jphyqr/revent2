import React, { Component } from "react";
import { Modal , Responsive} from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { Loader, Dimmer } from "semantic-ui-react";
import { withFirestore, isEmpty, isLoading } from "react-redux-firebase";
import { compose } from "redux";
import JobForm from "./JobForm";
import JobCustomForm from "./JobCustomForm";
import JobOverview from "./JobOverview";
import JobScheduleForm from "./JobScheduleForm";
import JobConfirmForm from "./JobConfirmForm";
import JobContractForm from "./JobContractForm";
import JobPhotos from "./JobPhotos";
import JobProgress from "./JobProgress";
import { Button, Message } from "semantic-ui-react";
import {postToggle} from '../../build/draftActions'
import { getAllJobsForDashboard, dispatchJob, uploadJobPhoto, updateJobCustom, updateJobPhotosPage, updateJobSchedule ,updateJobBasic, updateJobContract} from "../../job/jobActions";
const actions = {
  uploadJobPhoto,
  closeModal,
  updateJobCustom,
  updateJobPhotosPage,
  updateJobSchedule,
  updateJobBasic,
  updateJobContract,
  postToggle,
  dispatchJob,
  getAllJobsForDashboard
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
    draft: state.draft
  };
};

class CreateJobModal extends Component {
  state = { showModal: true, jobSuccess: false };

 handleJobPosted = async () => {
  await this.props.getAllJobsForDashboard()
  await this.setState({jobSuccess:true})
 }

 handleOnUpdate = (e, { width }) => this.setState({ width })

  handlePhotoUploaded = async url => {
    console.log("Create JobModal photo uploaded url", url);
    await this.props.uploadJobPhoto(this.props.draft.key, url);
    //this.setState({ exampleURL: exampleURL });
    //this.setState({ examplePhotoHasUpdated: true });
  };

  render() {
    const {
      closeModal,
      userUID,
      showBasic,
      showJobSpecific,
      showContractSpecific,
      job,
      loading,
      draft,updateJobCustom, dispatchJob, postToggle, postJob, updateJobPhotosPage, updateJobSchedule,updateJobBasic,updateJobContract
    } = this.props ||{};
   const {width} = this.state ||{}
    const { value: draftValue } = draft ||{};

    const { showState } = draftValue ||{};

    const CUSTOM_TABLET_CUTOFF = 800;
    const compactDisplayMode = width >= CUSTOM_TABLET_CUTOFF ? false : true;
    const modalSize = width >= Responsive.onlyComputer.minWidth ? 'small' : width >= Responsive.onlyTablet.minWidth ? 'large' : 'fullscreen'
    return (
      <Responsive as={Modal} size={modalSize} style={{ maxHeight: 800, overflowY: "auto", overflowX:"hidden" }}
      closeIcon onClose={()=>this.props.closeModal()}
      open={this.state.showModal}  fireOnMount onUpdate={this.handleOnUpdate}>
   
        <Modal.Header>
          {draft.value.name}
        
        </Modal.Header>
        {job}
        {this.state.jobSuccess ? <div>
          
          
          <Message
    success
    header='Your job is now dispatched!'
    content='You will be e-mailed quotes from contractors'
  />
  
  <Button disabled>Turn on SMS</Button>
  <Button disabled>Download App</Button>
  <Button disabled>How To Manage Job</Button>
  
  </div> : 
<div style={{margin:5}}>
        <JobProgress compactDisplayMode={compactDisplayMode} showState={showState} />
        <Modal.Content>
          <Modal.Description>
            <div style={{ minHeight: 350}}>
              {loading ? (
                <Dimmer active inverted>
                  <Loader content="Updating Job" />
                </Dimmer>
              ) : showState.showOverview ? (
                <JobOverview draftValue={draftValue} />
              ) : showState.showContract ? (
                <JobContractForm
                draft={draft}
                updateJobContract={updateJobContract}
                />
              ) : showState.showBasic ? (
                this.props.draft && <JobForm draft={draft}  updateJobBasic={updateJobBasic}/>
              ) : showState.showCustom ? (
                <JobCustomForm
                updateJobCustom={updateJobCustom}
                  draft={draft}
                  handlePhotoUploaded={this.handlePhotoUploaded}
                />
              ) : showState.showPhotos ? (
                <JobPhotos
                  draft={draft}
                  handlePhotoUploaded={this.handlePhotoUploaded}
                  updateJobPhotosPage = {updateJobPhotosPage}
                />
              ) : showState.showSchedule ? (
                <JobScheduleForm  draft={draft}
                updateJobSchedule={updateJobSchedule}
                />
              ) : showState.showConfirm ? (
                <JobConfirmForm handleJobPosted={this.handleJobPosted} draft={draft} postJob={postJob} dispatchJob={dispatchJob}/>
              ) : null}
            </div>
          </Modal.Description>
        </Modal.Content>
        </div>
        }
    
      </Responsive>
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
