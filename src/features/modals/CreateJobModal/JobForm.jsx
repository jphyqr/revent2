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
import { createJob, updateJob, cancelToggle } from "../../job/jobActions";
import TextInput from "../../../app/common/form/TextInput";
import JobSchedule from "../../../app/common/form/JobSchedule/JobSchedule";
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
  updateJob,
  cancelToggle
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
    timeChanged: false,
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false,
    timesSelected: [],
    timesArray: []
  };

  componentDidMount() {
    if (this.props.initialValues) {
      this.handleVenueSelect(this.props.initialValues.venue);
    }

    const startDate =        this.props.draft &&
    this.props.draft.value &&
    this.props.draft.value.startDate

    console.log('1 . CDM... .startDate',  startDate)
    console.log('2 . CDM... .moment(startDate',  moment(startDate))
    console.log('3 . CDM... .moment(startDate).toDate',  moment(startDate).toDate())
    //const date = Number(parseInt(startDate).toFixed(0))
    //console.log('2 . CDM... .date', date   )
    //console.log('3 . CDM... .moment(startDate).toDate', moment(date).toDate()   )
    this.setState({
      timesSelected:
        this.props.draft &&
        this.props.draft.value &&
        this.props.draft.value.timesSelected,
       calendarDate: startDate
    });

   // console.log({date})
   
  }

  handleTimeSelected = (timeStamp, index) => {
    let timeSelectedArray = this.state.timesSelected;
    // let timeStampItem = timeSelectedArray[timeStamp]

    for (var i = 0; i < timeSelectedArray.length; i++) {
      if (timeSelectedArray[i].timeStamp === timeStamp) {
        console.log("item found");
        //change the code
        timeSelectedArray[i].timeSlots[index].selected = !timeSelectedArray[i]
          .timeSlots[index].selected;
      }
    }

    console.log({ timeSelectedArray });
    console.log({ timeStamp });
    //   console.log({timeStampItem})
    console.log({ index });
    //  timeSelectedArray[index].
    this.setState({ timesSelected: timeSelectedArray , timeChanged:true});
  };



  handleDateChange = async date => {
    //  console.log(new Date(date))
    // console.log('1', moment(date).toDate().toISOString())
    console.log('1' , date)
    console.log('2', new Date(date))
    console.log('3', moment(date))
    console.log('4', moment(date).toDate())
    console.log('5', new Date(moment(date).toDate()))
    console.log('6', (moment(date).toDate()).getTime()/1000)
    await this.setState({ startDate: ((moment(date).toDate()).getTime()/1000) });

    let schedule = createSchedule(this.state.startDate);

    this.setState({ timesSelected: schedule });
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

  onFormSubmit = async values => {
    values.venueLatLng = this.state.venueLatLng;
    if (Object.keys(values.venueLatLng).length === 0) {
      values.venueLatLng = this.props.job.venueLatLng;
    }
    //   if (this.props.initialValues.id) {
    await this.props.updateJob(this.props.draft, values, this.state.timesSelected);

    this.props.handleClose();
    //   this.props.history.goBack();
    //  } else {
    //  this.props.createJob(values);
    //   this.props.history.push("/jobs");
    // }
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
          <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
            {/* <Field
                name="title"
                type="text"
                component={TextInput}
                placeholder="Give your job a name"
              /> */}

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
                onSelect={this.handleVenueSelect}
              />
            )}

<Header sub color="teal" content="Start Date" />
           
            <Field
              name="startDate"
              type="text"
              component={DateInput}
              onChange={this.handleDateChange}
              selected={this.state.startDate}
              placeholder="Date and time of job"
            />
 {draftValues.bookingType==="online" ? 
 <div><Message info>This job is booked online and does not require a site visit.  Select times that the job can be started</Message>
        
  <JobSchedule
  currentTimesSelected={this.state.timesSelected}
  handleTimeSelected={this.handleTimeSelected}
  handleTimeUnselected={this.handleTimeUnselected}
  schedule={schedule}
 />  
 </div>              

 : 
 <div>
 <Message info>This job requires a site visit prior to bidding.  Select times for contractors to book site visits</Message>
           
 <JobSchedule
 currentTimesSelected={this.state.timesSelected}
 handleTimeSelected={this.handleTimeSelected}
 handleTimeUnselected={this.handleTimeUnselected}
 schedule={schedule}
/>
</div>
 } 

            <Button
              disabled={(invalid || submitting || (pristine&&!timeChanged))}
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
  )(reduxForm({ form: "jobForm", enableReinitialize: true, validate })(JobForm))
);
