import React, { Component } from 'react'
import { Modal, Grid ,Divider} from 'semantic-ui-react';
import { closeModal, openModal } from '../modalActions'
import { connect } from 'react-redux'
import NewFieldForm from './NewFieldForm'
import FieldsPalette from './FieldsPalette/FieldsPalette'
import {withFirestore, isLoaded} from 'react-redux-firebase'
import {selectFieldToEdit, updateField, clearField} from './fieldActions'

const mapState = state => {


  return {
    fields: state.firestore.ordered.fields,
    loading: state.async.loading,
    field: state.field
  };
};


const actions = {
  closeModal, openModal, selectFieldToEdit, updateField
}




 class NewFieldModal extends Component {


state={
  selectedField: {}
}
  handleSelectField  = async field => {

  
      this.setState({fieldLoading:true})
      let newField = await this.props.selectFieldToEdit(field)
      console.log({newField})
      this.setState({ selectedField: this.props.field.payload.value });
      this.setState({fieldLoading:false})
      this.forceUpdate()

    

  };


  handleNewField = async () => {
   
      this.setState({fieldLoading:true})
      let newField = await this.props.selectFieldToEdit({})
      console.log('newFieldModal' ,newField)
      this.setState({ selectedField: this.props.field.payload.value });
      this.setState({fieldLoading:false})
      this.forceUpdate()
    
  }

  async componentDidMount() {
    const { firestore } = this.props;
    await firestore.setListener(`fields`);
  }

  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`fields`);
  }



  render() {
    const {closeModal, openModal,fields, field} = this.props
    return (
      <Modal size="fullscreen" closeIcon="close" open={true} onClose={closeModal}>
      <Modal.Header>Field Manager</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Grid><Grid.Column width={10}>  <NewFieldForm selectedField={this.state.selectedField} /></Grid.Column>
          <Grid.Column width={1}>
    <Divider vertical>Edit</Divider></Grid.Column>
          <Grid.Column width={5}><FieldsPalette  handleNewField={this.handleNewField} handleSelectField={this.handleSelectField} fields={fields}/></Grid.Column>
          </Grid>
        
        </Modal.Description>
      </Modal.Content>
    </Modal>
    )
  }
}




export default withFirestore(connect(mapState, actions)(NewFieldModal));
