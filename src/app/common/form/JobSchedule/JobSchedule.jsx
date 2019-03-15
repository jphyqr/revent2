import React, { Component } from 'react'
import JobScheduleItem from './JobScheduleItem'

class JobSchedule extends Component {
  render() {
      const {currentTimesSelected} = this.props

    return (
      <div style={{padding:"5px", height:170, width:"auto", backgroundColor:'grey',          overflowX: "auto",
      overflowY: "hidden",
      whiteSpace: "nowrap",
      position: "relative", }}>
        {currentTimesSelected&&currentTimesSelected.map((day,dayIndex)=>(
          <JobScheduleItem dayIndex={dayIndex} currentTimesSelected={this.props.currentTimesSelected} handleTimeSelected={this.props.handleTimeSelected} handleTimeUnselected={this.props.handleTimeUnselected} day={day}/>
        ))}
      </div>
    )
  }
}


export default  JobSchedule