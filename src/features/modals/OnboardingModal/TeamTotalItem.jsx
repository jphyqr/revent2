import React, { Component } from 'react'

class TeamTotalItem extends Component {
  render() {
      const {shift, day, schedule, onboarders, selectedId} = this.props ||{}
      let count = 0;
      let arrayOfOnboarders = onboarders
      if(selectedId){
           arrayOfOnboarders = onboarders.filter(el => el.id === selectedId);
          console.log({arrayOfOnboarders})
       //   arrayOfOnboarders= [filteredItem]
      }
      for(var i=0; i<(arrayOfOnboarders&&arrayOfOnboarders.length); i++){
       let onboarder= arrayOfOnboarders[i]
       let {schedule} = onboarder || {}
       if(schedule&&schedule[`${day}`]&&schedule[`${day}`][`${shift}`]){
           count++
       }
      }
     
    return (
      <div style={{backgroundColor: (count>1)?"green": (count===1)? "yellow":"white"}}>
        {shift}
      </div>
    )
  }
}


export default TeamTotalItem