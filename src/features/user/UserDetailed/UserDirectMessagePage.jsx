import React, { Component } from "react";
import { Header, Segment, Comment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import distanceInWords from "date-fns/distance_in_words";
import { compose } from "redux";
import { connect } from "react-redux";
import { withFirestore, firebaseConnect, isEmpty } from "react-redux-firebase";
import { addDirectMessage } from "../userActions";
import {
  objectToArray
} from "../../../app/common/util/helpers";
import UserDirectMessageForm from "./UserDirectMessageForm";

const actions = {
  addDirectMessage
};

const mapState = (state, ownProps) => {
  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    firstId:
      state.firebase.auth.uid < ownProps.match.params.id
        ? state.firebase.auth.uid
        : ownProps.match.params.id,
    secondId:
      state.firebase.auth.uid < ownProps.match.params.id
        ? ownProps.match.params.id
        : state.firebase.auth.uid,
    directMessages:
      state.firebase.auth.uid < ownProps.match.params.id
        ? !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${state.firebase.auth.uid}_${ownProps.match.params.id}`
            ]
          )
        : !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${ownProps.match.params.id}_${state.firebase.auth.uid}`
            ]
          )
  };
};

class UserDirectMessagePage extends Component {
  render() {
    const { match, addDirectMessage, directMessages } = this.props;
    //  const chatTree = !isEmpty(eventChat) && createDataTree(eventChat)
    return (
      <div>
        <Segment
          textAlign="center"
          attached="top"
          inverted
          color="teal"
          style={{ border: "none" }}
        >
          <Header>Chat to each other</Header>
        </Segment>

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

          <UserDirectMessageForm
            addDirectMessage={addDirectMessage}
            receiverId={match.params.id}
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
)(UserDirectMessagePage);
