import React, { Component } from "react";

import { Tab, Grid, Button, Icon, Dimmer, Loader } from "semantic-ui-react";

//import BuildExpandedNavBar from "./BuildExpandedNavBar";
// import {
//   createJobDraft,
//   cancelToggle
// } from "../../../../../job/jobActions";
import { objectToArray } from "../../../../../../app/common/util/helpers";
import LoadingComponent from "../../../../../../app/layout/LoadingComponent";
import { selectDraftToEdit } from "../../../../draftActions";
import { selectTaskToEdit } from "../../../../../modals/TaskModal/taskActions";
//import ContractorSlider from "./BuildContractorTab/ContractorSlider";
import { openModal } from "../../../../../modals/modalActions";
import {compose} from 'redux'
import {connect} from 'react-redux'
import { firestoreConnect } from "react-redux-firebase";
import QuoteSlider from "./QuoteSlider";

const query = ({ selectedJobId }) => {

  console.log("QUERY", selectedJobId);
  return [
    {
      collection: "job_quotes",
      where: [["jobId", "==", `${selectedJobId}`]],
      storeAs: "job_quotes"
    }
  ];
};

const mapState = state => ({
  jobQuotes: state.firestore.ordered.job_quotes || {}
});

// const actions = {
//  // createJobDraft,
//  // cancelToggle,
//   selectDraftToEdit,
//   selectTaskToEdit,
//   openModal
// };

// const mapState = state => {
//   return {
//     loading: state.async.loading,
//     auth: state.firebase.auth
//   };
// };

class MyJobsExpanded extends Component {
  state = {
    currentJob: {},
    selectedTab: "quotes",
    loading: false,
    isLoading: false,
    pauseButtonLoading: false
    //subscribers: [],
  //  isSubscribed: false,
 //   isManager: false
  };

  handleSelectTab = tab => {
    this.setState({ selectedTab: tab });
  };
  componentDidMount() {
    const { selectedJob, auth } = this.props;
    const jobQuotes =
      selectedJob &&
      selectedJob.jobQuotes &&
      objectToArray(selectedJob.jobQuotes);
    // const isSubscribed =
    //   subscribers && auth && subscribers.some(a => a.id === auth.uid);
  //  const isManager = selectedJob&&selectedJob.managerUid === auth.uid;

    this.setState({
      quotes: jobQuotes,
   //   isSubscribed: isSubscribed,
      isLoading: false,
      currentJob: selectedJob,
    //  isManager: isManager,
      selectedTab: "quotes"
    });
  }

  componentWillUnmount = () => {
    console.log("unmounting");
    this.setState({ currentJob: {} });
  };

  componentWillReceiveProps = nextProps => {


   if(!nextProps.expandedLoading)
   {

   
    if (nextProps.selectedJob !== this.state.currentJob) {
      const { selectedJob, auth } = nextProps;
    //   const subscribers =
    //     selectedJob &&
    //     selectedJob.subscribers &&
    //     objectToArray(selectedJob.subscribers);
    //   const isSubscribed =
    //     subscribers && auth && subscribers.some(a => a.id === auth.uid);
    //   const isManager = selectedJob.managerUid === auth.uid;

      this.setState({
     //   subscribers: subscribers,
     //   isSubscribed: isSubscribed,
        isLoading: false,
        currentJob: selectedJob,
     //   isManager: isManager,
        selectedTab: "quotes"
      });
      this.forceUpdate();
    }
  }
  };

//   handleBookClick = async () => {
//     this.setState({ loading: true });
//     let createdJob = await this.props.createJobDraft(
//       this.props.selectedJob,
//       this.props.selectedJobId
//     );
//     console.log({ createdJob });
//     await this.props.selectDraftToEdit(createdJob.id);
//     this.setState({ loading: false });
//     this.props.openModal("CreateJobModal");
//   };

//   handleSubscribe = async () => {
//     const { currentJob } = this.state;
//     this.setState({ isLoading: true });
//     this.props.handleSubscribe();
//     // await this.props.subscribeToTask(currentJob);
//     // await this.props.selectTaskToEdit(currentJob.id);
//     this.setState({ isSubscribed: true, isLoading: false });
//   };

//   handleUnsubscribe = async () => {
//     console.log("handleUnsubscribe");
//     this.setState({ isLoading: true });
//     this.props.handleUnsubscribe();

//     this.setState({ isSubscribed: false, isLoading: false });
//   };

 
  render() {
    const { selectedTab, currentJob } = this.state;
 

  
    return (
      <div
        container
        style={{
          height: 475,
          // width: "100%",
          backgroundColor: "black",
          position: "relative"
        }}
      >
    
    {this.props.expandedLoading ?        <Dimmer active>
      <Loader />
    </Dimmer> :
(

<div>
        <div
          style={{
            position: "absolute",
            right: 0,
            minWidth: "85%",
            maxWidth: "85%",
            minHeight: 475,
            maxHeight: 475,
            background: `url('/assets/categoryImages/${
              currentJob.jobPhotoURL
            }.jpg') center center no-repeat `,
            backgroundSize: "cover"
          }}
        />

        <div
          style={{
            height: 475,
            position: "absolute",
            minWidth: "85%",
            right: 0,
            maxWidth: "85%",
            backgroundImage:
              "linear-gradient(to left, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)"
            //  zIndex: "5"
          }}
        />
        <div style={{ zIndex: "5" }}>
          <p
            style={{
              cursor: "pointer",
              color: "white",
              zIndex: "5",
              position: "absolute",
              right: "0",

              fontSize: 40,
              marginRight: "25px",
              marginTop: "15px",
              textAlign: "right"
            }}
            onClick={() => {
              this.props.handleClose();
            }}
          >
            X
          </p>

          {selectedTab === "overview" && (
            <div
              className="description"
              style={{
                position: "absolute",
                fontSize: 30,
                top: "50%",
                color: "white",
                height: 100,
                width: "auto",
                left: "50px",
                zIndex: "5"
              }}
            >
              {" "}
              <p>{currentJob.description}</p>
            </div>
          )}

          <div
            className="actionButton"
            style={{
              position: "absolute",
              fontSize: 30,
              top: "75%",
              color: "white",
              height: 100,
              width: "auto",
              left: "50px",
              zIndex: "5"
            }}
          >
            {" "}
            {/* <button
              onClick={this.handleBookClick}
              style={{
                width: 200,
                cursor: "pointer",
                color: "white",
                borderColor: "red",
                backgroundColor: this.state.isLoading ? "yellow" : "red"
              }}
            >
              Book
            </button> */}
     
            {!this.state.currentJob.inDraft?
            <Button
            icon
            size="huge"
            labelPosition="left"
            handlePostJob
            onClick={()=>this.props.handlePostJob(false, this.props.selectedJobId)}
            color="white"
            loading={this.props.pauseButtonLoading}
            >
            <Icon name="add" />
           Pause Job
            </Button>
            : 
            !this.state.currentJob.showState.showConfirm ? 
<Button
icon
size="huge"
labelPosition="left"
onClick={()=>this.props.handleEditDraft(this.props.selectedJobId)}
color="white"
loading={this.state.isLoading}
>
<Icon name="add" />
Complete Draft
</Button>
:
<Button
icon
size="huge"
labelPosition="left"
onClick={()=>this.props.handlePostJob(true, this.props.selectedJobId)}
color="white"
loading={this.props.pauseButtonLoading}
>
<Icon name="add" />
Dispatch Job
</Button>
          
          }
            {currentJob.inDraft &&currentJob.showState.showConfirm
            &&
              <button
                onClick={()=>this.props.handleEditDraft(this.props.selectedJobId)}
                
                style={{
                  width: 200,
                  marginLeft: "30px",
                  cursor: "pointer",
                  color: "white",
                  background: "transparent"
                }}
              >
                Edit Task
              </button>
           }
          </div>

          {selectedTab === "quotes" && (
            <div>
              {/* <div
              className="contractors"
              style={{
                position: "absolute",
                fontSize: 30,
                top: "50%",
                color: "white",
                backgroundColor: "grey",
                height: 100,
                width: "auto",
                left: "50px",
                zIndex: "5"
              }}
            >
              {" "}
              <p>Contractors Content</p>
            </div> */}
              <div
                className="contractors"
                style={{
                  position: "absolute",
                  fontSize: 30,
                  top: "33%",
                  color: "white",
                  //     backgroundColor: "grey",

                  //   height: 100,
                  //  width: "auto",
                  left: "0",
                  zIndex: "5"
                }}
              >
                {" "}
                 <QuoteSlider quotes={this.props.jobQuotes} /> 
              </div>
            </div>
          )}

          {selectedTab === "supplies" && (
            <div
              className="contractors"
              style={{
                position: "absolute",
                fontSize: 30,
                top: "50%",
                color: "white",
                height: 100,
                width: "auto",
                left: "50px",
                zIndex: "5"
              }}
            >
              {" "}
              <p>Supplies Content</p>
            </div>
          )}

          {selectedTab === "tips" && (
            <div
              className="contractors"
              style={{
                position: "absolute",
                fontSize: 30,
                top: "50%",
                color: "white",
                height: 100,
                width: "auto",
                left: "50px",
                zIndex: "5"
              }}
            >
              {" "}
              <p>Tips Content</p>
            </div>
          )}

          <div
            className="title"
            style={{
              position: "absolute",
              fontSize: 50,
              top: "20px",
              color: "white",
              height: 100,
              width: "auto",
              left: "10px",
              zIndex: "5"
            }}
          >
            {" "}
            <p>{currentJob.title}</p>
          </div>

          <div
            style={{
              position: "absolute",
              fontSize: 20,
              minWidth: 100,
              bottom: 0,
              left: "50%",
              marginLeft: "-170px",

              zIndex: "5"
            }}
          >
            {/* <BuildExpandedNavBar
              selectedTab={this.state.selectedTab}
              handleSelectTab={this.handleSelectTab}
            /> */}
          </div>
        </div>
</div>
)

}  
        
      </div>
    );
  }
}




export default compose(
  connect(mapState),
  firestoreConnect(props => query(props))
)(MyJobsExpanded);
