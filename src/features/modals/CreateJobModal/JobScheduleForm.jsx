import React, { Component } from 'react'
import {Header,  Message, Transition, Button, Form, Label} from 'semantic-ui-react'
import { reduxForm, Field } from "redux-form";
import DateInput from "../../../app/common/form/DateInput";
import {createSchedule} from '../../../app/common/util/helpers'
import JobSchedule from "../../../app/common/form/JobSchedule/JobSchedule";
import  {connect} from 'react-redux'

import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import moment from "moment";

const mapState = state => {

  return {
    
  
  };
};

 class JobScheduleForm extends Component {

  state = {
    timeChanged: false,
    timesSelected: [],
    timesArray: [],
    showSchedule:false,
    selectedCount : 0
  };

  componentDidMount() {
 

    const startDate =        this.props.draft &&
    this.props.draft.value &&
    this.props.draft.value.startDate

   
    this.setState({
      timesSelected:
        this.props.draft &&
        this.props.draft.value &&
        this.props.draft.value.timesSelected,
       calendarDate: startDate
    });

  
  }

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

    this.setState({ timesSelected: schedule, showSchedule:true });
  
  };

  handleTimeSelected = (timeStamp, index) => {
    let timeSelectedArray = this.state.timesSelected;
    // let timeStampItem = timeSelectedArray[timeStamp]
  
    for (var i = 0; i < timeSelectedArray.length; i++) {
      if (timeSelectedArray[i].timeStamp === timeStamp) {
        console.log("item found");
        //change the code
        this.setState({selectedCount:(this.state.selectedCount+1)})
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


  onFormSubmit = async values => {
 
   
    await this.props.updateJobSchedule(this.props.draft, values, this.state.timesSelected);

  };


  render() {

    const {draft} = this.props
    const draftValues = draft&&draft.value
    const schedule = draft&&draft.value.schedule
   
    return (
      <div>
   <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
    
    
 {(!this.state.showSchedule)&&  <Message info>Select Ideal Start Date</Message>}
  
    
        <Header sub color="teal" content="Start Date" />
           
           <Field
             name="startDate"
             type="text"
             minDate={new Date()}
             component={DateInput}
             todayButton={"Today"}
             onChange={this.handleDateChange}
             selected={this.state.startDate}
             placeholder="Select Ideal Start Date"
           
           /> 


<Transition.Group animation="slide down" duration={300}>
                          {this.state.showSchedule && (
                            <div>
{draftValues.bookingType==="online" ?
  
  <Message info>This job is booked online and should not require a site visit.  Select times that the job can be started</Message>
    :
    <Message info>This job requires a site visit.  Select times that contractors can view the job</Message>
    }   
 <JobSchedule
 currentTimesSelected={this.state.timesSelected}
 handleTimeSelected={this.handleTimeSelected}
 handleTimeUnselected={this.handleTimeUnselected}
 schedule={schedule}
 selectedCount={this.state.selectedCount}
/>  
<Label warning style={{marginTop:15}}>Select at least 4 time slots</Label>
<Button
style={{marginTop:15}}
floated="right"
         disabled={this.state.selectedCount<3}
              positive
              type="submit"
            >
              Next
            </Button>
</div>   
                          )}
                        </Transition.Group>




           



 

</Form>
      </div>
    )
  }
}



export default connect(mapState, null)(reduxForm({ form: "scheduleForm", enableReinitialize: true })(JobScheduleForm))
;
