import React, { Component } from "react";
import {Grid, Sticky, Segment } from "semantic-ui-react";
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { connect } from "react-redux";
import JobMap from "./JobMap";
import JobList from "../JobList/JobList";
import { getJobsForDashboard } from "../jobActions";
import { firestoreConnect } from "react-redux-firebase"; //even though we using firestore this gives our binding

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
    const { loading} = this.props;
    const { moreJobs, loadedJobs } = this.state;
 //   if (this.state.loadingInitial) return <LoadingComponent inverted={true} />;

    return (
      <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>
        <Segment>
          My Jobs
        </Segment>
                  </Grid.Column>
        <Grid.Column width={10}>
        
          <JobMap jobs={loadedJobs} lat={50.44} lng={-104.61} />
         
          </Grid.Column>
          <Grid.Column width={3}>
          <div ref={this.handleContextRef}>
    <JobList
      offset={100}
      jobs={loadedJobs}
      loading={loading}
      moreJobs={moreJobs}       
      getNextJobs={this.getNextJobs}
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
)(firestoreConnect(query)(JobDashboard));