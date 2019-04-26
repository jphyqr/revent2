/*global google*/
import React, { Component } from "react";
import {
  Modal,
  Transition,
  Header,
  Button,
  Statistic,
  Grid,
  Icon,
  Divider,
  Message,
  Image,
  Form
} from "semantic-ui-react";
import Dropzone from "react-dropzone";
import Script from "react-load-script";
import TeamTotalItem from './TeamTotalItem'
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import GoogleMapReact from "google-map-react";
import MapMarker from "./MapMarker";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { firestoreConnect } from "react-redux-firebase";
import PlaceInput from "../../../app/common/form/PlaceInput";
import TextInput from "../../../app/common/form/TextInput";
import { isEmpty, isLoaded } from "react-redux-firebase";
import moment from "moment";
import format from "date-fns/format";
import ShiftItem from "./ShiftItem";
import { toggleShift, goLive , pauseProfile, uploadOnboardingPhoto, uploadLicensePhoto} from "./onboardingActions";
const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

const shifts = ["8-12", "12-5", "5-9"];

const query = ({ auth }) => {
  const authenticated = auth.isLoaded && !auth.isEmpty;
  if (authenticated) {
    return [
      {
        collection: "onboarder_users",

        storeAs: "onboarders"
      },
      {
        collection: "onboarder_users",
        doc: auth.uid, 
        storeAs: "onboarder_user_profile"
      }
    ];
  } else {
    return [];
  }
};

const actions = {
  closeModal,
  toggleShift,
  goLive,
  pauseProfile,
  uploadOnboardingPhoto, uploadLicensePhoto
};

const mapState = state => {
  return {
    auth: state.firebase.auth,
    onboarders: state.firestore.ordered.onboarders,
    myOnboarderProfile:
      (state.firestore.ordered.onboarder_user_profile &&
        state.firestore.ordered.onboarder_user_profile[0]) ||
      {},
    initialValues:
      (state.firestore.ordered.onboarder_user_profile &&
        state.firestore.ordered.onboarder_user_profile[0] &&
        state.firestore.ordered.onboarder_user_profile[0].values) ||
      {}
  };
};

class OnboardingModal extends Component {
  state = {
    showMe: true,
    cityLatLng: {},
    venueLatLng: {},
    selectedCity: "",
    scriptLoaded: false,
    files: [], fileName: "", cropResult: null, image: {} ,
    itemClicked:false
  };

  componentDidMount() {
    if (this.props.initialValues) {
      this.handleVenueSelect(this.props.initialValues.venue);
    }


   
  }
  handleMapItemClick = id => {
    this.setState({
        itemClicked:true
    })
    this.setState({
      selectedId: id
    });
  };

  itemClickedProcessed = () =>{
    this.setState({
        itemClicked:false
    })
  }

  onLicenseDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name
    });
    await this.props.uploadLicensePhoto(
      this.props.myOnboarderProfile,
      files[0]
    );

    this.setState({
      files: {},
      fileName: {}
    });
  };


  onDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name
    });
    await this.props.uploadOnboardingPhoto(
      this.props.myOnboarderProfile,
      files[0]
    );

    this.setState({
      files: {},
      fileName: {}
    });
  };

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
  handleScriptLoaded = () => this.setState({ scriptLoaded: true });

  handleClose = async () => {
    this.props.closeModal();
  };

  handleSubmit = async values => {

    if(this.props.myOnboarderProfile.isLive){
        await this.props.pauseProfile(this.props.myOnboarderProfile);   
    } else {

        values.venueLatLng = this.state.venueLatLng;
        if (Object.keys(values.venueLatLng).length === 0) {
          values.venueLatLng = this.props.myOnboarderProfile.location.venueLatLng;
        }
        await this.props.goLive(this.props.myOnboarderProfile, values);
    }


  
    
  };
  handleToggleShift = (day, shift, thisShift) => {
    this.props.toggleShift(
      this.props.myOnboarderProfile,
      day,
      shift,
      thisShift
    );
  };

  render() {
    const { loading, onboarders, myOnboarderProfile, toggleShift } = this.props ||{};
    const {onboardingPhotoURL, licensePhotoURL, isLive} = myOnboarderProfile || {}
    const { showMe } = this.state;
    const { schedule } = myOnboarderProfile || {};
    const lat = 50.44;
    const lng = -104.61;
    const center = [lat, lng];
    const zoom = 11;
    console.log("myTimeTable", schedule);

    return (
      <Modal
        size="fullscreen"
        closeIcon="close"
        open={true}
        onClose={this.handleClose}
        scrolling
      >
        <Modal.Header>{isLive? "Live Profile" : "Paused Profile"}</Modal.Header>
        <Modal.Content scrolling>
          <div
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              height: "500px",
              marginTop: 0
            }}
          >
            <Script
              url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQc2wDlRKjT6P-SV4vl_lq-YyFFnbqujw&libraries=places"
              onLoad={this.handleScriptLoaded}
            />
            <Button.Group>
            <Button
                onClick={() => this.setState({ showMe: true })}
                primary={showMe}
              >
                Me
              </Button>
              <Button
                onClick={() => this.setState({ showMe: false })}
                primary={!showMe}
              >
                Team
              </Button>

            </Button.Group>
            {showMe ? (
              <div>
                <Grid style={{ margin: 10 }}>
                  {days &&
                    days.map(day => (
                      <Grid.Row style={{ padding: 1, margin: 5 }}>
                        <Grid columns={shifts.length + 1}>
                          <Grid.Column style={{ padding: 0, margin: 0 }}>
                            <Header as="h3">{day}</Header>
                          </Grid.Column>
                          {shifts &&
                            shifts.map(shift => (
                              <Grid.Column style={{ padding: 0, margin: 0 }}>
                                <ShiftItem
                                  shift={shift}
                                  handleToggleShift={this.handleToggleShift}
                                  schedule={schedule}
                                  day={day}
                                />
                              </Grid.Column>
                            ))}
                        </Grid>
                      </Grid.Row>
                    ))}
                </Grid>
                <Form
                  style={{ margin: "10px" }}
                  onSubmit={this.props.handleSubmit(this.handleSubmit)}
                >
                                  <Field
                    name="first_name"
                    type="text"
                    
                    component={TextInput}
                    
                    placeholder="First Name"
                  />
                                                    <Field
                    name="last_name"
                    type="text"
                    
                    component={TextInput}
                    
                    placeholder="Last Name"
                  />

<Field
                    name="phone_number"
                    type="text"
                    
                    component={TextInput}
                    
                    placeholder="Phone Number"
                  />
<Field
                    name="social_insurance_number"
                    type="text"
                    
                    component={TextInput}
                    
                    placeholder="Social Insurance Number"
                  />

                  <Field
                    name="city"
                    type="text"
                    value={this.state.selectedCity}
                    component={PlaceInput}
                    options={{ types: ["(cities)"] }}
                    placeholder="Job city"
                    onSelect={this.handleCitySelect}
                  />
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

                  <Button
                    loading={loading}
                    fluid
                    size="large"
                    positive
                    content={isLive? "Pause Profile" : "Go Live"}
                  />


<div style={{ width: "100%", height: "auto" }}>
           
           
           
                <Dropzone
                  style={{
                    width: "75%",
                    marginTop: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: "20px",
                    display: "block",
                    height: 30,
                    backgroundColor: "orange"
                  }}
                  onDrop={this.onDrop}
                  multiple={false}
                  acceptedFiles={"image/jpeg,image/png,image/gif"}
                >
                  <div style={{ textAlign: "center" }}>
                    <Header style={{ paddingTop: 4 }} content={onboardingPhotoURL ? "Change Display Photo" : "+Add Display Photo"} />
                  </div>
                </Dropzone>
               
                <div
                  style={{
                    height: 130,
                    width: "auto",
                    whiteSpace: "nowrap",
                    padding: 5,

                  }}
                >

                  {onboardingPhotoURL &&
                
                      <Image
                        style={{
                          marginLeft: 10,
                          height: 115,
                          display: "inline-block"
                        }}
                        src={onboardingPhotoURL}
                      />
                    }



<Dropzone
                  style={{
                    width: "75%",
                    marginTop: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: "20px",
                    display: "block",
                    height: 30,
                    backgroundColor: "orange"
                  }}
                  onDrop={this.onLicenseDrop}
                  multiple={false}
                  acceptedFiles={"image/jpeg,image/png,image/gif"}
                >
                  <div style={{ textAlign: "center" }}>
                    <Header style={{ paddingTop: 4 }} content={licensePhotoURL ? "Change License Photo" : "+Add License Photo"} />
                  </div>
                </Dropzone>
               
                <div
                  style={{
                    height: 130,
                    width: "auto",
                    whiteSpace: "nowrap",
                    padding: 5,

                  }}
                >

                  {licensePhotoURL &&
                
                      <Image
                        style={{
                          marginLeft: 10,
                          height: 115,
                          display: "inline-block"
                        }}
                        src={licensePhotoURL}
                      />
                    }










                    
                </div>







                    
                </div>

                    
              </div>




                </Form>
              </div>
            ) : (
              <div style={{ height: 300 }}>
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: "AIzaSyBeJlBUVhFnJrXS5flaYydbj5AmbuGCNBQ"
                  }}
                  defaultCenter={center}
                  defaultZoom={zoom}
                  onChildMouseEnter={this.onChildMouseEnter}
                  onChildMouseLeave={this.onChildMouseLeave}
                >
                  {onboarders &&
                    onboarders.map((onboarder, index) => (
                    
                      <MapMarker
                        lat={
                            onboarder&&onboarder.values &&
                          onboarder.values.venueLatLng &&
                          onboarder.values.venueLatLng.lat
                        }
                        lng={
                            onboarder&&onboarder.values &&
                          onboarder.values.venueLatLng &&
                          onboarder.values.venueLatLng.lng
                        }
                        key={index}
                        onboarder={onboarder}
                        itemClicked={this.state.itemClicked}
                        itemClickedProcessed={this.itemClickedProcessed}
                        handleMapItemClick = {this.handleMapItemClick}
                        selectedId={this.state.selectedId}
                      />
                    ))}
                </GoogleMapReact>

                <Grid style={{ margin: 10 }}>
                  {days &&
                    days.map(day => (
                      <Grid.Row style={{ padding: 1, margin: 5 }}>
                        <Grid columns={shifts.length + 1}>
                          <Grid.Column style={{ padding: 0, margin: 0 }}>
                            <Header as="h3">{day}</Header>
                          </Grid.Column>
                          {shifts &&
                            shifts.map(shift => (
                              <Grid.Column style={{ padding: 0, margin: 0 }}>
                                <TeamTotalItem
                                  shift={shift}
                                  handleToggleShift={this.handleToggleShift}
                                  schedule={schedule}
                                  day={day}
                                  
                                  onboarders={onboarders}
                                  selectedId={this.state.selectedId}
                                />
                              </Grid.Column>
                            ))}
                        </Grid>
                      </Grid.Row>
                    ))}
                </Grid>


              </div>
            )}
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default connect(
  mapState,
  actions
)(
  firestoreConnect(props => query(props))(
    reduxForm({ form: "onboardingForm", enableReinitialize: true })(
      OnboardingModal
    )
  )
);
