/*global google*/
import React, { Component } from "react";
import { connect } from "react-redux";
import TextInput from "../../../../app/common/form/TextInput";
import TextArea from "../../../../app/common/form/TextArea";
import PlaceInput from "../../../../app/common/form/PlaceInput";
import { Message, Step, Form, Grid, Button } from "semantic-ui-react";
import Script from "react-load-script";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import { Field, reduxForm } from "redux-form";

const actions = {};

const mapState = state => {
  return {
    loading: state.async.loading
  };
};

class Post extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false
  };
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
    //  await this.props.joinAlpha(values);
    // this.setState({ showSuccess: true });
  };

  render() {
    const { loading, compactDisplayMode } = this.props;
    return (
      <div
        style={{
          width: "100%",
          maxHeight: compactDisplayMode ? "300px" : "500px",
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
          <Field
            name="city"
            type="text"
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
            rows={2}
            placeholder="Describe job"
          />

          <Button
            loading={loading}
            fluid
            size="large"
            positive
            content="Post Work"
          />
        </Form>
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(reduxForm({ form: "postForm", enableReinitialize: true })(Post));
