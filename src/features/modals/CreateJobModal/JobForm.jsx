/*global google*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import Script from "react-load-script";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import { createJob, updateJob, cancelToggle } from "../../job/jobActions";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { withFirestore } from "react-redux-firebase";

const mapState = state => {
  let job = {};

  if (state.firestore.ordered.jobs && state.firestore.ordered.jobs[0]) {
    job = state.firestore.ordered.jobs[0];
  }

  return {
    initialValues: job,
    job: job,
    loading: state.async.loading
  };
};

const actions = {
  createJob,
  updateJob,
  cancelToggle
};


const category = [
    { key: "snowremoval", text: "Snow Removal", value: "snowremoval" },
    { key: "carpentry", text: "Carpentry", value: "carpentry" },
    { key: "plumbing", text: "Plumbing", value: "plumbing" },
    { key: "electrical", text: "Electrical", value: "electrical" }
  ];

  const contractType = [
    { key: "bid", text: "Bid", value: "bid", description:'Describe the job, select the best offer'},
    { key: "maxBudget", text: "Max Budget", value: "maxBudget", description:'Set your max, have contractors pitch the design' },
    { key: "flatRate", text: "Flat Rate", value: "flatRate", description:'Take it or leave it!' },
    { key: "hourlyRate", text: "Hourly Rate", value: "hourlyRate", description:'No plan? No problem!' }
  ];
  
  


const validate = combineValidators({
  
  title: isRequired({ message: "The job title is required" }),
  category: isRequired({ message: "Please provide a category" }),
  contractType: isRequired({ message: "Please select a contract type" }),
  // description: composeValidators(
  //   isRequired({ message: "Please enter a description" }),
  //   hasLengthGreaterThan(4)({
  //     message: "Description needs to be at least 5 characters"
  //   })
  // )(),
  city: isRequired("city"),
  venue: isRequired("venue"),
  // date: isRequired("date")
});

class JobForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false
  };

  //FIX : now with no params.id we need to be able to open this job from another location by ID, will have to 
  //pass in ID from draft etc.
  // async componentDidMount() {
  //   const { firestore, match } = this.props;
  //   await firestore.setListener(`jobs/${match.params.id}`);
  // }

  // async componentWillUnmount() {
  //   const { firestore, match } = this.props;
  //   await firestore.unsetListener(`jobs/${match.params.id}`);
  // }

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

  onFormSubmit = async values => {
    values.venueLatLng = this.state.venueLatLng;
    if (Object.keys(values.venueLatLng).length === 0) {
      values.venueLatLng = this.props.job.venueLatLng;
    }
    if (this.props.initialValues.id) {
      await this.props.updateJob(values);
   //   this.props.history.goBack();
    } else {
      this.props.createJob(values);
   //   this.props.history.push("/jobs");
    }
  };

  render() {
    const {
      invalid,
      submitting,
      pristine,
      job,
      cancelToggle,
      loading
    } = this.props;
    return (
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQc2wDlRKjT6P-SV4vl_lq-YyFFnbqujw&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        <Grid.Column width={10}>
      
            <Header sub color="teal" content="Job Details" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field
                name="title"
                type="text"
                component={TextInput}
                placeholder="Give your job a name"
              />
              <Field
                name="category"
                type="text"
                component={SelectInput}
                options={category}
                placeholder="Category"
              />
              <Field
                name="contractType"
                type="text"
                component={SelectInput}
                options={contractType}
                placeholder="Contract Type"
              />
              <Header sub color="teal" content="Job Location details" />
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
              {/* <Field
                name="date"
                type="text"
                component={DateInput}
                dateFormat="YYYY-MM-DD HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                placeholder="Date and time of job"
              /> */}
              <Button
                disabled={invalid || submitting || pristine}
                positive
                loading={loading}
                type="submit"
              >
                Next
              </Button>
              {/* <Button
                disabled={loading}
                onClick={this.props.history.goBack}
                type="button"
              >
                Cancel
              </Button> */}
              {/* <Button
                onClick={() => cancelToggle(!job.cancelled, job.id)}
                type="button" //need type to avoid auto form submission
                color={job.cancelled ? "green" : "red"}
                floated="right"
                content={job.cancelled ? "Reactivate Job" : "Cancel job"}
              /> */}
            </Form>
       
        </Grid.Column>
      </Grid>
    );
  }
}

export default withFirestore(
  connect(
    mapState,
    actions
  )(
    reduxForm({ form: "jobForm", enableReinitialize: true, validate })(
      JobForm
    )
  )
);