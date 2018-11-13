import React, { Component } from "react";
import { Header, Segment, Comment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import distanceInWords from "date-fns/distance_in_words";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  withFirestore,
  firebaseConnect,
  isEmpty,
  isLoaded
} from "react-redux-firebase";
import { addDirectMessage } from "../../userActions";
import { objectToArray } from "../../../../app/common/util/helpers";
import MessageForm from "./MessageForm";
import MessageNavBar from './MessageNavBar'

const actions = {
  addDirectMessage
};

const mapState = (state, ownProps) => {
  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    firstId:
      !isEmpty(ownProps.selectedMessage.id) &&
      isLoaded(ownProps.selectedMessage.id) &&
      state.firebase.auth.uid < ownProps.selectedMessage.id
        ? state.firebase.auth.uid
        : ownProps.selectedMessage.id,
    secondId:
      !isEmpty(ownProps.selectedMessage) &&
      isLoaded(ownProps.selectedMessage) &&
      state.firebase.auth.uid < ownProps.selectedMessage.id
        ? ownProps.selectedMessage.id
        : state.firebase.auth.uid,
    directMessages:
      !isEmpty(ownProps.selectedMessage) &&
      isLoaded(ownProps.selectedMessage) &&
      state.firebase.auth.uid < ownProps.selectedMessage.id
        ? !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${state.firebase.auth.uid}_${ownProps.selectedMessage.id}`
            ]
          )
        : !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${ownProps.selectedMessage.id}_${state.firebase.auth.uid}`
            ]
          )
  };
};

class MessageDetail extends Component {
  render() {
    const { selectedMessage, addDirectMessage, directMessages } = this.props;
    return (
      <div>
        <MessageNavBar selectedMessage={selectedMessage}/>

        <Segment attached>
          <Comment.Group>
            {directMessages &&
              directMessages.map(comment => (
                <Comment key={comment.id}>
                  <Comment.Avatar
                    src={comment.photoURL || "/assets/user.png"}
                  />
                  <Comment.Content>
                    <Comment.Author as={Link} to={`/profile/${comment.uid}`}>
                      {comment.displayName}
                    </Comment.Author>
                    <Comment.Metadata>
                      <div>{distanceInWords(comment.date, Date.now())} ago</div>
                    </Comment.Metadata>
                    <Comment.Text>{comment.text}</Comment.Text>
                  </Comment.Content>
                </Comment>
              ))}
          </Comment.Group>

          <MessageForm
            addDirectMessage={addDirectMessage}
            receiverId={!isEmpty(selectedMessage) && selectedMessage.id}
            form={"newComment"}
          />
        </Segment>
      </div>
    );
  }
}

export default compose(
  withFirestore,
  connect(
    mapState,
    actions
  ),
  firebaseConnect(props => [
    `direct_messages/${props.firstId}_${props.secondId}`
  ])
)(MessageDetail);
