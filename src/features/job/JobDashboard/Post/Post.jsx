/*global google*/
import React, { Component } from "react";
import { connect } from "react-redux";
import TextInput from "../../../../app/common/form/TextInput";
import TextArea from "../../../../app/common/form/TextArea";
import PlaceInput from "../../../../app/common/form/PlaceInput";
import DateInput from "../../../../app/common/form/DateInput";
import {
  Message,
  Label,
  Step,
  Form,
  Grid,
  Button,
  Header
} from "semantic-ui-react";
import Script from "react-load-script";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import moment from "moment";
import { Field, reduxForm } from "redux-form";

import { newRequestForOnboarding } from "../../../modals/OnboardingModal/onboardingActions";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import format from "date-fns/format";
const actions = { newRequestForOnboarding };

const mapState = state => {
  return {
    loading: state.async.loading
  };
};

const validate = combineValidators({
  venue: isRequired({ message: "Select a location" }),
  phone: isRequired({ message: "Phone number required" })
});

class Post extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false,
    selectedCity: "Regina, SK, Canada",
    showPage2: false,

    day: "",
    hour: "",
    selectTimeValidator: true,
    showSuccess: false
  };

  componentWillReceiveProps() {
    if (this.state.scriptLoaded) {
      geocodeByAddress(this.state.selectedCity)
        .then(results => getLatLng(results[0]))
        .then(latlng => {
          this.setState({
            cityLatLng: latlng
          });
        })
        .then(() => {
          this.props.change("city", this.state.selectedCity);
        });
    }
  }
  handleScriptLoaded = () => this.setState({ scriptLoaded: true });
  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("city", selectedCity);
      });
  };

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("venue", selectedVenue);
      });
  };

  handleSubmit = async values => {
    if (this.state.showPage2 === false) {
      this.setState({ showPage2: true, selectTimeValidator: false });
    } else {
      values.venueLatLng = this.state.venueLatLng;
      values.day = this.state.day;
      values.hour = this.state.hour;

      await this.props.newRequestForOnboarding(values);
      this.setState({ showPage2: false, showSuccess: true });
      this.props.reset()
    }

    // this.setState({ showSuccess: true });
  };

  render() {
    const {
      loading,
      compactDisplayMode,
      pristine,
      invalid,
      submitting
    } = this.props;
    const { showPage2 } = this.state;

    let days = [];

    for (var i = 0; i < 5; i++) {
      days.push(
        format(
          moment(Date.now())
            .add(i, "day")
            .toDate(),
          "ddd-Do"
        )
      );
    }
    // const today = format(moment(Date.now()).toDate(), "ddd-Do")
    // const tomorrow = format(moment(Date.now()).add(1, 'day').toDate(), "ddd-Do")
    // const day3 = format(moment(Date.now()).add(2, 'day').toDate(), "ddd-Do")
    // const day4 = format(moment(Date.now()).add(3, 'day').toDate(), "ddd-Do")
    // const day5 = format(moment(Date.now()).add(4, 'day').toDate(), "ddd-Do")

    console.log({ days });

    return (
      <div
        style={{
          width: "100%",
          height: compactDisplayMode ? "300px" : "500px",
          backgroundColor: "lightgrey",
          overflowX: "hidden",
          overflowY: "auto"

          // position: "relative"
        }}
      >
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQc2wDlRKjT6P-SV4vl_lq-YyFFnbqujw&libraries=places"
          onLoad={this.handleScriptLoaded}
        />

        <Form
          style={{ margin: "10px" }}
          onSubmit={this.props.handleSubmit(this.handleSubmit)}
        >
          {this.state.showSuccess ? (
          <div> <Message>
              {" "}
              <Message.Header>
                Your job is dispatched to our team. We will contract you shortly
                to schedule an onsite visit.
              </Message.Header>
            </Message>
            <Label onClick={()=>{this.setState({showSuccess:false, showPage2:false})}}>Back</Label></div>
          ) : showPage2 ? (
            <div>
              {" "}
              <Message color="orange">
                <Message.Header>
                  Tell us when, and we will send a pro to help list your first
                  job
                </Message.Header>
              </Message>
              <Grid style={{ marginLeft: 5, marginRight: 5, marginBottom: 5 }}>
                <Grid.Column style={{ padding: 5 }} width={5}>
                  {days &&
                    days.map(day => (
                      <Grid.Row style={{ paddingBottom: 5 }}>
                        <Label
                          style={{
                            width: "100%",
                            backgroundColor:
                              day === this.state.day ? "green" : "grey"
                          }}
                          onClick={() => {
                            this.setState({ day: day });
                          }}
                        >
                          {day}
                        </Label>
                      </Grid.Row>
                    ))}
                </Grid.Column>
                <Grid.Column style={{ padding: 5 }} width={4}>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 8 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 8
                              });
                            }
                      }
                    >
                      8-9
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 9 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 9
                              });
                            }
                      }
                    >
                      9-10
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 10 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 10
                              });
                            }
                      }
                    >
                      10-11
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 11 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 11
                              });
                            }
                      }
                    >
                      11-noon
                    </Label>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column style={{ padding: 5 }} width={4}>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 12 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 12
                              });
                            }
                      }
                    >
                      noon-1
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 13 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 13
                              });
                            }
                      }
                    >
                      1-2
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 14 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 14
                              });
                            }
                      }
                    >
                      2-3
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 15 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 15
                              });
                            }
                      }
                    >
                      3-4
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 16 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 16
                              });
                            }
                      }
                    >
                      4-5
                    </Label>
                  </Grid.Row>
                </Grid.Column>
                <Grid.Column style={{ padding: 5 }} width={3}>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 17 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 17
                              });
                            }
                      }
                    >
                      5-6
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 18 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 18
                              });
                            }
                      }
                    >
                      6-7
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 19 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 19
                              });
                            }
                      }
                    >
                      7-8
                    </Label>
                  </Grid.Row>
                  <Grid.Row style={{ paddingBottom: 5 }}>
                    <Label
                      style={{
                        width: "100%",
                        opacity: this.state.day === "" ? 0.4 : 1,
                        backgroundColor:
                          this.state.hour === 20 ? "green" : "grey"
                      }}
                      onClick={
                        this.state.day === ""
                          ? () => {}
                          : () => {
                              this.setState({
                                selectTimeValidator: true,
                                hour: 20
                              });
                            }
                      }
                    >
                      8-9
                    </Label>
                  </Grid.Row>
                </Grid.Column>
              </Grid>
            </div>
          ) : (
            <div>
              <Message color="green">
                <Message.Header>Start your project</Message.Header>
                <Message.List>
                  <Message.Item>
                    We come to you and help post your first job
                  </Message.Item>
                </Message.List>
              </Message>

              {this.state.scriptLoaded && (
                <Field
                  name="venue"
                  type="text"
                  component={PlaceInput}
                  options={{
                    location: new google.maps.LatLng(this.state.cityLatLng),
                    radius: 1000,
                    types: ["address"]
                  }}
                  placeholder="Street Address"
                  onSelect={this.handleVenueSelect}
                />
              )}

              <Field
                name="phone"
                type="text"
                component={TextInput}
                placeholder="Phone"
              />
              <Field
                name="description"
                type="text"
                component={TextArea}
                rows={1}
                placeholder="Short Description: (ie. Kitchen Re-model)"
              />
            </div>
          )}
          {(!this.state.showSuccess)&&<Button
            style={{ marginTop: 5 }}
            loading={loading}
            fluid
            disabled={
              invalid ||
              submitting ||
              pristine ||
              !this.state.selectTimeValidator
            }
            size="large"
            positive
            content={showPage2 ? "Submit" : "Next"}
          />}
        </Form>
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(reduxForm({ form: "postForm", enableReinitialize: true, validate })(Post));
