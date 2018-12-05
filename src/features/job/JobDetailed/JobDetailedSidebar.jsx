import React, { Component } from "react";
import { Segment, List, Item, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { objectToArray } from "../../../app/common/util/helpers";
import { openModal } from "../../modals/modalActions";
import { connect } from "react-redux";

const actions = {
  openModal
};

class JobDetailedSidebar extends Component {
  render() {
    const { job, openModal } = this.props;
    const bids = job && job.bids && objectToArray(job.bids);

    return (
      <div>
        <Segment
          textAlign="center"
          style={{ border: "none" }}
          attached="top"
          secondary
          inverted
          color="orange"
        >
          Host
        </Segment>

        <Segment
          textAlign="center"
          style={{ border: "none" }}
          attached="top"
          secondary
          inverted
          color="teal" 
        >
          {bids && bids.length}{" "}
          {bids && bids.length === 1 ? "Person" : "People"} Bid
        </Segment>
        <Segment attached> 
          <List relaxed divided>
            {bids &&
              bids.map(bid => (
                <Item key={bid.id} style={{ position: "relative" }}>
                  <Item.Image size="tiny" src={bid.photoURL} />
                  <Item.Content verticalAlign="middle">
                    <Item.Header as="h3">
                      <Link to={`/profile/${bid.id}`}>{bid.displayName}</Link>
                    </Item.Header>
                    <Button
                      onClick={() => openModal("PaymentModal", { data: bid })}
                      primary
                      content="Hire Now"
                    />
                    <Button secondary content="Reject bid" />
                  </Item.Content>
                </Item>
              ))}
          </List>
        </Segment>
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(JobDetailedSidebar);
