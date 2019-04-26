import React, { Component } from "react";
import {
  Segment,
  Button,
  Label,
  Comment,
  Container,
  Form,
  Input,
  Icon,
  Grid,
  Image,
  TextArea
} from "semantic-ui-react";
import { closeMessage } from "../popupActions";
import { connect } from "react-redux";
import PopupNavBar from "./PopupNavBar";
import distanceInWords from "date-fns/distance_in_words";
import {
  addDirectMessage,
  messageUser
} from "../../../features/user/userActions";
import { Link } from "react-router-dom";
import { compose } from "redux";

import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import { objectToArray } from "../../../app/common/util/helpers";

const actions = {
  closeMessage,
  addDirectMessage,
  messageUser
};

const mapState = (state, ownProps) => {
  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    firstId:
      !isEmpty(ownProps.message.id) &&
      isLoaded(ownProps.message.id) &&
      state.firebase.auth.uid < ownProps.message.id
        ? state.firebase.auth.uid
        : ownProps.message.id,
    secondId:
      !isEmpty(ownProps.message) &&
      isLoaded(ownProps.message) &&
      state.firebase.auth.uid < ownProps.message.id
        ? ownProps.message.id
        : state.firebase.auth.uid,
    directMessages:
      !isEmpty(ownProps.message) &&
      isLoaded(ownProps.message) &&
      state.firebase.auth.uid < ownProps.message.id
        ? !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${state.firebase.auth.uid}_${ownProps.message.id}`
            ]
          )
        : !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${ownProps.message.id}_${state.firebase.auth.uid}`
            ]
          )
  };
};

class PopupContainer extends Component {
  state = {
    text: ""
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.handleSubmit();
    }
  };

  handleSubmit = async () => {
    console.log(this.state.text);
    const { message, messageUser, addDirectMessage } = this.props;
    const values = { comment: this.state.text };
    addDirectMessage(message.id, values);
    messageUser(message);
    this.setState({ text: "" });
  };

  handleChange = event => {
    this.setState({ text: event.target.value });
  };

  render() {
    const {
      width,
      height,
      right,
      message,
      bottom,
      closeMessage,
      directMessages,
      auth
    } = this.props;
    return (
      <div>
        {true ? (
          <div
            name="root"
            style={{
              position: "fixed",
              width: width,
              height: height + 25,
              right: right,
              bottom: bottom,
              zIndex: 1000,
              maxWidth: width
            }}
          >
            <div
              name="relativewrapper"
              style={{ position: "relative", height: "100%", width: "100%" }}
            >
              <div name="navbar" style={{ width: "100%" ,  right:right}}>
                <PopupNavBar
                  width={width}
                  message={message}
                  closeMessage={closeMessage}
                />
              </div>

              <div
                name="chat"
                style={{
                  padding: 10,
                  width: "100%",
                  backgroundColor: "white",
                  height: 256,
                  overflowX: "hidden",
                  overflowY: "auto"
                }}
              >
                {directMessages &&
                  directMessages.map(comment => (
                    <div key={comment.id}>
                      {comment.uid == auth.uid ? (
                        <Grid verticalAlign="bottom">
                          <Grid.Row
                            verticalAlign="bottom"
                            style={{
                              padding: "3px",
                              marginBottom: "0px",
                              marginTop: "0px"
                            }}
                          >
                            <Grid.Column
                              style={{ marginBottom: "0px", marginTop: "0px" }}
                              textAlign="center"
                            >
                              <p style={{ color: "grey" }}>
                                {" "}
                                {distanceInWords(
                                  comment.date,
                                  Date.now()
                                )} ago{" "}
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row
                            style={{
                              padding: "0px",
                              marginTop: "0px",
                              marginBottom: "30px"
                            }}
                          >
                            <Grid.Column width={2} />
                            <Grid.Column width={14} textAlign="right">
                              <Label
                                style={{
                                  fontSize: 14,
                                  borderRadius: 15,
                                  padding: "8px",
                                  maxWidth: 200,
                                  wordWrap: "break-word",
                                  marginTop: "0px"
                                }}
                                color="blue"
                              >
                                {comment.text}
                              </Label>
                            </Grid.Column>
                          </Grid.Row>
                        </Grid>
                      ) : (
                        <Grid>
                          <Grid.Row
                            style={{
                              padding: "3px",
                              marginBottom: "0px",
                              marginTop: "0px"
                            }}
                          >
                            <Grid.Column
                              style={{ marginBottom: "0px", marginTop: "0px" }}
                              textAlign="center"
                            >
                              <p style={{ color: "grey" }}>
                                {" "}
                                {distanceInWords(comment.date, Date.now())} ago
                              </p>
                            </Grid.Column>
                          </Grid.Row>
                          <Grid.Row
                            style={{
                              padding: "0px",
                              marginTop: "0px",
                              marginBottom: "30px"
                            }}
                          >
                            <Grid.Column width={3}>
                              <Image
                                inline
                                avatar
                                circular
                                size="small"
                                src={comment.photoURL || "/assets/user.png"}
                              />
                            </Grid.Column>
                            <Grid.Column width={10} textAlign="left">
                              <Label
                                style={{
                                  fontSize: 14,
                                  borderRadius: 15,
                                  padding: "8px",
                                  maxWidth: 200,
                                  wordWrap: "break-word",
                                  marginTop: "0px"
                                }}
                              >
                                {comment.text}
                              </Label>
                            </Grid.Column>
                            <Grid.Column width={3} />
                          </Grid.Row>
                        </Grid>
                      )}

                      {/* <Image inline avatar circular size="mini"
                    src={comment.photoURL || "/assets/user.png"}
                  />  */}
                    </div>
                  ))}
              </div>

              <div
                name="form"
                style={{
                  padding: 0,
                  width: width,
                  right: right,
                  position: "fixed",
                  zIndex: 1000,
                  borderStyle: "none",
                  bottom: bottom + 25,

                  height: 60
                }}
              >
                <div
                  name="textarea"
                  style={{
                    padding: 0,
                    margin: 0,
                    width: width,
                    right: right,
                    position: "fixed",
                    zIndex: 1000,
                    borderStyle: "none",
                    height: 60,
                    bottom: bottom + 20
                  }}
                >
                  <TextArea
                    style={{
                      width: width,
                      padding: "0px",
                      topMargin: 0,
                      borderOpacity: 0,
                      position: "fixed",
                      height: 60,
                      right: right,
                      backgroundColor: "lightgrey",
                      borderStyle: "none"
                    }}
                    onChange={this.handleChange}
                    value={this.state.text}
                    onKeyPress={this.handleKeyPress}
                    autoHeight
                    placeholder="Type a message..."
                  />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  width: width,
                  position: "fixed",
                  right: right,
                 
                  zIndex: 1000,
                  bottom: 0,
                  height: 33
                }}
              >
                <Icon
                  disabled={!this.state.text.length > 0}
                  style={{
                    bottom: bottom + 5,
                    position: "fixed",
                    right: right + 5,
                   
                  }}
                  onClick={this.handleSubmit}
                  size="large"
                  name="send"
                />
              </div>
            </div>
          </div>
        ) : (
          <Segment
            style={{
              padding: 0,
              margin: 0,
              width: width,
              height: height + 25,
              right: right,
              position: "fixed",
              bottom: bottom,
              zIndex: 1000,
              maxWidth: width
            }}
          >
            <Segment
              style={{ width: width, padding: 0, margin: 0 }}
              attached="top"
            >
              <PopupNavBar
                width={width}
                message={message}
                closeMessage={closeMessage}
              />
            </Segment>

            <Segment
              attached
              style={{
                overflow: "auto",
                maxHeight: 250,
                minHeight: 250 + 25,
                width: width,
                bottomMargin: 0
              }}
            >
              {directMessages &&
                directMessages.map(comment => (
                  <div key={comment.id}>
                    {comment.uid == auth.uid ? (
                      <Grid verticalAlign="bottom">
                        <Grid.Row
                          verticalAlign="bottom"
                          style={{
                            padding: "3px",
                            marginBottom: "0px",
                            marginTop: "0px"
                          }}
                        >
                          <Grid.Column
                            style={{ marginBottom: "0px", marginTop: "0px" }}
                            textAlign="center"
                          >
                            <p style={{ color: "grey" }}>
                              {" "}
                              {distanceInWords(
                                comment.date,
                                Date.now()
                              )} ago{" "}
                            </p>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row
                          style={{
                            padding: "0px",
                            marginTop: "0px",
                            marginBottom: "30px"
                          }}
                        >
                          <Grid.Column width={2} />
                          <Grid.Column width={14} textAlign="right">
                            <Label
                              style={{
                                fontSize: 14,
                                borderRadius: 15,
                                padding: "8px",
                                maxWidth: 200,
                                wordWrap: "break-word",
                                marginTop: "0px"
                              }}
                              color="blue"
                            >
                              {comment.text}
                            </Label>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    ) : (
                      <Grid>
                        <Grid.Row
                          style={{
                            padding: "3px",
                            marginBottom: "0px",
                            marginTop: "0px"
                          }}
                        >
                          <Grid.Column
                            style={{ marginBottom: "0px", marginTop: "0px" }}
                            textAlign="center"
                          >
                            <p style={{ color: "grey" }}>
                              {" "}
                              {distanceInWords(comment.date, Date.now())} ago
                            </p>
                          </Grid.Column>
                        </Grid.Row>
                        <Grid.Row
                          style={{
                            padding: "0px",
                            marginTop: "0px",
                            marginBottom: "30px"
                          }}
                        >
                          <Grid.Column width={3}>
                            <Image
                              inline
                              avatar
                              circular
                              size="small"
                              src={comment.photoURL || "/assets/user.png"}
                            />
                          </Grid.Column>
                          <Grid.Column width={10} textAlign="left">
                            <Label
                              style={{
                                fontSize: 14,
                                borderRadius: 15,
                                padding: "8px",
                                maxWidth: 200,
                                wordWrap: "break-word",
                                marginTop: "0px"
                              }}
                            >
                              {comment.text}
                            </Label>
                          </Grid.Column>
                          <Grid.Column width={3} />
                        </Grid.Row>
                      </Grid>
                    )}

                    {/* <Image inline avatar circular size="mini"
                    src={comment.photoURL || "/assets/user.png"}
                  />  */}
                  </div>
                ))}

              <div ref={`thing`} />
            </Segment>
            <Container
              style={{
                padding: 0,
                width: width,
                right: right,
                position: "fixed",
                zIndex: 1000,
                borderStyle: "none",
                bottom: bottom + 25
              }}
            >
              <TextArea
                style={{
                  width: width,
                  padding: "0px",
                  topMargin: 0,
                  borderOpacity: 0
                }}
                onChange={this.handleChange}
                value={this.state.text}
                onKeyPress={this.handleKeyPress}
                autoHeight
                placeholder="Type a message..."
              />
            </Container>
            <Container
              style={{
                padding: 0,
                width: width,
                right: right,
                position: "fixed",
                zIndex: 1000,
                bottom: bottom
              }}
            >
              <Icon
                disabled={!this.state.text.length > 0}
                style={{ bottom: bottom }}
                onClick={this.handleSubmit}
                size="large"
                name="send"
              />
            </Container>
          </Segment>
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
)(PopupContainer);
