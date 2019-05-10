import React, { Component } from "react";
import NavBar from "./NavBar";
import { Tab, Grid, Button, Icon, Dimmer, Loader } from "semantic-ui-react";
import PaymentsTab from './PaymentsTab'

import { objectToArray } from "../../../../../../app/common/util/helpers";
import LoadingComponent from "../../../../../../app/layout/LoadingComponent";
import { selectDraftToEdit } from "../../../../draftActions";
import { selectTaskToEdit } from "../../../../../modals/TaskModal/taskActions";
//import ContractorSlider from "./BuildContractorTab/ContractorSlider";
import { openModal } from "../../../../../modals/modalActions";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

//PROBABLY PUT PAYMENTS IN HERE/ TRANSACTIONS
// const query = ({ selectedJobId }) => {

//   console.log("QUERY", selectedJobId);
//   return [
//     {
//       collection: "job_quotes",
//       where: [["jobId", "==", `${selectedJobId}`]],
//       storeAs: "job_quotes"
//     }
//   ];
// };

// const mapState = state => ({
//   jobQuotes: state.firestore.ordered.job_quotes || {}
// });

class MyContractsExpanded extends Component {
  state = {
    currentContract: {},
    selectedTab: "payments",
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
  async componentDidMount()  {
    const { selectedContract, auth } = this.props;

    this.setState({
      isLoading: false,
      currentContract: selectedContract,

      selectedTab: "payments"
    });


  }

  componentWillUnmount = () => {
    console.log("unmounting");
    this.setState({ currentContract: {} });
  };

  componentWillReceiveProps = nextProps => {
    if (!nextProps.expandedLoading) {
      if (nextProps.selectedContract !== this.state.currentContract) {
        const { selectedContract, auth } = nextProps;

        this.setState({
          isLoading: false,
          currentContract: selectedContract,

          selectedTab: "payments"
        });
        this.forceUpdate();
      }
    }
  };

  render() {
 const {compactDisplayMode} = this.props || {}

    const { selectedTab, currentContract } = this.state;
    const { displayURL, paymentType } = currentContract || {};
    const { jobData } = currentContract || {};
    const {lineItems} = currentContract || {}
    const {jobPhotoURL} = jobData || {}

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


<div
              style={{
                position: "absolute",
                right: 0,
                width: compactDisplayMode ? "100%" : "85%",
                height: compactDisplayMode ? 350 : 475,

                background: `url(${jobPhotoURL}) center center no-repeat `,
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
                  ? "linear-gradient(to top, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)"
                  : "linear-gradient(to left, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)"
                //  zIndex: "5"
              }}
            />

        {this.props.expandedLoading ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : (
          <div style={{width:"100%"}}>

        

            <div style={{ zIndex: "5" }}>
              <p
                style={{
                  cursor: "pointer",
                  color: "white",
                  zIndex: 50,
                  position: "absolute",
                  right: "0",

                  fontSize: compactDisplayMode? 20: 40,
                  marginRight: compactDisplayMode? 15: "25px",
                  marginTop: compactDisplayMode? 5: "15px",
                  textAlign: "right"
                }}
                onClick={() => {
                  this.props.handleClose();
                }}
              >
                X
              </p>

              {selectedTab === "payments" && (
                <div
                  className="description"
                  style={{
                    position: "absolute",
                    fontSize: 30,
                   
                    width: "100%",
                    top:20,
                    zIndex: "5"
                  }}
                >
                 <PaymentsTab paymentType={paymentType} compactDisplayMode={compactDisplayMode} lineItems={lineItems}/>
                </div>
              )}

      

       

              {selectedTab === "supplies" && (
                <div
                  className="contractors"
                  style={{
                    position: "absolute",
                    fontSize: compactDisplayMode? 20:30,
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
                    fontSize: compactDisplayMode? 20:30,
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
                  fontSize: compactDisplayMode? 20:30,
                  top: "20px",
                  color: "white",
                  height: 100,
                  width: "auto",
                  left: "10px",
                  zIndex: "5"
                }}
              >
                {" "}
                <p>{currentContract.title}</p>
              </div>


              <div
                style={{
                  className: "bottomDiv",
                  position: "absolute",
                  fontSize: compactDisplayMode? 20:30,
                //  minWidth: 100,
                width:"100%",
                  bottom: 0,
                //  left: "50%",
              //    marginLeft: "-170px",
       
                  zIndex: "5"
                }}
              >
                <NavBar
              compactDisplayMode={compactDisplayMode}
              navShow={this.state.selectedTab}
              handleSelectTab={this.handleSelectTab}
            />
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MyContractsExpanded;
