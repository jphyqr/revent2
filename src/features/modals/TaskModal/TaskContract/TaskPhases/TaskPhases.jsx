import React, { Component } from 'react'
import {  Form, Button, Grid, Header } from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import TextInput from '../../../../../app/common/form/TextInput'
 class TaskPhases extends Component {

 

    onFormSubmit = async values => {
        const {handleAddPhase, task} = this.props

  
       await handleAddPhase(values,task)
       console.log('Added phase', task.value.phases)
       

      };



  render() {
    const {task, addPhase,handleSelectPhase, selectedPhaseIndex} = this.props
    //const {} =this.state

    const phases = task&&task.value.phases
    return (
     <div style={{width:"100%", }}>
     <Header> Jobs Phases-      </Header>
         <div  style={{width:"100%", marginBottom:"10px"}}> 
        {phases&&phases.map((phase,index)=>(
            <div  onClick={()=>handleSelectPhase(index)}style={{width:"100%", marginBottom:"5px"}}>
            <label style={{display:"block", backgroundColor: selectedPhaseIndex===index? "green": "grey", color:"white", width:"100%", fontSize:"20px"}}>{phase.phaseName}</label>
            </div>
        ))}
      </div>
      <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
      <Form.Group inline> <Field
              name="phaseName"
              type="text"
              placeholder="Name phase..."
              component={TextInput}
            /> 

<Button
           //   disabled={invalid || submitting}
              positive
         //     loading={loading}
              type="submit"
            >
              Add Phase
            </Button>
            </Form.Group> 
      </Form>

      </div> 
    )
  }
}






export default 

      reduxForm({ form: "phaseForm", enableReinitialize: true })(
        TaskPhases
      )
    
  
  