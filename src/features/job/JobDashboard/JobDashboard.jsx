import React, { Component } from "react";
import { Segment, Header, Grid, Card } from "semantic-ui-react";
import JobCard from "./JobCard";
import sampleData from "../../../app/data/sampleData";
import JobMap from "./JobMap";

const category = [
  { key: "snowremoval", text: "Snow Removal", value: "snowremoval" },
  { key: "carpentry", text: "Carpentry", value: "carpentry" },
  { key: "plumbing", text: "Plumbing", value: "plumbing" }
];

const category2 = [
  { key: "snowremoval", text: "Snow Removal", value: "snowremoval" },
  { key: "carpentry", text: "Carpentry", value: "carpentry" },
  { key: "plumbing", text: "Plumbing", value: "plumbing" }
];

class JobDashboard extends Component {
  render() {
    const jobs = sampleData.jobs;
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
                {category2 &&
                  category2.map(job => (
                    <JobCard key={job.key} job={job} follow={false} />
                  ))}
              </Card.Group>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <JobMap lat={50.44} lng={-104.61} />
        </Grid.Row>
      </Grid>
    );
  }
}

export default JobDashboard;
