import React, { Component } from "react";
import { connect } from "react-redux";
import firebase from '../../app/config/firebase'
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  firebaseStateReducer
} from "react-redux-firebase";
import { compose } from "redux";
import LoadingComponent from "../../app/layout/LoadingComponent";

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

const mapState = state => ({
  auth: state.firebase.auth
});

class NewMessageDashboard extends Component {
  componentDidMount() {
    firebase.set(`/direct_messages/`);
  }

  render() {
    const { firebase } = this.props;

    return <h1> dashboard</h1>;
  }
}

export default (NewMessageDashboard);
