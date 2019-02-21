import React, { Component } from "react";
import { Accordion , Message, Button, Checkbox} from "semantic-ui-react";

import { objectToArray } from "../../../app/common/util/helpers";
class JobContractForm extends Component {

state={checkedContract:false}


  expandPhase = phase => {
    console.log("expandPhase", phase);



    let panels = [];
    //get the titles of the fieldTitles
    for (var i = 0; i < (phase.sectionsIncluded&&phase.sectionsIncluded.length); i++) {
     
      panels.push({
        key: i,
        title: phase.sectionsIncluded[i].sectionName,
        content: {content: this.expandSection(phase.sectionsIncluded[i])}
      });
    }



    console.log({ panels });

      return (<div>

     <Accordion panels={panels}  />
      </div>

    )
  };


  expandSection = section => {

    console.log("expand Section", section);



    let sectionPanels = [];
    //get the titles of the fieldTitles
    for (var i = 0; i < (section.clausesIncluded&&section.clausesIncluded.length); i++) {
     
      sectionPanels.push({
        key: i,
        title: section.clausesIncluded[i].clause,
        content: section.clausesIncluded[i].clause
      });
    }



    console.log({ sectionPanels });

      return (<div>

     <Accordion panels={sectionPanels}  />
      </div>

    )
  }

toggleContract=()=> this.setState({checkedContract: !this.state.checkedContract})

  render() {
    const { draft } = this.props;
    const { value: draftValues } = draft;
    const { phases } = draftValues;
    console.log({ phases });
    const rootPanels = [];

    for (var i = 0; i < phases.length; i++) {
      const phase = phases[i];
      console.log({ phase });
      rootPanels.push({
        key: phase.name,
        title: `Phase ${i+1}: ${phase.phaseName}`,
        content: {content: this.expandPhase(phase)}
      });
    }

    console.log({ rootPanels });
    return (
    <div>
      
      <Message>Review the General Contracting Agreement.  The agreement is not subject to any change orders.  </Message>
      <div style={{height: 400, overflowY:"auto"}}>
    <Accordion defaultActiveIndex={0} panels={rootPanels} />
   </div>

   <Checkbox  label="I accept the General Contracting Agreement" onChange={this.toggleContract} checked={this.state.checkedContract}/>
    <br></br>
    <Button onClick={()=>this.props.updateJobContract(this.props.draft)}disabled={!this.state.checkedContract}>Next</Button>
    </div>
    )
  }
}

export default JobContractForm;
