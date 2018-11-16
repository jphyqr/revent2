import React, { Component } from 'react';
import { Segment, Grid, Icon, Button } from 'semantic-ui-react';
import JobDetailedMap from './JobDetailedMap'
import format from 'date-fns/format'

class JobDetailedInfo extends Component {
  state = {
    showMap: false
  }

  componentWillUnmount() {
    this.setState({
      showMap: false
    })
  }

  showMapToggle = () => {
    this.setState(prevState => ({
      showMap: !prevState.showMap
    }))
  }

  render() {
    const { job } = this.props;
    let jobDate;
    if(job.date){
      jobDate = job.date.toDate()
    }
    return (
      <Segment.Group>
        <Segment attached="top">
          <Grid>
            <Grid.Column width={1}>
              <Icon size="large" color="teal" name="info" />
            </Grid.Column>
            <Grid.Column width={15}>
              <p>{job.description}</p>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="calendar" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={15}>
              <span>{format(jobDate, 'dddd Do MMM')} at {format(jobDate, 'h:mm A')}</span>
            </Grid.Column>
          </Grid>
        </Segment>
        <Segment attached>
          <Grid verticalAlign="middle">
            <Grid.Column width={1}>
              <Icon name="marker" size="large" color="teal" />
            </Grid.Column>
            <Grid.Column width={11}>
              <span>{job.venue}</span>
            </Grid.Column>
            <Grid.Column width={4}>
              <Button onClick={this.showMapToggle} color="teal" size="tiny" content={this.state.showMap ? 'Hide Map' : 'Show Map'}/>
            </Grid.Column>
          </Grid>
        </Segment>
        {this.state.showMap &&
        <JobDetailedMap lat={job.venueLatLng.lat} lng={job.venueLatLng.lng}/>}
      </Segment.Group>
    );
  }
}

export default JobDetailedInfo;
