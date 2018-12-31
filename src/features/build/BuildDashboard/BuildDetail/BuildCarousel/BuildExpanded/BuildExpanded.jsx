import React, { Component } from "react";

import { Tab, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import BuildExpandedNavBar from "./BuildExpandedNavBar";
import {
  createJobDraft,
  updateJob,
  cancelToggle
} from "../../../../../job/jobActions";
import { objectToArray } from "../../../../../../app/common/util/helpers";
import LoadingComponent from "../../../../../../app/layout/LoadingComponent";
import { selectDraftToEdit } from "../../../../draftActions";
import {selectTaskToEdit} from '../../../../../modals/TaskModal/taskActions'
import { openModal } from "../../../../../modals/modalActions";
const actions = {
  createJobDraft,
  updateJob,
  cancelToggle,
  selectDraftToEdit,
  selectTaskToEdit,
  openModal
};

const mapState = state => {
  return {
    loading: state.async.loading,
    auth: state.firebase.auth
  };
};

class BuildExpanded extends Component {
  state = {
    currentJob: {},
    selectedTab: "overview",
    loading: false,
    isLoading: false,
    subscribers: [],
    isSubscribed: false,
    isManager: false
  };

  handleSelectTab = tab => {
    this.setState({ selectedTab: tab });
  };
  componentDidMount() {
    const { selectedJob, auth } = this.props;
    const subscribers =
      selectedJob &&
      selectedJob.subscribers &&
      objectToArray(selectedJob.subscribers);
    const isSubscribed =
      subscribers && auth && subscribers.some(a => a.id === auth.uid);
    const isManager = selectedJob.managerUid === auth.uid;

    this.setState({
      subscribers: subscribers,
      isSubscribed: isSubscribed,
      isLoading: false,
      currentJob: selectedJob,
      isManager: isManager
    });
  }

  componentWillUnmount = () =>{
    console.log('unmounting')
    this.setState({currentJob:{}})
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedJob !== this.state.currentJob) {
      const { selectedJob, auth } = nextProps
      const subscribers =
        selectedJob &&
        selectedJob.subscribers &&
        objectToArray(selectedJob.subscribers);
      const isSubscribed =
        subscribers && auth && subscribers.some(a => a.id === auth.uid);
      const isManager = selectedJob.managerUid === auth.uid;
  
      this.setState({
        subscribers: subscribers,
        isSubscribed: isSubscribed,
        isLoading: false,
        currentJob: selectedJob,
        isManager: isManager
      });
       this.forceUpdate();
    } 
  };

  handleBookClick = async () => {
    this.setState({ loading: true });
    let createdJob = await this.props.createJobDraft(this.state.currentJob);

    await this.props.selectDraftToEdit(createdJob.id);
    this.setState({ loading: false });
    this.props.openModal("TaskModal");
  };

  handleSubscribe = async () => {
    const {currentJob} = this.state
    this.setState({ isLoading: true });
    this.props.handleSubscribe()
    // await this.props.subscribeToTask(currentJob);
    // await this.props.selectTaskToEdit(currentJob.id);
    this.setState({ isSubscribed: true, isLoading: false });
  };

  handleUnsubscribe = async () =>{
    console.log('handleUnsubscribe')
    this.setState({ isLoading: true });
    this.props.handleUnsubscribe()
    
    this.setState({ isSubscribed: false, isLoading: false });
  }


  handleEdit = async () =>{
    
    this.props.openModal("TaskModal") 
  }
  render() {
    const { selectedTab, isManager, isSubscribed } = this.state;

    return (
      <div
        container
        style={{
          height: 475,
          width: "auto",
          backgroundColor: "black",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            minWidth: "85%",
            maxWidth: "85%",
            minHeight: 475,
            maxHeight: 475,
            background: `url('/assets/categoryImages/${
              this.props.selectedJob.value
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
              <p>Desription Content</p>
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
            <button
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
            </button>
            {isManager ? (
              <button
                onClick={this.handleEdit}
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
            ) : isSubscribed ? (
              <button
                onClick={this.handleUnsubscribe}
                style={{
                  width: 200,
                  marginLeft: "30px",
                  cursor: "pointer",
                  color: "white",
                  background: "transparent",
                  backgroundColor: this.props.subscribeButtonLoading ? "yellow" : "red"
                }}
              >
                Unsubscribe
              </button>
            ) : (
              <button
                onClick={this.handleSubscribe}
                style={{
                  width: 200,
                  marginLeft: "30px",
                  cursor: "pointer",
                  color: "white",
                  background: "transparent",
                  backgroundColor: this.props.subscribeButtonLoading ? "yellow" : "red"
                }}
              >
                Subscribe
              </button>
            )}
          </div>

          {selectedTab === "contractors" && (
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
              <p>Contractors Content</p>
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
            <p>{this.state.currentJob.string}</p>
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
            <BuildExpandedNavBar
              selectedTab={this.state.selectedTab}
              handleSelectTab={this.handleSelectTab}
            />
          </div>
        </div>

        {/* <div style={{ position: "absolute", right: "50%", marginTop:"400px"  }}>
          <Tab menu={{ secondary: true, pointing: true , attached:'bottom'}} panes={panes} />
        </div> */}
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(BuildExpanded);
