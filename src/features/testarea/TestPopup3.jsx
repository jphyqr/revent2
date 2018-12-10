import React, { Component } from "react";
import {
  Segment,
  Container,
  Label,
  Icon,
  Button,
  TextArea,
  Popup,
  Rating,
  Grid,
  Image
} from "semantic-ui-react";
import distanceInWords from "date-fns/distance_in_words";
class TestPopup3 extends Component {
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
    // const { message, messageUser, addDirectMessage } = this.props;
    // const values = { comment: this.state.text };
    // addDirectMessage(message.id, values);
    // messageUser(message);
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
      bottom,
      message,
      directMessages,
      auth
    } = this.props;
    return (
      <div
        style={{
          padding: 0,
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
          style={{
            maxWidth: width,
            marginTop: 0,
            marginBottm: 0,

            bottom: bottom + 63 + 275 + 50 + 17,
            position: "fixed",
            borderStyle: "none",
            padding: 0
          }}
        >
          <Grid style={{ padding: 0, margin: 0 }} container>
            <Grid.Row style={{ padding: 5, margin: 0 }} color="blue">
              <Grid.Column
                style={{ fontSize: 15, padding: 0, margin: 0 }}
                width={6}
              >
                Arron Chuley
              </Grid.Column>
              <Grid.Column style={{ padding: 0, marginBottom: 3 }} width={8}>
                <Label style={{ padding: 3 }}>
                  Contractor
                  <Label.Detail>AC Electric</Label.Detail>
                </Label>
              </Grid.Column>
              <Grid.Column style={{ padding: 0, margin: 0 }} width={1} />
              <Grid.Column style={{ padding: 0, margin: 0 }} width={1}>
                <Icon size="medium" name="close" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment
          style={{
            maxWidth: width,
            marginTop: 0,
            marginBottm: 0,
            bottom: bottom + 63 + 275 + 43,
            position: "fixed",
            padding: 0,
            backgroundColor: `rgb(176,196,222)`,
            borderStyle: "none",
            borderRadius: "0px"
          }}
        >
          <Grid style={{ padding: 0, margin: 0 }} container>
            <Grid.Row style={{ padding: 3, margin: 0, maxHeight: 30 }}>
              <Grid.Column
                style={{ textAlign: "center", padding: 0, margin: 0 }}
                width={4}
              >
                <Popup
                  hoverable
                  hideOnScroll
                  trigger={<Icon color="grey" link name="star" size="large" />}
                  style={{
                    borderRadius: 0,
                    opacity: 0.7,
                    padding: "2em",
                    minWidth: width,
                    maxWidth: width,
                    minHeight: height * 0.75,
                    maxHeight: height * 0.75
                  }}
                  inverted
                >
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={10}>Overall Rating</Grid.Column>
                      <Grid.Column width={6}>
                        <Rating icon="star" defaultRating={5} maxRating={5} />
                      </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                      <Grid.Column width={10}>Verification Level</Grid.Column>
                      <Grid.Column width={1}>
                        <p style={{ color: "green" }}>1</p>
                      </Grid.Column>
                      <Grid.Column width={1}>
                        <p style={{ color: "green" }}>2</p>
                      </Grid.Column>
                      <Grid.Column width={1}>
                        <p style={{ color: "grey" }}>3</p>
                      </Grid.Column>
                    </Grid.Row>

     

                  </Grid>
                </Popup>
              </Grid.Column>
              <Grid.Column
                style={{ textAlign: "center", padding: 0, margin: 0 }}
                width={4}
              >


                <Popup
                  hoverable
                  hideOnScroll
                  trigger={   <Icon color="grey" link name="usd" size="large" />}
                  style={{
                    borderRadius: 0,
                    opacity: 0.7,
                    padding: "2em",
                    minWidth: width,
                    maxWidth: width,
                    minHeight: height * 0.75,
                    maxHeight: height * 0.75
                  }}
                  inverted
                >
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={10}>Total Volume</Grid.Column>
                      <Grid.Column width={6}>
                      <p style={{ color: "green" }}>+10K</p>
                      </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                      <Grid.Column width={10}>Verified Crew Size</Grid.Column>
                      <Grid.Column width={1}>
                        <p style={{ color: "green" }}>4</p>
                      </Grid.Column>
                    </Grid.Row>

     

                  </Grid>
                </Popup>





             
              </Grid.Column>
              <Grid.Column
                style={{ textAlign: "center", padding: 0, margin: 0 }}
                width={4}
              >
                <Popup
                  hoverable
                  hideOnScroll
                  trigger={      <Icon color="grey" link name="checkmark box" size="large" />}
                  style={{
                    borderRadius: 0,
                    opacity: 0.7,
                    padding: "2em",
                    minWidth: width,
                    maxWidth: width,
                    minHeight: height * 0.75,
                    maxHeight: height * 0.75
                  }}
                  inverted
                >
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={10}>Residental Electrical</Grid.Column>
                      <Grid.Column width={6}>
                      <p style={{ color: "green" }}>22</p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={10}>Wall Construction</Grid.Column>
                      <Grid.Column width={1}>
                        <p style={{ color: "green" }}>10</p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={10}>General Contracting</Grid.Column>
                      <Grid.Column width={1}>
                        <p style={{ color: "green" }}>2</p>
                      </Grid.Column>
                    </Grid.Row>

     

                  </Grid>
                </Popup>





             
              </Grid.Column>

              <Grid.Column
                style={{ textAlign: "center", padding: 0, margin: 0 }}
                width={4}
              >
                <Icon color="grey" link name="info circile" size="large" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment
          raised
          style={{
            maxWidth: width,
            marginTop: 0,
            marginBottom: 0,
            bottom: bottom + 63 + 287,
            position: "fixed",
            padding: 0,
            borderRadius: 0,
            borderStyle: "none",
            boxShadow: `0px 6px 7px -1px rgba(143,140,143,1)`,
            // backgroundColor: `rgb(211,211,211)`,
            zIndex: 2000
          }}
        >
          <Grid style={{ padding: 0, margin: 0 }} container>
            <Grid.Column style={{ padding: 3, margin: 0 }} width={2}>
              <Image size="mini" src="/assets/user.png" />
            </Grid.Column>
            <Grid.Column style={{ padding: 3, margin: 0 }} width={3}>
              <Grid.Row
                style={{
                  padding: "0px",
                  marginBottom: "0px",
                  marginTop: "0px"
                }}
              >
                {" "}
                <p style={{ fontSize: 13, color: "green" }}>OPEN</p>
              </Grid.Row>
              <Grid.Row
                style={{
                  padding: "0px",
                  marginBottom: "0px",
                  marginTop: "0px"
                }}
              >
                {" "}
                <p style={{ fontSize: 10, color: "grey" }}>for 3 days</p>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column style={{ padding: 3, margin: 0 }} width={9}>
              <Grid.Row
                style={{
                  padding: "0px",
                  marginBottom: "0px",
                  marginTop: "0px"
                }}
              >
                {" "}
                <p style={{ fontSize: 13 }}>SIDEWALK CLEAR...</p>
              </Grid.Row>
              <Grid.Row
                style={{
                  padding: "0px",
                  marginBottom: "0px",
                  marginTop: "0px"
                }}
              >
                {" "}
                <Button style={{ padding: "3px" }} primary>
                  BID JOB
                </Button>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column style={{ padding: 3, margin: 0 }} width={2}>
              <Grid.Row
                style={{
                  padding: "0px",
                  marginBottom: "0px",
                  marginTop: "0px"
                }}
              >
                {" "}
                <p style={{ fontSize: 20 }}>...</p>
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Segment>

        <Segment
          style={{
            overflow: "auto",
            maxHeight: 250,
            minHeight: 250 + 25,
            maxWidth: width,
            marginTop: 0,
            marginBottm: 0,
            borderRadius: 0,
            borderStyle: "none",
            bottom: bottom + 60.5,
            position: "fixed"
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
                          {distanceInWords(comment.date, Date.now())} ago{" "}
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
        </Segment>
        <Segment
          style={{
            padding: 0,
            width: width,
            right: right,
            position: "fixed",
            zIndex: 1000,
            borderStyle: "none",
            borderRadius: 0,
            bottom: bottom + 22,
            margin: 0
          }}
        >
          <TextArea
            style={{
              width: width,
              padding: "0px",
              topMargin: 0,
              borderOpacity: 0,
              borderStyle: "none"
            }}
            onChange={this.handleChange}
            value={this.state.text}
            onKeyPress={this.handleKeyPress}
            autoHeight
            placeholder="Type a message..."
          />
        </Segment>
        <Segment
          style={{
            padding: 0,
            width: width,
            right: right,
            position: "fixed",
            zIndex: 1000,
            borderRadius: 0,
            borderStyle: "none",
            bottom: bottom,
            marginTop: 0,
            marginBottm: 0
          }}
        >
          <Grid
            style={{
              padding: "0px",
              marginBottom: "0px",
              marginTop: "0px",
              marginLeft: "0px",
              marginRight: "0px"
            }}
          >
            <Grid.Column
              style={{
                padding: "0px",
                marginBottom: "0px",
                marginTop: "0px",
                textAlign: "center"
              }}
              width={2}
            >
              <Icon
                disabled={!this.state.text.length > 0}
                style={{ bottom: bottom }}
                onClick={this.handleSubmit}
                size="large"
                name="calendar alternate outline"
              />
            </Grid.Column>
            <Grid.Column
              style={{
                padding: "0px",
                marginBottom: "0px",
                marginTop: "0px",
                textAlign: "center"
              }}
              width={2}
            >
              <Icon
                disabled={!this.state.text.length > 0}
                style={{ bottom: bottom }}
                onClick={this.handleSubmit}
                size="large"
                name="payment"
              />
            </Grid.Column>
            <Grid.Column
              style={{
                padding: "0px",
                marginBottom: "0px",
                marginTop: "0px",
                textAlign: "center"
              }}
              width={2}
            >
              <Icon
                disabled={!this.state.text.length > 0}
                style={{ bottom: bottom }}
                onClick={this.handleSubmit}
                size="large"
                name="legal"
              />
            </Grid.Column>
            <Grid.Column
              style={{
                padding: "0px",
                marginBottom: "0px",
                marginTop: "0px",
                textAlign: "center"
              }}
              width={2}
            >
              <Icon
                disabled={!this.state.text.length > 0}
                style={{ bottom: bottom }}
                onClick={this.handleSubmit}
                size="large"
                name="clipboard check"
              />
            </Grid.Column>
            <Grid.Column
              style={{
                padding: "0px",
                marginBottom: "0px",
                marginTop: "0px",
                textAlign: "center"
              }}
              width={2}
            >
              <Icon
                disabled={!this.state.text.length > 0}
                style={{ bottom: bottom }}
                onClick={this.handleSubmit}
                size="large"
                name="send"
              />
            </Grid.Column>
            <Grid.Column
              style={{
                padding: "0px",
                marginBottom: "0px",
                marginTop: "0px",
                textAlign: "center"
              }}
              width={2}
            >
              <Icon
                disabled={!this.state.text.length > 0}
                style={{ bottom: bottom }}
                onClick={this.handleSubmit}
                size="large"
                name="send"
              />
            </Grid.Column>
            <Grid.Column
              style={{
                padding: "0px",
                marginBottom: "0px",
                marginTop: "0px",
                textAlign: "center"
              }}
              width={2}
            >
              <Icon
                disabled={!this.state.text.length > 0}
                style={{ bottom: bottom }}
                onClick={this.handleSubmit}
                size="large"
                name="photo"
              />
            </Grid.Column>
            <Grid.Column
              style={{
                padding: "0px",
                marginBottom: "0px",
                marginTop: "0px",
                textAlign: "center"
              }}
              width={2}
            >
              <Icon
                disabled={!this.state.text.length > 0}
                style={{ bottom: bottom }}
                onClick={this.handleSubmit}
                size="large"
                name="send"
              />
            </Grid.Column>
          </Grid>
        </Segment>
      </div>
    );
  }
}

export default TestPopup3;
