import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { withFirestore, firebaseConnect, isEmpty } from "react-redux-firebase";
import { compose } from "redux";
import JobDetailedHeader from "./JobDetailedHeader";
import JobDetailedInfo from "./JobDetailedInfo";
import JobDetailedChat from "./JobDetailedChat";
import JobDetailedSidebar from "./JobDetailedSidebar";
import { objectToArray, createDataTree } from "../../../app/common/util/helpers";
import { goingToJob, cancelGoingToJob } from "../../user/userActions";
import { addJobComment } from "../jobActions";

const mapState = (state, ownProps) => {
  let job = {};

  if (state.firestore.ordered.jobs && state.firestore.ordered.jobs[0]) {
    job = state.firestore.ordered.jobs[0];
  }

  return {
    job,
    loading: state.async.loading,

    auth: state.firebase.auth,
    jobChat:
      !isEmpty(state.firebase.data.job_chat) &&
      objectToArray(state.firebase.data.job_chat[ownProps.match.params.id])
  };
};

const actions = {
  goingToJob,
  cancelGoingToJob,
  addJobComment
};

class JobDetailedPage extends Component {
  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`jobs/${match.params.id}`);
  }
  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`jobs/${match.params.id}`);
  }

  render() {
    const {
      job,
      auth,
      goingToJob,
      cancelGoingToJob,
      addJobComment,
      loading,
      jobChat
    } = this.props;
    const attendees =
      job && job.attendees && objectToArray(job.attendees);
    const isHost = job.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    const chatTree = !isEmpty(jobChat) && createDataTree(jobChat)
    return (
      <Grid>
        <Grid.Column width={10}>
          <JobDetailedHeader
            job={job}
            loading={loading}
            isHost={isHost}
            isGoing={isGoing}
            goingToJob={goingToJob}
            cancelGoingToJob={cancelGoingToJob}
          />
          <JobDetailedInfo job={job} />
          <JobDetailedChat
            addJobComment={addJobComment}
            jobId={job.id}
            jobChat={chatTree}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <JobDetailedSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  withFirestore,
  connect(
    mapState,
    actions
  ),
  firebaseConnect(props => [`job_chat/${props.match.params.id}`])
)(JobDetailedPage);
