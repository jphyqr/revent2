import React, { Component } from "react";
import { Grid, Sticky, Segment, Container } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { connect } from "react-redux";
import JobMap from "./JobMap";
import JobList from "../JobList/JobList";
import { getJobsForDashboard } from "../jobActions";
import { deleteJobDraft } from "../../user/userActions";
import { firestoreConnect } from "react-redux-firebase"; //even though we using firestore this gives our binding
import MyJobs from "./MyJobs/MyJobs";
const query = ({ auth }) => {
  return [
    {
      collection: "job_attendee",
      where: [["userUid", "==", `${auth}`]],
      storeAs: "jobs_attended"
    }
  ];
};

const mapState = state => ({
  jobs: state.jobs,
  loading: state.async.loading,
  auth: state.firebase.auth.uid,
  myJobs: state.firestore.ordered.jobs_attended
});

const actions = {
  getJobsForDashboard,
  deleteJobDraft
};

class JobDashboard extends Component {
  state = {
    moreJobs: false,
    loadingInitial: true,
    loadedJobs: [],
    contextRef: {},
    scrollToId: ""
  };

  async componentDidMount() {
    let next = await this.props.getJobsForDashboard();

    if (next && next.docs && next.docs.length > 1) {
      this.setState({
        moreJobs: true,
        loadingInitial: false
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.jobs !== nextProps.jobs) {
      this.setState({
        loadedJobs: [...this.state.loadedJobs, ...nextProps.jobs]
      });
    }
  }
  handleDelete = job => {
    this.setState({ render:  "false" });
    this.props.deleteJobDraft(job);
    this.setState({ render: "true" });
  };
  getNextJobs = async () => {
    const { jobs } = this.props;
    let lastJob = jobs && jobs[jobs.length - 1];

    let next = await this.props.getJobsForDashboard(lastJob);

    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreJobs: false
      });
    }
  };

  handleMapItemClick = id => {
   
    this.setState({
      scrollToId: id
    });
  };

  handleContextRef = contextRef =>
    this.setState({
      contextRef
    });

  render() {
    const { loading } = this.props;
    const { moreJobs, loadedJobs } = this.state;
    //   if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Segment
              style={{
                padding: 0,
                borderRadius: "0px",
                backgroundColor: "darkgrey"
              }}
            >
              <MyJobs
                myJobs={this.props.myJobs}
                handleDelete={this.handleDelete}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <JobMap
              jobs={loadedJobs}
              lat={50.44}
              lng={-104.61}
              handleMapItemClick={this.handleMapItemClick}
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <div ref={this.handleContextRef}>
              <JobList
                offset={100}
                jobs={loadedJobs}
                loading={loading}
                moreJobs={moreJobs}
                getNextJobs={this.getNextJobs}
                scrollToId={this.state.scrollToId}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
        {/* <Grid.Row>
          <Grid.Column width={16}>
            <Segment>
              <Header dividing content="Jobs I am following" />
              <Card.Group itemsPerRow={8} stackable>
                {category &&
                  category.map(job => (
                    <JobCard key={job.key} job={job} follow={true} />
                  ))}
              </Card.Group>
            </Segment>
            <Segment>
              <Header dividing content="More Jobs" />
              <Card.Group itemsPerRow={8} stackable>
                {category &&
                  category.map(job => (
                    <JobCard key={job.key} job={job} follow={false} />
                  ))}
              </Card.Group>
            </Segment>
          </Grid.Column>
        </Grid.Row> */}
      </Grid>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(JobDashboard));
