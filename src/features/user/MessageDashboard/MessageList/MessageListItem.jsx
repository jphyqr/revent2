import React, { Component } from "react";
import { Segment, Item, Label } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { selectLastMessage } from "../../../user/userActions";

const actions = {
  selectLastMessage
};
class MessageListItem extends Component {
  handleClick(selectMessage, selectLastMessage, message) {
    selectLastMessage(message);
    selectMessage(message);
   
  }

  render() {
    const { message, selectMessage, selectLastMessage } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Item.Group>
            <Item
              onClick={() =>
                this.handleClick(selectMessage, selectLastMessage, message)
              }
            >
              <Item.Image size="mini" square src={message.photoURL} />
              <Item.Content>
                <Item.Header as={Link} to={`/message/${message.id}`}>
                  {message.displayName}
                </Item.Header>
                <Item.Description>
                  <Link to={`/profile/${message.hostUid}`}>
                    {message.company || "No company"}
                  </Link>
                </Item.Description>
                {message.newMessage&&<Label color='green' floating>  1 </Label>}
        
   
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment.Group>
    );
  }
}

export default connect(
  null,
  actions
)(MessageListItem);
