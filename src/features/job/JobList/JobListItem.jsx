import React, { Component } from "react";
import { Segment, Item, Icon,  Button , Label} from "semantic-ui-react";
import { Link } from "react-router-dom";
import format from "date-fns/format";
import scrollToComponent from "react-scroll-to-component";
class JobListItem extends Component {

 state={
   scrollToId:""
 }

  componentWillReceiveProps (newProps) {
    const {scrollToId:oldId} = this.state
    const {scrollToId:newId} = newProps
     if(newId!==oldId){
    
      // scrollToComponent(this.refs[newId], {
      //   offset: 0,
      //   align: "top",
      //   duration: 600
      // });
      //var element = this.refs[newId].findDOMNode()// document.getElementsByName(newId)
      //element.scrollIntoView();
      //console.log({element})
     }
     this.setState({scrollToId:newId})
    
    
    }


  render() {
    const { job } = this.props;
    const jobId = job.id

    return (

    <div ref={jobId} name={jobId}>
      <Segment.Group   >
        <Segment>
          <Item.Group>
            <Item>
              <Item.Image size="tiny" circular src={job.ownerPhotoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/job/${job.id}`}>{job.title}</Item.Header>
                <Item.Description>
                  Hosted by <Link to={`/profile/${job.ownerUid}`}>{job.owneredBy}</Link>
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
      </div>
    );
  }
}

export default JobListItem;
