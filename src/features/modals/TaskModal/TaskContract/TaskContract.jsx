import React, { Component } from "react";
import ContractForm from "./ContractForm";
import { connect } from "react-redux";
import ContractPhaseList from "./ContractPhaseList";
import { Grid } from "semantic-ui-react";
import TaskClauses from "./TaskClauses/TaskClauses";
import TaskPhases from "./TaskPhases/TaskPhases";
import TaskSections from "./TaskSections/TaskSections";
import { withFirestore, isEmpty, isLoaded } from "react-redux-firebase";
import {
  addPhase,
  addClauseToPhase,
  addSectionToPhase,
  removeSectionFromPhase
} from "../taskActions";

const mapState = state => {
  return {
    sections: state.firestore.ordered.sections,
    task: !isEmpty(state.task) && isLoaded(state.task) && state.task
  };
};

const actions = {
  addPhase,
  addClauseToPhase,
  addSectionToPhase,
  removeSectionFromPhase
};

class TaskContract extends Component {
  state = {
    selectedPhaseIndex: -1,
    selectedSectionIndex: -1,
    stateTask: {},
    stateSelectedPhase: {},
    stateSelectedSection: {}
  };

  async componentDidMount() {
    const { task, sections, firestore } = this.props;

    await firestore.setListener(`sections`);
    this.setState({ stateTask: task, selectedSectionIndex: -1 });
    if (task.value.phases && task.value.phases.length > 0) {
      this.setState({
        selectedPhaseIndex: task.value.phases.length - 1,

        stateSelectedPhase: task.value.phases[task.value.phases.length - 1]
      });
    } else this.setState({ selectedPhaseIndex: 0 });

    this.setState({
      selectedSectionIndex: -1
    });
  }

  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`sections`);
  }

  componentWillReceiveProps = nextProps => {
    const { task } = nextProps;
    console.log("TaskContract cwrp nextProps", nextProps);
    console.log("TaskContract cwrp task", this.props.task);
    if (
      task &&
      task.value.phases &&
      task.value.phases.length !== this.props.task.value.phases.length
    ) {
      console.log("list size changed Updated", nextProps);
      this.setState({
        selectedPhaseIndex: nextProps.task.value.phases.length - 1,
        selectedSectionIndex: -1
      });
    }
  };

  handleAddSection = async (section, task, phaseIndex, sectionIndex) => {
    console.log("handleAddSection  section", section);
    console.log("handleAddSection task ", task);
    console.log("handleAddSection task ", sectionIndex);
    let updatedTask = await this.props.addSectionToPhase(
      section,
      task,
      phaseIndex
    );

    this.setState({
      stateTask: updatedTask,
      selectedSectionIndex: (updatedTask.value.phases[phaseIndex].sectionsIncluded.length-1)
    });
    this.forceUpdate();
  };

  handleRemoveSection = async (section, task, phaseIndex) => {
    console.log("handleRemove  section", section);
    console.log("handleRemove task ", task);
    let updatedTask = await this.props.removeSectionFromPhase(
      section,
      task,
      phaseIndex
    );
    this.setState({ stateTask: updatedTask, selectedSectionIndex:-1 });
    this.forceUpdate();
  };

  handleAddPhase = async (values, task) => {
    let updatedTask = await this.props.addPhase(values, task);
    //  this.forceUpdate()
    await this.setState({ stateTask: updatedTask });
    await this.setState({
      selectedPhaseIndex: updatedTask.value.phases.length - 1,
      stateSelectedPhase:
        updatedTask.value.phases[updatedTask.value.phases.length - 1],
      selectedSectionIndex: -1,
      stateSelectedSection: {}
    });
    this.forceUpdate();
  };

  handleAddClauseToPhase = async (
    values,
    task,
    phaseIndex,
    sectionIndex,
    selectedSection
  ) => {
    let updatedTask = await this.props.addClauseToPhase(
      values,
      task,
      phaseIndex,
      sectionIndex,
      selectedSection,
      this.state.selectedSectionIndex,
      this.state.selectedPhaseIndex

    );
    //this.forceUpdate()
    this.setState({ stateTask: updatedTask });
  };

  handleDeletePhaseItem = async index => {
    const current = this.state.currentPhases;
    const length = current.length - 1;
    const percent = 100 / length;
    current.splice(index, 1);
    for (var i = 0; i < current.length; i++) {
      current[i].percent = percent;
    }

    await this.setState({ currentPhases: current });
    await this.props.updateContractPhases(
      this.state.currentPhases,
      this.props.task
    );
  };

  handleSelectSection = (index, selectedSection) => {
    console.log('handleSelectSection', index)
    console.log('handleSelectSection', selectedSection)
    //need to get the actual inded of this selection
    const {task} = this.props


        var searchTerm = selectedSection.id
        var trueIndex = -1;
    for(var i = 0, len = task.value.phases[this.state.selectedPhaseIndex].sectionsIncluded.length; i < len; i++) {
        if (task.value.phases[this.state.selectedPhaseIndex].sectionsIncluded[i].id === searchTerm) {
            trueIndex = i;
            break;
        }
    }
      

        const indexOfSection = trueIndex
        console.log('addClauseToPHase index of section', indexOfSection)

 
        this.setState({ selectedSectionIndex: index ,
    
      stateSelectedSection : task.value.phases[this.state.selectedPhaseIndex].sectionsIncluded[indexOfSection]
    });
  };

  handleSelectPhase = index => {
    const {task} = this.props
    this.setState({ selectedPhaseIndex: index , selectedSectionIndex:-1,
      stateSelectedPhase:
      task.value.phases[index]
    
    });
  };


   isEmpty = (obj) =>{
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

  render() {
    const {
      task,
      addPhase,
      updateContractPhases,
      handleDeletePhaseItem,
      sections
    } = this.props;
    const {
      selectedPhaseIndex,
      selectedSectionIndex,
      stateSelectedPhase,
      stateSelectedSection
    } = this.state;
    const { phases } = task;

    return (
      <div>
        {/* <ContractForm handlePhasesUpdated={this.props.handlePhasesUpdated} task={task} updateContractPhases={updateContractPhases} />
       <ContractPhaseList handleDeletePhaseItem={handleDeletePhaseItem} currentPhases={this.props.currentPhases}/> */}
        <Grid>
          <Grid.Column width={4}>
            <TaskPhases
              handleSelectPhase={this.handleSelectPhase}
              selectedPhaseIndex={selectedPhaseIndex}
              task={task}
              handleAddPhase={this.handleAddPhase}
            />
          </Grid.Column>
          <Grid.Column width={4}>
          {isEmpty(stateSelectedPhase) ? <div>PICK A PHASE</div> :<TaskSections
              handleSelectSection={this.handleSelectSection}
              sections={sections}
              selectedPhaseIndex={selectedPhaseIndex}
              selectedSectionIndex={selectedSectionIndex}
              handleAddSection={this.handleAddSection}
              handleRemoveSection={this.handleRemoveSection}
              task={task}
              selectedPhase={stateSelectedPhase}
            /> }  
          </Grid.Column>
          <Grid.Column width={8}>
          {isEmpty(stateSelectedPhase) ? null : isEmpty(stateSelectedSection) ? <div>SELECT A SECTION</div>: <TaskClauses
              selectedPhaseIndex={selectedPhaseIndex}
              selectedSectionIndex={selectedSectionIndex}
              selectedSection={stateSelectedSection}
              selectedPhase ={stateSelectedPhase}
              task={task}
              sections={sections}
              handleAddClauseToPhase={this.handleAddClauseToPhase}
            />}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default withFirestore(
  connect(
    mapState,
    actions
  )(TaskContract)
);
