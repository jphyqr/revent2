import React, { Component } from "react";
import { Segment, Item, Icon, List, Button , Label} from "semantic-ui-react";
import { Link } from "react-router-dom";
import format from "date-fns/format";
//import JobListAttendee from "./JobListAttendee";
import {objectToArray} from '../../../app/common/util/helpers'

class JobListItem extends Component {
  render() {
    const { job } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={job.hostPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/job/${job.id}`}>{job.title}</Item.Header>
                <Item.Description>
                  Hosted by <Link to={`/profile/${job.hostUid}`}>{job.hostedBy}</Link>
                </Item.Description>
                {job.cancelled&&
                <Label style={{top: '-40px'}} ribbon='right' color='red' content='This job has been cancelled'/>}
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <Segment>
          <span>
            <Icon name="clock" /> {format(job.date.toDate(), "dddd Do MMMM")} at{" "}
            {format(job.date.toDate(), "HH:mm")}
            |
            <Icon name="marker" /> {job.venue}
          </span>
        </Segment>
        <Segment secondary>
          {/* <List horizontal>
            {job.attendees &&
              objectToArray(job.attendees).map((attendee) => (
                <JobListAttendee key={attendee.id} attendee={attendee} />
              ))}
          </List> */}
        </Segment>
        <Segment clearing>
          <span>{job.description}</span>

          <Button
            as={Link}
            to={`/job/${job.id}`}
            color="teal"
            floated="right"
            content="View"
          />
        </Segment>
      </Segment.Group>
    );
  }
}

export default JobListItem;
