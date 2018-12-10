import React, { Component } from "react";
import { Button, Label, Segment , Container} from "semantic-ui-react";
import { connect } from "react-redux";

import { Elements, StripeProvider } from "react-stripe-elements";
// import GoogleMapReact from 'google-map-react';
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { incrementAsync, decrementAsync } from "./testActions";
import { openModal } from "../modals/modalActions";
import   TestPopup1 from "./TestPopup1";
import   TestPopup2 from "./TestPopup2";
import   TestPopup3 from "./TestPopup3";
import   TestPopup4 from "./TestPopup4";
import   TestPopup5 from "./TestPopup5";
import distanceInWords from "date-fns/distance_in_words";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import { objectToArray } from "../../app/common/util/helpers";

const message= {id:"pVBFKV5Sp2giwswxvj7mpsJa4Bj1",
city:"uknown",
displayName: "arron",
newMessage: false,
photoURL: "/assets/user.png"


}
const mapState = (state, ownProps) => {
  return {
   
    loading: state.async.loading,
    auth: state.firebase.auth,
    firstId:
      !isEmpty(message.id) &&
      isLoaded(message.id) &&
      state.firebase.auth.uid < message.id
        ? state.firebase.auth.uid
        : message.id,
    secondId:
      !isEmpty(message) &&
      isLoaded(message) &&
      state.firebase.auth.uid < message.id
        ? message.id
        : state.firebase.auth.uid,
    directMessages:
      !isEmpty(message) &&
      isLoaded(message) &&
      state.firebase.auth.uid < message.id
        ? !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${state.firebase.auth.uid}_${message.id}`
            ]
          )
        : !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${message.id}_${state.firebase.auth.uid}`
            ]
          )
  };
};

const actions = {
  incrementAsync,
  decrementAsync,
  openModal
};
const RIGHT = 0;
const BOTTOM = 0;
const BORDER = 10;
const WIDTH = 300;
const HEIGHT = 400;

class TestComponent extends Component {

  state = {
    show1:false,
    show2:false,
    show3:false,
    show4: false,
    show5: false
  }
  handleClick1 = () => {
    this.setState({show1: !this.state.show1})
  };

  handleClick2 = () => {
    this.setState({show2: !this.state.show2})
  };
  handleClick3 = () => {
    this.setState({show3: !this.state.show3})
  };
  handleClick4 = () => {
    this.setState({show4: !this.state.show4})
  };
  handleClick5 = () => {
    this.setState({show5: !this.state.show5})
  };

  render() {
    const {show1,show2, show3, show4, show5} = this.state
    const {directMessages, auth} = this.props
    return (
      <div>


        {show1?<p>show1 true</p> : <p>show1 false</p>}
        <Button onClick={this.handleClick1}>Launch</Button>
        {show1 && (
          <TestPopup1
          width={WIDTH}
          height={HEIGHT}
          bottom={BOTTOM}
          right={RIGHT}
          message={message}
          directMessages={directMessages}
          auth={auth}
          ></TestPopup1>
        )}


                {show2?<p>show2 true</p> : <p>show2 false</p>}
        <Button onClick={this.handleClick2}>Launch 2</Button>
        {show2 && (
          <TestPopup2
          width={WIDTH}
          height={HEIGHT}
          bottom={BOTTOM}
          right={RIGHT+WIDTH + BORDER}
          message={message}
          directMessages={directMessages}
          auth={auth}
          ></TestPopup2>
        )}


        
        {show3?<p>show3 true</p> : <p>show3 false</p>}
        <Button onClick={this.handleClick3}>Launch 3</Button>
        {show3 && (
          <TestPopup3
          width={WIDTH}
          height={HEIGHT}
          bottom={BOTTOM+100}
          right={RIGHT+WIDTH + BORDER+WIDTH + BORDER}
          message={message}
          directMessages={directMessages}
          auth={auth}
          ></TestPopup3>
        )}


        
        {show4?<p>show4 true</p> : <p>show4 false</p>}
        <Button onClick={this.handleClick4}>Launch 4</Button>
        {show4 && (
          <TestPopup4
          width={WIDTH}
          height={HEIGHT}
          bottom={BOTTOM}
          right={RIGHT+WIDTH + BORDER+WIDTH + BORDER+WIDTH + BORDER}
          message={message}
          directMessages={directMessages}
          auth={auth}
          ></TestPopup4>
        )}


        
        {show5?<p>show5 true</p> : <p>show5 false</p>}
        <Button onClick={this.handleClick5}>Launch 5</Button>
        {show5 && (
          <TestPopup5
          width={WIDTH}
          height={HEIGHT}
          bottom={BOTTOM}
          right={RIGHT+WIDTH + BORDER+WIDTH + BORDER+WIDTH + BORDER+WIDTH + BORDER}
          message={message}
          directMessages={directMessages}
          auth={auth}
          ></TestPopup5>
        )}
      </div>
    );
  }
}


export default compose(
  connect(
    mapState,
    actions
  ),
  firebaseConnect(props => [
    `direct_messages/${props.firstId}_${props.secondId}`
  ])
)(TestComponent);