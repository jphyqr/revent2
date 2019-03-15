import React, { Component } from "react";
import { Menu, Dropdown, Feed, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import NotificationList from "./NotificationList";
import { firestoreConnect } from "react-redux-firebase";

const query = ({ auth }) => {
  if (auth !== null){
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "notifications"}],

      orderBy: ["timestamp", "desc"],
      limit: 5,
      storeAs: "notifications"
    }
  ];
}};

const mapState = state => {
  return {
    auth: state.firebase.auth,
    loading: state.async.loading,
    notifications: state.firestore.ordered.notifications
  };
};

class NotificationsMenuItem extends Component {
  render() {
    const { loading, notifications, auth } = this.props;
    return (
     
      <Menu.Item position="right">
        <Dropdown icon="bell" pointing="top left">
          <Dropdown.Menu>
            <NotificationList notifications={notifications} loading={loading} />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>

    );
  }
}

export default connect(
  mapState,
  null
)(firestoreConnect(props => query(props))(NotificationsMenuItem));


