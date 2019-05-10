import React, { Component } from "react";
import { Button, Label, Form, Icon } from "semantic-ui-react";
import moment from "moment";
import format from "date-fns/format";
import { reduxForm, Field } from "redux-form";
import JobSchedule from "../../../../app/common/form/JobSchedule/JobSchedule";
import DateInput from '../../../../app/common/form/DateInput'
import {connect} from 'react-redux'
const mapState=state=>{
  return {
    initialValues: state.quote&&state.quote.schedule
  }
}
class Schedule extends Component {
  state = {
    selectedDate: {},
    selectedHour: {},
    completionDate: {}
  };

componentDidMount(){
  const {schedule, timesSelected} = this.props ||{}
  const {completionDate, startDate, startHour} =schedule ||{}
  this.setState({completionDate: completionDate, selectedDate: startDate, selectedHour: startHour})

  // if(timesSelected&&timesSelected.length>0){
  //   this.handleSelectTime(timesSelected[0].day.timeStamp, timesSelected[0].hour.label)
                     
  // }
}


  handleSelectTime = (timeStamp, label) => {
    this.setState({ selectedDate: timeStamp, selectedHour: label });
  };
  handleDateChange = async date => {

    await this.setState({ completionDate: date})

    // let schedule = createSchedule(this.state.startDate);

    // this.setState({ timesSelected: schedule });
  };


  onFormSubmit = async values => {
     const {selectedDate, selectedHour} = this.state
  //   this.setState({buttonLoading: true})
      
  //  this.calculateTotalandTax(phase, values)
       await this.props.handleUpdateSchedule(selectedDate, selectedHour, values);
      
  //     this.setState({buttonLoading: false})

  //  if(selectedItemIndex<(phasesLength-1)){
  //    this.props.handleSelectItem(selectedItemIndex+1)
  //  } else{
  //   this.props.handleSelectItem(-1)
  //  }

  };
  render() {
    const { timesSelected } = this.props;
    const { finalTime } = this.state;
    return (
      <div>
        <div
          style={{
            height: "300px",
            overflowY: "auto",
            overflowX: "hidden",
            width: "auto"
          }}
        >
          {timesSelected &&
            timesSelected.map((day, dayIndex) =>
              day.timeSlots.map(
                (hour, hourIndex) =>
                  hour.selected && (
                    <div
                      style={{
                        display: "block",
                        padding: "0px",
                        margin: "5px"
                      }}
                    >
                      <Button
                        onClick={() =>
                          this.handleSelectTime(day.timeStamp, hour.label)
                        }
                        as="div"
                        labelPosition="right"
                      >
                        <Button
                          style={{ width: "300px" }}
                          
                          primary={
                            this.state.selectedDate === day.timeStamp &&
                            this.state.selectedHour === hour.label
                          }
                        >
                          <Button.Content visible>
                            {" "}
                            <Icon name="calendar" />{" "}
                            {format(
                              moment(day.timeStamp * 1000).toDate(),
                              "ddd MMM D"
                            )}
                            {"   "}
                            <Icon size="large" name="clock">
                              {"   "}
                            </Icon>
                            {hour.label}
                          </Button.Content>

                        </Button>
                        {/* <Label  style={{width:'150px'}}as="a" basic color="blue" pointing="left">
                        
                        </Label> */}
                      </Button>

                    </div>
                  )
              )
            )}{" "}


        </div>

        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
        <Field
                    key={`completionDate`}
                    type="text"
                    name={`completionDate`}
                    component={DateInput}
                    placeholder={`Target Completion Date`}
                    dateFormat="ddd MMM D"
                    dropdownMode="select"
                 
                    minDate={moment(Date.now())}
                    popperPlacement="auto"
                  />
                          <Button positive type="submit">
                    Next
                  </Button>
</Form>
      </div>
    );
  }
}

export default connect(mapState, null)(reduxForm({form: 'scheduleForm', enableReinitialize: true})(Schedule));
