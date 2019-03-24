import React, { Component } from "react";
import { Menu, Dropdown, Feed, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import MessagingList from "./MessagesList";
import { firestoreConnect } from "react-redux-firebase";
import { getLastMessage } from "../../../user/userActions";

const query = ({ auth }) => {
  if (auth !== null){
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
  }
};


  const actions = {
    getLastMessage
  };
  const mapState = state => ({
    auth: state.firebase.auth,
    messaging: state.firestore.ordered.messaging,
    loading: state.async.loading
  });

class MessagesMenuItem extends Component {


    state = {
        contextRef: {}
      };
    
      handleContextRef = contextRef =>
        this.setState({
          contextRef
        });


  render() {
    const { loading, messaging, auth } = this.props;
    return (
    
      <Menu.Item>
        <div ref={this.handleContextRef}>
        <Dropdown icon="mail" pointing="top left">
          <Dropdown.Menu>
             <MessagingList messaging={messaging} loading={loading}  contextRef={this.state.contextRef}/> 
          </Dropdown.Menu>
        </Dropdown>
        </div>
      </Menu.Item>
  
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(MessagesMenuItem));