import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import MessageList from "./MessageList/MessageList";
import MessageDetail from "./MessageDetail/MessageDetail";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { compose } from "redux";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { getLastMessage } from "../userActions";

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "messaging" }],
      storeAs: "messaging"
    },
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "last_message" }],
      storeAs: "lastmessage"
    }
  ];
};

const actions = {
  getLastMessage
};
const mapState = state => ({
  auth: state.firebase.auth,
  messaging: state.firestore.ordered.messaging,
  loading: state.async.loading
});

class MessageDashboard extends Component {
  state = {
    selectedMessage: {},
    contextRef: {}
  };

  selectMessage = selectedMessage => {
    this.setState({ selectedMessage: selectedMessage });
  };

  async componentDidMount() {
    let lastMessage = await this.props.getLastMessage(this.props.auth.uid);
    if (lastMessage) {
      this.setState({ selectedMessage: lastMessage });
    }
  }

  handleContextRef = contextRef =>
  this.setState({
    contextRef
  });

  render() {
    const { loading, messaging, auth, lastmessage } = this.props;
    const { selectedMessage } = this.state;
     if (!isLoaded(messaging) || isEmpty(messaging) ||!isLoaded(selectedMessage) || isEmpty(selectedMessage))
       return <LoadingComponent inverted={true} />;

    return (
      <Grid>
        <Grid.Column width={4}>
          <div ref={this.handleContextRef}>
            <MessageList
              selectedMessage={selectedMessage}
              selectMessage={this.selectMessage}
              messaging={messaging}
              loading={loading}
              contextRef={this.state.contextRef}
            />
          </div>
        </Grid.Column>
        <Grid.Column width={12}>
        <div ref={this.handleContextRef}>
           <MessageDetail  selectedMessage={selectedMessage} />
           </div>
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  connect(
    mapState,
    actions
  ),
  firestoreConnect(props => query(props))
)(MessageDashboard);
