import React, { Component } from "react";
import { Form, Button, Grid, Header, Checkbox } from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import TextInput from "../../../../../app/common/form/TextInput";

class TaskSections extends Component {

  state={stateSelectedIndex:-1, statePhaseIndex:0, selectedPhase:{}}


  componentDidMount(){
  const {selectedPhase} = this.props
    this.setState({ selectedPhase: selectedPhase });
  }
  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedPhase !== this.state.selectedPhase) {
      this.setState({ selectedPhase: nextProps.selectedPhase });
    }
 
    
    console.log("nxtProps", nextProps);
    if (nextProps.selectedSectionIndex !== this.state.stateSelectedIndex) {
      this.setState({ stateSelectedIndex: nextProps.selectedSectionIndex });
    }

    if (nextProps.selectedPhaseIndex !== this.state.statePhaseIndex) {
      this.setState({ statePhaseIndex: nextProps.selectedPhaseIndex, stateSelectedIndex: nextProps.selectedSectionIndex });
      const selectedPhase = nextProps.task.value.phases[nextProps.selectedPhaseIndex];
      this.setState({selectedPhase: selectedPhase})
   
    }
  
    
  };


  onFormSubmit = async values => {
    //   const {handleAddPhase, task} = this.props
    //   await handleAddPhase(values,task)
    //    console.log('Added phase', task.value.phases)
  };

  render() {
    const {
      task,
      handleSelectSection,
      selectedPhaseIndex,
      selectedSectionIndex,
      sections,
      handleAddSection,
      handleRemoveSection
    } = this.props;

    const {stateSelectedIndex, statePhaseIndex, selectedPhase} = this.state
    //const {} =this.state
    const { value } = task;
    const { phases } = value;
  

    let highestSelectedIndex = 0;
    let idOfHighest;
    console.log({ idOfHighest });
    if (selectedPhase && selectedPhase.sectionsIncluded && selectedPhase.sectionsIncluded.length>0)
      idOfHighest = selectedPhase.sectionsIncluded[0].id;

    for (var i = 0; i < (sections && sections.length); i++) {
      if (sections[i].id === idOfHighest) {
        highestSelectedIndex = i;
      //  handleSelectSection(highestSelectedIndex);
      }
    }

    console.log({ selectedPhase });
    return (
      <div style={{ width: "100%" }}>
        <Header> {selectedPhase && selectedPhase.phaseName} Sections </Header>
        <div style={{ width: "100%", marginBottom: "10px" }}>
          {sections &&
            sections.map((section, index) => (
              <div
              
                onClick={(selectedPhase &&
                  selectedPhase.sectionsIncluded &&
                  selectedPhase.sectionsIncluded.some(
                    e => e.id === section.id
                  )) ? () => handleSelectSection(index, section) : ()=>{}}
                style={{ width: "100%", marginBottom: "5px" }}
              >
                <label
                  style={{
                    opacity: stateSelectedIndex === index ? "1" : "0.4",
                    display: "block",
                    backgroundColor:                   
                      selectedPhase &&
                      selectedPhase.sectionsIncluded &&
                      selectedPhase.sectionsIncluded.some(
                        e => e.id === section.id
                      ) ? "blue" : "grey"
                    ,
                    color: "white",
                    width: "100%",
                    fontSize: "20px"
                  }}
                >
                  {section.sectionName}
                </label>

            
                  
                  {
                    selectedPhase &&
                    selectedPhase.sectionsIncluded &&
                    selectedPhase.sectionsIncluded.some(
                      e => e.id === section.id
                    ) ? <Button onClick={()=>handleRemoveSection(section, task, selectedPhaseIndex)}>Remove Section</Button> : <Button onClick={()=>handleAddSection(section, task, selectedPhaseIndex, index)}>Include Section</Button>
                  }
               
              </div>
            ))}
        </div>
        {/* <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
      <Form.Group inline> <Field
              name="sectionName"
              type="text"
              placeholder="Name section..."
              component={TextInput}
            /> 

<Button
         
              positive
     
              type="submit"
            >
              Add Section
            </Button>
            </Form.Group> 
      </Form> */}
      </div>
    );
  }
}

export default reduxForm({ form: "sectionForm", enableReinitialize: true })(
  TaskSections
);
