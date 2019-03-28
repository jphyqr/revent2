import React, { Component } from "react";

import { Tab, Grid, Button, Icon, Dimmer, Loader } from "semantic-ui-react";

import { objectToArray } from "../../../../../../app/common/util/helpers";
import LoadingComponent from "../../../../../../app/layout/LoadingComponent";
import { selectDraftToEdit } from "../../../../draftActions";
import { selectTaskToEdit } from "../../../../../modals/TaskModal/taskActions";
import NavBar from './NavBar'
import { openModal } from "../../../../../modals/modalActions";
import { compose } from "redux";
import { connect } from "react-redux";

class ExclusiveJobsExpanded extends Component {
  state = {
    currentJob: {},
    selectedTab: "overview",
    loading: false,
    isLoading: false,
    isManager: false
  };

  handleBookClick = async () => {
    this.setState({ loading: true });
    let createdJob = await this.props.createJobDraft(
      this.props.selectedJob,
      this.props.selectedJobId
    );
    console.log({ createdJob });
    await this.props.selectDraftToEdit(createdJob.id);
    this.setState({ loading: false });
    this.props.openModal("CreateJobModal");
  };

  handleEdit = async () => {
    this.props.openModal("TaskModal");
  };
  handleSelectTab = tab => {
    this.setState({ selectedTab: tab });
  };
  componentDidMount() {
    const { selectedJob, auth } = this.props || {};
    const isManager = selectedJob && selectedJob.managerUid === auth.uid;

    this.setState({
      isLoading: false,
      currentJob: selectedJob,
      isManager: isManager,
      selectedTab: "quotes"
    });
  }

  componentWillUnmount = () => {
    console.log("unmounting");
    this.setState({ currentJob: {} });
  };

  componentWillReceiveProps = nextProps => {
    if (!nextProps.expandedLoading) {
      if (nextProps.selectedJob !== this.state.currentJob) {
        const { selectedJob, auth } = nextProps || {};
        const isManager = selectedJob.managerUid === auth.uid;

        this.setState({
          isLoading: false,
          currentJob: selectedJob,
          isManager: isManager,
          selectedTab: "overview"
        });
        this.forceUpdate();
      }
    }
  };

  render() {
    const { selectedTab, currentJob, isManager } = this.state;

    const { displayURL, description } = currentJob || {};
    return (
      <div
        container
        style={{
          height: 600,
           width: "100%",
          backgroundColor: "black",
          position: "relative",
          
        }}
      >
        {this.props.expandedLoading ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <div>
            {/* <div
              style={{
                position: "absolute",
                right: 0,
                minWidth: "85%",
                maxWidth: "85%",
                minHeight: 600,
                maxHeight: 600,
                background: `url(${displayURL}) center center no-repeat `,
                backgroundSize: "cover"
              }}
            /> */}

            {/* <div
              style={{
                height: 600,
                position: "absolute",
                minWidth: "85%",
                right: 0,
                maxWidth: "85%",
                backgroundImage:
                  "linear-gradient(to left, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)",
                zIndex: 2
              }}
            /> */}


    <div              style={{
                 width: "100%",
                 height: 600,
                position: "absolute",
                minWidth: "25%",
                left: 825,

                bottom:0,
                maxWidth: "25%",
                backgroundImage:
                  "linear-gradient(to left, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)",
                zIndex: 2
              }}>
    
    </div>
  <video
              style={{ position: "absolute", right:"0", bottom:0, minHeight:"100%" }}
              height="600"
              autoPlay
              muted
              loop
              id="myVideo"
             
              
            >
              <source src="/assets/Loop_Final_Version.mp4" type="video/mp4" />
            </video>
  


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
                  <p>{description}</p>
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
                <Button
                  icon
                  size="huge"
                  labelPosition="left"
                  onClick={this.handleBookClick}
                  color="white"
                  loading={this.state.isLoading}
                >
                  <Icon name="add" />
                  Book Job
                </Button>
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
                ) : null}
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
                    {/* <ContractorSlider items={this.state.currentJob.subscribers} /> */}
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
                  minWidth: 100,
                  bottom: 0,
                  left: "50%",
                  marginLeft: "-170px",

                  zIndex: "5"
                }}
              >
              <NavBar  selectedTab={this.state.selectedTab}
              handleSelectTab={this.handleSelectTab}/>
                {/* <BuildExpandedNavBar
              selectedTab={this.state.selectedTab}
              handleSelectTab={this.handleSelectTab}
            /> */}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default compose(connect())(ExclusiveJobsExpanded);
