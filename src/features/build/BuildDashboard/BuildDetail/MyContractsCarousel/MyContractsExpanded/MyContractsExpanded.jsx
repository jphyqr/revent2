import React, { Component } from "react";

import { Tab, Grid, Button, Icon, Dimmer, Loader } from "semantic-ui-react";


import { objectToArray } from "../../../../../../app/common/util/helpers";
import LoadingComponent from "../../../../../../app/layout/LoadingComponent";
import { selectDraftToEdit } from "../../../../draftActions";
import { selectTaskToEdit } from "../../../../../modals/TaskModal/taskActions";
//import ContractorSlider from "./BuildContractorTab/ContractorSlider";
import { openModal } from "../../../../../modals/modalActions";
import {compose} from 'redux'
import {connect} from 'react-redux'
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
    const { selectedContract, auth } = this.props;

    this.setState({

      isLoading: false,
      currentContract: selectedContract,

      selectedTab: "quotes"
    });
  }

  componentWillUnmount = () => {
    console.log("unmounting");
    this.setState({ currentContract: {} });
  };

  componentWillReceiveProps = nextProps => {


   if(!nextProps.expandedLoading)
   {

   
    if (nextProps.selectedContract !== this.state.currentContract) {
      const { selectedContract, auth } = nextProps;


      this.setState({

        isLoading: false,
        currentContract: selectedContract,
  
        selectedTab: "quotes"
      });
      this.forceUpdate();
    }
  }
  };


 
  render() {
    const { selectedTab, currentContract } = this.state;
 const {displayURL} = currentContract || {}
const {jobData} = currentContract || {}
const {jobPhotoURL} = jobData || ""
  
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
            background: `url(${
            jobPhotoURL}) center center no-repeat `,
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
              "linear-gradient(to left, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)",
              zIndex: "5"
          }}
        />

<div style={{

    zIndex:10,
    height: 150,
    width: 300,
    backgroundColor: "lightgrey",
    position: "absolute",
    bottom: 200,
    left: 200,
    margin:"10px"
  
}}>

    <Button positive style={{width:"100%", padding:20}}>Send Job to Primary Supplier</Button>

    <Grid>
        <Grid.Column width={4}>
        <img
            style={{
              height: 75, //this.state.hovered ? 200 : 150,
              width: 75, //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
              //    left:this.state.hovered ? 50 : 0,
              //       opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              //    transition: "opacity 1500ms , height 1500ms , width 1500ms ",
              //      transform: this.state.hovered?"scale(1.5)":"scale(1)",
              //    transformOrigin: "50% 50%",
              transition: "0.15s all ease",
              zIndex:"20",
              padding:"10px"
            }}
            src="assets/supplier.png"
          />
        
        </Grid.Column>
        <Grid.Column style={{margin:"10px"}} width={8}>
        <label style={{padding:10}}> Tagard Sand and Gravel </label>
        </Grid.Column>
    </Grid>

   
</div>

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
              <p>{currentContract.description}</p>
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
     
            {!this.state.currentContract.inDraft?
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
            !this.state.currentContract.showState.showConfirm ? 
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
Change Order
</Button>
          
          }
            {currentContract.inDraft &&currentContract.showState.showConfirm
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
            <p>{currentContract.title}</p>
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




export default 
(MyContractsExpanded);
