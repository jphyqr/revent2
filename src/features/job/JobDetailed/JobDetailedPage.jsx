import React, { Component } from "react";
import { Grid , Segment, Button, Dimmer, Loader} from "semantic-ui-react";
import { connect } from "react-redux";
import { firestoreConnect, firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import JobDetailedHeader from "./JobDetailedHeader";
import JobDetailedInfo from "./JobDetailedInfo";
import JobDetailedChat from "./JobDetailedChat";
import JobDetailedSidebar from "./JobDetailedSidebar";
import { objectToArray, createDataTree } from "../../../app/common/util/helpers";
import { bidJob, cancelBidForJob } from "../../user/userActions";
import { addJobComment } from "../jobActions";
import LoadingComponent from '../../../app/layout/LoadingComponent'
import OwnerProfile from '../JobDashboard/OwnerProfile'
import OpenJobSummary from '../JobDashboard/OpenJobSummary'
import {selectDraftToEdit} from '../../build/draftActions'
import {openModal} from '../../modals/modalActions'


const query = ({ auth, match }) => {
  const authenticated = auth.isLoaded && !auth.isEmpty;
  if (authenticated) {
    return [
      {
        collection: "jobs",
        doc: match.params.id,
        storeAs: "job"
      },
      {
        collection: "users",
        doc: auth.uid,
        subcollections: [{ collection: "quotes" }],
        storeAs: "my_quotes"
      }
    ];
  } else {
    return [
      {
        collection: "jobs",
        doc: match.params.id,
        storeAs: "job"
      },
    ];
  }
};



const mapState = state => ({
  loading: state.async.loading,
  auth: state.firebase.auth,
  selectedJob: (state.firestore.ordered.job&&state.firestore.ordered.job[0]) || {},
  myQuotes: state.firestore.ordered.my_quotes ||{},
   authenticated:  (state.firebase.auth.isLoaded && !state.firebase.auth.isEmpty)
});

const actions = {
selectDraftToEdit, openModal
};

class JobDetailedPage extends Component {

  state = {
    jobId: "",
    quoteId: "",
    showEditButton: false,
    quotesLoading: false
  };

  async componentDidMount()  {
    const { jobId } = this.state;
    const { match, myQuotes } = this.props ||{};





    this.setState({ quotesLoading: true });
    await this.props.selectDraftToEdit(match.params.id);
 
    this.setState({ quotesLoading: false });



      this.setState({
        jobId: match.params.id,
        quoteId: "",
        showEditButton: false,
        quoteButtonLoading: true
      })

      for (var i = 0; i < myQuotes.length; i++) {
        if (
          typeof myQuotes[i] == "object" &&
          myQuotes[i].jobId === match.params.id
        ) {
          this.setState({ quoteId: myQuotes[i].quoteId, showEditButton: true });
        }
      }
    }
  



  render() {
    const {
      selectedJob,
      myQuotes,
      requesting,
      auth
    //  bidJob,
    //  cancelBidForJob,
  //    addJobComment,
   //   loading,
   
    } = this.props ||{};

    const {
      ownerUid,
    } = selectedJob ||{};

const {showEditButton, quotesLoading} = this.state
 //const isHost = selectedJob.ownerUid === auth.uid;
  //  const bids =
 //     selectedJob && selectedJob.bids && objectToArray(selectedJob.bids);
//    const hasBid = bids && bids.some(a => a.id === auth.uid);
 //   const chatTree = !isEmpty(selectedJobChat) && createDataTree(selectedJobChat)

 if (!isLoaded(selectedJob)||isEmpty(selectedJob) || requesting)
 return (

     <LoadingComponent inverted={true} />
  
 );


    return (
      <Segment attached="bottom" style={{ paddingBottom: "0px" }}>
        <div>
          {quotesLoading ? (
            <Dimmer style={{ paddingBottom: "0px" }} active inverted>
              <Loader style={{ paddingBottom: "0px" }} content="Loading Job" />
            </Dimmer>
          ) : (
            <Grid>
              <Grid.Column mobile={0} tablet={1} largeScreen={4}>

</Grid.Column>
              <Grid.Column largeScreen={8} mobile={16} tablet={14}>
              {showEditButton ? (
                  <Button
                    primary
                    loading={quotesLoading}
                    fluid
                    onClick={this.handleEditQuote}
                  >
                    Edit Quote
                  </Button>
                ) : (
                  <Button
                    primary
                    loading={quotesLoading}
                    fluid
                    onClick={() => this.props.openModal("QuoteJobModal")}
                  >
                    Quote Now
                  </Button>
                )}
                <OpenJobSummary selectedJob={selectedJob} />{" "}

                <OwnerProfile
                  
                  ownerUid={ownerUid}
                />

              </Grid.Column>
              <Grid.Column mobile={0} tablet={1} largeScreen={4}>

</Grid.Column>
            </Grid>
          )}
        </div>
      </Segment>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(JobDetailedPage));
