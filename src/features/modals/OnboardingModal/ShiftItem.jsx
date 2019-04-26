import React, { Component } from 'react'

class ShiftItem extends Component {
  render() {
      const {shift, day, schedule, handleToggleShift} = this.props ||{}
      const thatShift = (schedule&&schedule[`${day}`])&&schedule[`${day}`][`${shift}`] ||{}
      console.log("thatShift", `${day}, ${shift}, ${thatShift}`)
    return (
      <div onClick={()=>handleToggleShift(day, shift, thatShift)}style={{backgroundColor: (thatShift==true)?"green":"white"}}>
        {shift}
      </div>
    )
  }
}


export default ShiftItem