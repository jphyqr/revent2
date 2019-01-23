import React from 'react'
import PhaseListItem from './PhaseListItem'
const ContractPhaseList = ({currentPhases, handleDeletePhaseItem}) => {
  return (


    <div style={{backgroundColor:'whiteSmoke',maxHeight:100, minHeight:100, overflowY:"auto"}}>
      {currentPhases&&currentPhases.length>0&&currentPhases.map((phase,index) =>(
      <PhaseListItem index={index} key={index} phase={phase} handleDeletePhaseItem={handleDeletePhaseItem}/>

      ))}
    </div>
  )
}

export default ContractPhaseList
