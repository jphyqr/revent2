import React, { Component } from 'react'
import {Button} from 'semantic-ui-react'
 class PhaseListItem extends Component {
  render() {
      const {phase, index, handleDeletePhaseItem} = this.props
    return (
      <div style={{ fontSize:'25px',  backgroundColor:'LightSlateGray', margin:'10px', color:'white', position:"relative"}}>
        Phase {index+1} : {phase.name}  {parseFloat(phase.percent).toFixed(2)} %
        <Button onClick={()=>handleDeletePhaseItem(index)} size='mini' negative style={{  position:'absolute', right:0, top:3}}>DELETE</Button>
      </div>
    )
  }
}

export default PhaseListItem