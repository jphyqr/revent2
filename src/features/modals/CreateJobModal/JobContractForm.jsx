import React, { Component } from "react";
import { Accordion , Message, Button, Checkbox} from "semantic-ui-react";

import { objectToArray } from "../../../app/common/util/helpers";
class JobContractForm extends Component {

state={checkedContract:false}


  expandPhase = phase => {
    console.log("expandPhase", phase);
    const array = objectToArray(phase);
    console.log("expandedPhase object", array);
    let fieldTitles = [];
    //get the titles of the fieldTitles
    for (var i = 0; i < array.length; i++) {
      if (array[i].id !== "name") {
        fieldTitles.push(array[i].id);
      }
    }

    console.log({ fieldTitles });

    //loop through field titles, for each title, build panel objects
    let panels = [];
    for (var f = 0; f < fieldTitles.length; f++) {
      panels.push({
        key: f,
        title: fieldTitles[f],
        content: phase[fieldTitles[f]]
      });
    }

    console.log({ panels });

      return (<div>

     <Accordion panels={panels}  />
      </div>

    )
  };

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
        title: `Phase ${i+1}: ${phase.name}`,
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
