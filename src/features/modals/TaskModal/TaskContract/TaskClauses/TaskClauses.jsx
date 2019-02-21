import React, { Component } from 'react'
import {  Form, Button, Grid, Header } from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import TextInput from '../../../../../app/common/form/TextInput'
import TextArea from '../../../../../app/common/form/TextArea'
 class TaskClauses extends Component {


    onFormSubmit = async values => {
         const {handleAddClauseToPhase, sections, task, selectedPhaseIndex, selectedSectionIndex} = this.props
         const selectedSection = sections&&sections[selectedSectionIndex]

  
        await handleAddClauseToPhase(values,task, selectedPhaseIndex, selectedSectionIndex, selectedSection)
    //    console.log('Added phase', task.value.phases)
       

      };


  render() {

    const {task, sections, selectedPhaseIndex, selectedSectionIndex} = this.props
    console.log('TEST ', task)
    //const {} =this.state
    const{value} = task
    const {phases} = value
    const selectedSection = sections&&sections[selectedSectionIndex]

    var searchTerm = selectedSection&&selectedSection.id
    var index = -1;
for(var i = 0, len = task.value.phases[selectedPhaseIndex].sectionsIncluded.length; i < len; i++) {
    if (task.value.phases[selectedPhaseIndex].sectionsIncluded[i].id === searchTerm) {
        index = i;
        break;
    }
}
  

    const indexOfSection = index




    const recommendedClauses= selectedSection&&selectedSection.recommendedClauses
    const selectedPhase = phases&&phases[selectedPhaseIndex]
    const includedClauses = selectedPhase&&selectedPhase.sectionsIncluded&&selectedPhase.sectionsIncluded[indexOfSection]&&selectedPhase.sectionsIncluded[indexOfSection].clausesIncluded
    const section = sections&&sections[selectedSectionIndex]

    console.log({section})
      console.log({selectedPhase})
    const enabled = selectedPhase&&selectedPhase.sectionsIncluded&&selectedPhase.sectionsIncluded.some(e => e.id === (section&&section.id))
    console.log({enabled})
   



   

    return (
        <div style={{width:"100%", }}>
         <Header> {selectedSection&&selectedSection.sectionName}  </Header>

        <Grid>
            <Grid.Column width={8}>
            <Header>Included Clauses</Header>
            {includedClauses&&includedClauses.map((clause, index)=>(
                          <div  style={{width:"100%", marginBottom:"5px"}}>
                          <label style={{display:"block", backgroundColor: "grey", color:"white", width:"100%", fontSize:"20px"}}>{clause.clause}</label>
                           
                           </div>
            ))}
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
      <Form.Group inline> <Field
              name="clause"
              type="text"
              placeholder="Explain condition"
              component={TextInput}
              disabled={!enabled}
            /> 

<Button
              disabled={!enabled}
              positive
         //     loading={loading}
              type="submit"
            >
              Add Clause
            </Button>
            </Form.Group> 
      </Form>
            
            </Grid.Column>
            <Grid.Column width={8}>
            <Header>Suggested Clauses</Header>
            {recommendedClauses&&recommendedClauses.map((clause,index)=>(
                     <div  style={{width:"100%", marginBottom:"5px"}}>
                     <label style={{display:"block", backgroundColor:  "whiteSmoke", color:"green", width:"100%", fontSize:"20px"}}>{clause}</label>
                     </div>    
            ))}
            </Grid.Column>
        </Grid>


      </div>
    )
  }
}


export default 

      reduxForm({ form: "clauseForm", enableReinitialize: true })(
        TaskClauses
      )
    