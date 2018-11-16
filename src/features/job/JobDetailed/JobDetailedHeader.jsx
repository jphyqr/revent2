import React from "react";
import { Segment, Image, Item, Header, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

const jobImageStyle = {
  filter: "brightness(30%)"
};

const jobImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white"
};

const JobDetailedHeader = ({ loading, job, isHost, isGoing, goingToJob, cancelGoingToJob }) => {
  let jobDate;
  if (job.date) {
    jobDate = job.date.toDate();
  }
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        <Image
          src={`/assets/categoryImages/${job.category}.jpg`}
          fluid
          style={jobImageStyle}
        />

        <Segment basic style={jobImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={job.title}
                  style={{ color: "white" }}
                />
                <p>{format(jobDate, "dddd Do MMMM")}</p>
                <p>
                  Hosted by <strong>{job.hostedBy}</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached="bottom">
        {!isHost && (
          <div>
            {isGoing ? (
              <Button onClick={() => cancelGoingToJob(job)}>Cancel My Place</Button>
            ) : (
              <Button loading={loading} onClick={() => goingToJob(job)} color="teal">JOIN THIS EVENT</Button>
            )}
          </div>
        )}
        {isHost && (
          <Button
            as={Link}
            to={`/managejob/${job.id}`}
            color="orange"
          >
            Manage Job
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default JobDetailedHeader;
