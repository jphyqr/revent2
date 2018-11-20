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

const JobDetailedHeader = ({ loading, job, isHost, hasBid, bidJob, cancelBidForJob }) => {
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
                  Hosted by <strong>{job.owneredBy}</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>

      <Segment attached="bottom">
        {!isHost && (
          <div>
            {hasBid ? (
              <Button onClick={() => cancelBidForJob(job)}>Cancel My Place</Button>
            ) : (
              <Button loading={loading} onClick={() => bidJob(job)} color="teal">BID THIS JOB</Button>
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
