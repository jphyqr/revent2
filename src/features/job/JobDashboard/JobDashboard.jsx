import React, { Component } from "react";
import { Segment, Header, Grid, Card, Loader } from "semantic-ui-react";
import JobCard from "./JobCard";
import { connect } from "react-redux";
import sampleData from "../../../app/data/sampleData";
import JobMap from "./JobMap";
import JobList from "../JobList/JobList";
import JobActivity from "../JobActivity/JobActivity";
import { getJobsForDashboard } from "../jobActions";
import { firestoreConnect } from "react-redux-firebase"; //even though we using firestore this gives our binding
import LoadingComponent from "../../../app/layout/LoadingComponent";
const category = [
  { key: "snowremoval", text: "Snow Removal", value: "snowremoval" },
  { key: "carpentry", text: "Carpentry", value: "carpentry" },
  { key: "plumbing", text: "Plumbing", value: "plumbing" }
];

const query = [
  {
    collection: "activity",
    orderBy: ["timestamp", "desc"],
    limit: 5
  }
];


const mapState = state => ({
  jobs: state.jobs,
  loading: state.async.loading,
  activities: state.firestore.ordered.activity
});

const actions = {
  getJobsForDashboard
};

class JobDashboard extends Component {

  state = {
    moreJobs: false,
    loadingInitial: true,
    loadedJobs: [],
    contextRef: {}
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

  handleContextRef = contextRef =>
    this.setState({
      contextRef
    });

  render() {
    const { loading, activities , jobs} = this.props;
    const { moreJobs, loadedJobs } = this.state;
    if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;

    return (
      <Grid>
        <Grid.Row>
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
        </Grid.Row>
        <Grid.Row>
          <JobMap jobs={jobs} lat={50.44} lng={-104.61} />
        </Grid.Row>
<Grid.Row>
        <Grid.Column width={10}>
  <div ref={this.handleContextRef}>
    <JobList
      jobs={loadedJobs}
      loading={loading}
      moreJobs={moreJobs}
      getNextJobs={this.getNextJobs}
    />
  </div>
</Grid.Column>
<Grid.Column width={6}>
  <JobActivity
    activities={activities}
    contextRef={this.state.contextRef}
  />
</Grid.Column>
<Grid.Column width={10}>
  <Loader active={loading} />
</Grid.Column>
</Grid.Row>
      </Grid>




    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(query)(JobDashboard));