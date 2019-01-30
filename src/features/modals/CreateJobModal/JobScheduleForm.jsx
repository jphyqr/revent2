import React, { Component } from 'react'
import {Header,  Message, Button, Form} from 'semantic-ui-react'
import { reduxForm, Field } from "redux-form";
import DateInput from "../../../app/common/form/DateInput";
import {createSchedule} from '../../../app/common/util/helpers'
import JobSchedule from "../../../app/common/form/JobSchedule/JobSchedule";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import moment from "moment";



 class JobScheduleForm extends Component {

  state = {
    timeChanged: false,
    timesSelected: [],
    timesArray: []
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

    this.setState({ timesSelected: schedule });
  };

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
        <Header sub color="teal" content="Start Date" />
           
           <Field
             name="startDate"
             type="text"
             component={DateInput}
             onChange={this.handleDateChange}
             selected={this.state.startDate}
             placeholder="Date and time of job"
           />
           
<div>
{draftValues.bookingType==="online" ?
  
  <Message info>This job is booked online and does not require a site visit.  Select times that the job can be started</Message>
    :
    <Message info>This job is booked online and does not require a site visit.  Select times that the job can be started</Message>
    }   
 <JobSchedule
 currentTimesSelected={this.state.timesSelected}
 handleTimeSelected={this.handleTimeSelected}
 handleTimeUnselected={this.handleTimeUnselected}
 schedule={schedule}
/>  
</div>              


<Button
         
              positive
              type="submit"
            >
              Next
            </Button>
 

</Form>
      </div>
    )
  }
}



export default reduxForm({ form: "scheduleForm", enableReinitialize: true })(JobScheduleForm)
;
