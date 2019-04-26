import React, { Component } from "react";

import { Tab, Grid, Button, Icon, Dimmer, Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import BuildExpandedNavBar from "./BuildExpandedNavBar";
import { createJobDraft, cancelToggle } from "../../../../../job/jobActions";
import { objectToArray } from "../../../../../../app/common/util/helpers";
import LoadingComponent from "../../../../../../app/layout/LoadingComponent";
import { selectDraftToEdit } from "../../../../draftActions";
import { selectTaskToEdit } from "../../../../../modals/TaskModal/taskActions";
import ContractorSlider from "./BuildContractorTab/ContractorSlider";
import { openModal } from "../../../../../modals/modalActions";
const actions = {
  createJobDraft,
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
    const isManager = selectedJob && selectedJob.managerUid === auth.uid;

    this.setState({
      subscribers: subscribers,
      isSubscribed: isSubscribed,
      isLoading: false,
      currentJob: selectedJob,
      isManager: isManager
    });
  }

  componentWillUnmount = () => {
    console.log("unmounting");
    this.setState({ currentJob: {} });
  };

  componentWillReceiveProps = nextProps => {
    if (!nextProps.expandedLoading) {
      if (nextProps.selectedJob !== this.state.currentJob) {
        const { selectedJob, auth } = nextProps;
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
          isManager: isManager,
          selectedTab: "overview"
        });
        this.forceUpdate();
      }
    }
  };

  handleBookClick = async () => {
    const { auth } = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;
    if (!authenticated) {
      this.props.openModal("RegisterModal");
    } else {
      this.setState({ loading: true });
      let createdJob = await this.props.createJobDraft(
        this.props.selectedJob,
        this.props.selectedJobId
      );
      console.log({ createdJob });
      await this.props.selectDraftToEdit(createdJob.id);
      this.setState({ loading: false });
      this.props.openModal("CreateJobModal");
    }
  };

  handleSubscribe = async () => {
    const { auth } = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;
    if (!authenticated) {
      this.props.openModal("RegisterModal");
    } else {
      const { currentJob } = this.state;
      this.setState({ isLoading: true });
      this.props.handleSubscribe();
      // await this.props.subscribeToTask(currentJob);
      // await this.props.selectTaskToEdit(currentJob.id);
      this.setState({ isSubscribed: true, isLoading: false });
    }
  };

  handleUnsubscribe = async () => {
    console.log("handleUnsubscribe");
    this.setState({ isLoading: true });
    this.props.handleUnsubscribe();

    this.setState({ isSubscribed: false, isLoading: false });
  };

  handleEdit = async () => {
    this.props.openModal("TaskModal");
  };
  render() {
    const { selectedTab, isManager, isSubscribed, currentJob } = this.state;
    const { compactDisplayMode, role } = this.props;
    const {isAdmin} = role || {}
    const { displayURL } = currentJob || "";

    return (
      <div
        container
        style={{
          height: compactDisplayMode ? 350 : 475,
          width: "100%",
          backgroundColor: "black",
          position: "relative"
        }}
      >
        {this.props.expandedLoading ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <div>
            <div
              style={{
                position: "absolute",
                right: 0,
                width: compactDisplayMode ? "100%" : "85%",
                height: compactDisplayMode ? 350 : 475,

                background: `url(${displayURL}) center center no-repeat `,
                backgroundSize: "cover"
              }}
            />

            <div
              style={{
                height: compactDisplayMode ? 350 : 475,
                position: "absolute",
                width: compactDisplayMode ? "100%" : "85%",
                right: 0,
                //   maxWidth: "85%",
                backgroundImage: compactDisplayMode
                  ? "linear-gradient(to bottom, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)"
                  : "linear-gradient(to left, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)"
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

                  fontSize: compactDisplayMode ? 30 : 40,
                  marginRight: compactDisplayMode ? "15px": "25px",
                  marginTop: compactDisplayMode? "10px": "15px",
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
                {isAdmin&&<Button
                  icon
                  size={compactDisplayMode ? "small" : "huge"}
                  labelPosition="left"
                  positive
                  onClick={this.handleBookClick}
                  color="white"
                  loading={this.state.isLoading}
                >
                  <Icon name="add" />
                  Book Job
                </Button>}
                {isManager ? (
                  <Button
                    onClick={this.handleEdit}
                    size={compactDisplayMode ? "small" : "huge"}
                    color="white"
                    // style={{
                    //   width: 200,
                    //   marginLeft: "30px",
                    //   cursor: "pointer",
                    //   color: "white",
                    //   background: "transparent"
                    // }}
                  >
                    Edit Task
                  </Button>
                ) : isSubscribed ? (
                  // <button
                  //   onClick={this.handleUnsubscribe}
                  //   style={{
                  //     width: 200,
                  //     marginLeft: "30px",
                  //     cursor: "pointer",
                  //     color: "white",
                  //     background: "transparent",
                  //     backgroundColor: this.props.subscribeButtonLoading ? "yellow" : "red"
                  //   }}
                  // >
                  //   Unsubscribe
                  // </button>

                  <Button
                    icon
                    size={compactDisplayMode ? "small" : "huge"}
                    labelPosition="left"
                    onClick={this.handleUnsubscribe}
                    color="white"
                    loading={this.props.subscribeButtonLoading}
                  >
                    <Icon name="deaf" />
                    Unsubscribe
                  </Button>
                ) : (
                  // <button
                  //   onClick={this.handleSubscribe}
                  //   style={{
                  //     width: 200,
                  //     marginLeft: "30px",
                  //     cursor: "pointer",
                  //     color: "white",
                  //     background: "transparent",
                  //     backgroundColor: this.props.subscribeButtonLoading ? "yellow" : "red"
                  //   }}
                  // >
                  //   Subscribe
                  // </button>
                  <Button
                    icon
                    size={compactDisplayMode ? "small" : "huge"}
                    labelPosition="left"
                    onClick={this.handleSubscribe}
                    color="white"
                    loading={this.props.subscribeButtonLoading}
                  >
                    <Icon name="assistive listening systems" />
                    Subscribe
                  </Button>
                )}
              </div>

              {selectedTab === "contractors" && (
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
                    <ContractorSlider
                      compactDisplayMode={compactDisplayMode}
                      items={this.state.currentJob.subscribers}
                    />
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
                <p>{this.state.currentJob.string}</p>
              </div>

              <div
                style={{
                  position: "absolute",
                  fontSize: 20,

                  bottom: 0,
                  left: 0,//compactDisplayMode ? 0 : "50%",
                  marginLeft: 0,// compactDisplayMode ? "0" : "-170px",
                  width: compactDisplayMode ? "100%" : "100%",
                  zIndex: "5"
                }}
              >
                <BuildExpandedNavBar
                  selectedTab={this.state.selectedTab}
                  handleSelectTab={this.handleSelectTab}
                  compactDisplayMode={compactDisplayMode}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(BuildExpanded);
