import React, { Component } from "react";
import { Segment, Header, Button, Grid } from "semantic-ui-react";
class MessageNavBar extends Component {
  render() {
    const { selectedMessage } = this.props;
    return (
      <Segment
        secondary
        textAlign="left"
        attached="top"
        style={{ border: "none" }}
      >
        <Grid>
          <Grid.Column width={8}>
            <Header as="h2">
              {selectedMessage.displayName}
              <Header.Subheader>
                {selectedMessage.company || "No company"}
              </Header.Subheader>
            </Header>
          </Grid.Column>
          <Grid.Column width={8}>
            <Button content="View Contract" disabled primary floated="right"/>
            <Button content="View Proposal" disabled primary floated="right"/>
            <Button content="Hire" primary disabled floated="right"/>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default MessageNavBar;
