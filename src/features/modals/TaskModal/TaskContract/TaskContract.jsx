import React, { Component } from 'react'
import ContractForm from './ContractForm'
import ContractPhaseList from './ContractPhaseList'

class TaskContract extends Component {
  render() {
    const {task, updateContractPhases, handleDeletePhaseItem} = this.props
    return (
      <div style={{width:'400px'}}>
       <ContractForm handlePhasesUpdated={this.props.handlePhasesUpdated} task={task} updateContractPhases={updateContractPhases} />
       <ContractPhaseList handleDeletePhaseItem={handleDeletePhaseItem} currentPhases={this.props.currentPhases}/>
      </div>
    )
  }
}


export default TaskContract