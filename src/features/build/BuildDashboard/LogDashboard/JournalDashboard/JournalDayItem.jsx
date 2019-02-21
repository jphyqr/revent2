import React, { Component } from 'react'
import moment from 'moment'
import JournalList from './JournalList'
import JournalForm from './JournalForm'
import format from 'date-fns/format'
import {Button} from 'semantic-ui-react'
class JournalDayItem extends Component {
  render() {
      const {day, dayIndex, selectedIndex} = this.props
      let isSelected = (selectedIndex===dayIndex)
      console.log('string' , format(moment(day).toDate(), "ddd, Do"))
      return (
        <div
        container
        style={{
          display: "inline-block",
          width: "300px",
          position: "relative",
          height: '435px',
          backgroundColor: "whiteSmoke",
          marginRight: "10px",
          color:'black'
        }}
      >
        
        <div style={{backgroundColor:'blue', color:'white', fontSize:'18px', textAlign:'center'}}>{format(moment(day).toDate(), "dddd MMMM Do")} </div> 
        <div style={{backgroundColor:'yellow', height:"66%"}}> <JournalList day={day}/></div> 
    <div style={{backgroundColor:'green', height:"100%"}}> {isSelected ? <JournalForm day={day} dayIndex={dayIndex} addJournalEntry={this.props.addJournalEntry} /> : <Button onClick={()=>this.props.handleSelectDay(dayIndex)}>Select</Button>}</div> 
        </div>
      )
  }
}







export default JournalDayItem
