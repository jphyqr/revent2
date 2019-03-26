import React, { Component } from "react";
import ExclusiveJobsSlider from "./ExclusiveJobsSlider/ExclusiveJobsSlider";
import ExclusiveJobsExpanded from "./ExclusiveJobsExpanded/ExclusiveJobsExpanded";
import { Transition } from "semantic-ui-react";
import {connect} from 'react-redux'
import {
  createJobDraft
  
} from "../../../../job/jobActions";
import {selectTaskToEdit} from '../../../../modals/TaskModal/taskActions'
import { selectDraftToEdit } from "../../../draftActions";
import { openModal } from "../../../../modals/modalActions";
const mapState = state => {
//  const tasksInCategory = state.firestore.ordered.tasksInCategory
   
  return {
    auth: state.firebase.auth,
    loading: state.async.loading,
 //   tasks: tasksInCategory,
    task: state.task&&state.task
  };
};


const actions = {
 selectTaskToEdit,createJobDraft,selectDraftToEdit, openModal
    
}

class ExclusiveJobsCarousel extends Component {
  state = {
    showExpanded: false,
    sliding: false,
    job: "",
    lockInHover: false,
    childIsExpanding: false,
    carouselHovered: false,
    carouselRef: {},
    scrollRef: {},
    index: 0,
    nextRef: {},
    selectedJob: {},
    exclusiveJobs: [],
    subscribeButtonLoading: false,
    expandedLoading: false,


  };

  toggleLockInHover = () => {
    this.setState({ lockInHover: true });
  };

  handleShowExpanded = async draft => {
    console.log({draft})
  
    this.setState({ expandedLoading: true });

    let draftUserId = draft.id;
    let draftId = draftUserId.split("_")[0];

    let newTask = await this.props.selectTaskToEdit(draft);
    console.log({ newTask });
    
    this.setState({ selectedJob: this.props.task, showExpanded: true });
    this.setState({ expandedLoading: false });
  };

  handleClose = () => {
    this.setState({ showExpanded: false, lockInHover: false });
  };

  async componentDidMount() {
    const { exclusiveJobs } = this.props;

    if (exclusiveJobs && exclusiveJobs.length > 0) {


     
        for (let i = exclusiveJobs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [exclusiveJobs[i], exclusiveJobs[j]] = [exclusiveJobs[j], exclusiveJobs[i]];
        }
    
      this.setState({ exclusiveJobs: exclusiveJobs, selectedJob: this.props.task });
    }
  }



  render() {
    const { exclusiveJobs, selectDraftToEdit, scrollToMyRef } = this.props;
    const {projectsHovered, projectsSelected, contractsHovered, contractsSelected} = this.state
    return (
      <div style={{ marginTop: 30 }}>
        <p
        onMouseEnter={()=>this.setState({projectsHovered:true})}
        onMouseLeave={()=>this.setState({projectsHovered:false})}
        onClick={()=>this.setState({projectsSelected:true, contractsSelected:false})}
          style={{
            display: "inline-block",
            color: projectsSelected? "orange" : "white",
            fontSize: 26,
            opacity: (projectsHovered ||projectsSelected)? 
            1:0.4,
            margin: 5,
            marginRight: 20
          }}
        >
        Exclusive Jobs
        </p>

        <ExclusiveJobsSlider 

selectDraftToEdit={selectDraftToEdit}
selectedJobId={this.state.selectedJob.key}
           scrollToMyRef={scrollToMyRef}
           handleShowExpanded={this.handleShowExpanded}
           toggleLockInHover={this.toggleLockInHover}
           exclusiveJobs={exclusiveJobs}
         />



<Transition.Group animation="scale" duration={400}>
{(this.state.showExpanded || this.state.expandedLoading) && (
  <ExclusiveJobsExpanded
  selectDraftToEdit={this.props.selectDraftToEdit}
  openModal = {this.props.openModal}
  createJobDraft={this.props.createJobDraft}
    selectedJob={this.state.selectedJob.value}
    selectedJobId={this.state.selectedJob.key}
    handleViewQuote={this.props.handleViewQuote}
    handleNewChat={this.props.handleNewChat}
    handleClose={this.handleClose}
    handleEditDraft={this.props.handleEditDraft}
    handlePostJob={this.props.handlePostJob}
    loading={this.props.loading}
    exclusiveJobs={exclusiveJobs}
    expandedLoading={this.state.expandedLoading}
    pauseButtonLoading={this.props.pauseButtonLoading}
  />
)}
</Transition.Group>
</div> 
      
    );
  }
}

export default connect(mapState,actions)(ExclusiveJobsCarousel);
