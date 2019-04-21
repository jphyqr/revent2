/*global google*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import Script from "react-load-script";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Segment, Form, Button, Grid, Header , Message} from "semantic-ui-react";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import { createJob,  cancelToggle } from "../../job/jobActions";
import TextInput from "../../../app/common/form/TextInput";
import Checkbox from "../../../app/common/form/Checkbox";
import {createSchedule} from '../../../app/common/util/helpers'
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { withFirestore } from "react-redux-firebase";
import format from "date-fns/format";
import moment from "moment";
const mapState = state => {
  let task = {};

  if (state.draft) {
    task = state.draft.value;
  }
  return {
    initialValues: task,
    loading: state.async.loading
  };
};

const actions = {
  createJob,
  cancelToggle,
};

const contractType = [
  {
    key: "bid",
    text: "Bid",
    value: "bid",
    description: "Describe the job, select the best offer"
  },
  {
    key: "maxBudget",
    text: "Max Budget",
    value: "maxBudget",
    description: "Set your max, have contractors pitch the design"
  },
  {
    key: "flatRate",
    text: "Flat Rate",
    value: "flatRate",
    description: "Take it or leave it!"
  },
  {
    key: "hourlyRate",
    text: "Hourly Rate",
    value: "hourlyRate",
    description: "No plan? No problem!"
  }
];

const validate = combineValidators({
  title: isRequired({ message: "The job title is required" }),
  contractType: isRequired({ message: "Please select a contract type" }),
  // description: composeValidators(
  //   isRequired({ message: "Please enter a description" }),
  //   hasLengthGreaterThan(4)({
  //     message: "Description needs to be at least 5 characters"
  //   })
  // )(),
  city: isRequired("city"),
  venue: isRequired("venue"),
  date: isRequired("date")
});

class JobForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false,

  };

  componentDidMount() {
    if (this.props.initialValues) {
      this.handleVenueSelect(this.props.initialValues.venue);
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

  onFormSubmit = async values => {
    values.venueLatLng = this.state.venueLatLng;
    if (Object.keys(values.venueLatLng).length === 0) {
      values.venueLatLng = this.props.job.venueLatLng;
    }
   
    await this.props.updateJobBasic(this.props.draft, values);

  };

  render() {
    const {
      invalid,
      submitting,
      pristine,

      cancelToggle,
      loading,
      draft
    } = this.props;
    const { value: draftValues } = draft;
    const { schedule } = draftValues;

    const {timeChanged} = this.state

    
    //const {job} = draft.value
    return (
   
      <Grid>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQc2wDlRKjT6P-SV4vl_lq-YyFFnbqujw&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        <Grid.Column width={14}>
          <Header sub color="teal" content="Job Details" />
          <Form onSubmit={()=>this.props.handleSubmit(this.onFormSubmit)}>


            <Field name="title" type="text" component={TextInput} />
            <Header sub color="teal" content="Accept Bids as" />
            <Form.Group inline>
              {draftValues && draftValues.hourlyOwner && (
                <Field
                  name="acceptsHourlyOwner"
                  type="checkbox"
                  label="$/H-Owner supplies"
                  component={Checkbox}
                />
              )}
              {draftValues && draftValues.hourlyContractor && (
                <Field
                  name="acceptsHourlyContractor"
                  type="checkbox"
                  label="$/H-Contractor supplies"
                  component={Checkbox}
                />
              )}
              {draftValues && draftValues.flatOwner && (
                <Field
                  name="acceptsFlatOwner"
                  type="checkbox"
                  label="Flat-Owner supplies"
                  component={Checkbox}
                />
              )}
              {draftValues && draftValues.flatContractor && (
                <Field
                  name="acceptsFlatContractor"
                  type="checkbox"
                  label="Flat-Contractor supplies"
                  component={Checkbox}
                />
              )}
            </Form.Group>
            <Header sub color="teal" content="Job Location details" />
            <Message positive
            header="Your location is safe"
            content="Bidders can see the general area.  The selected contractor will see the address on the scheduled date"
            
            /> 
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
                onSelect={()=>this.handleVenueSelect()}
              />
            )}

            <Button
              disabled={(invalid || submitting || (pristine&&!timeChanged))}
              positive
              loading={loading}
              type="submit"
            >
              Next
            </Button>

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
  )(reduxForm({ form: "jobForm", enableReinitialize: true, validate })(JobForm))
);
