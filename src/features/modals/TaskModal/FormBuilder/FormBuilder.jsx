import React, { Component } from 'react'
import {Grid} from 'semantic-ui-react'
import {connect} from 'react-redux'
import {selectFieldToEdit} from '../../NewFieldModal/fieldActions'
import FieldsPalette from '../../NewFieldModal/FieldsPalette/FieldsPalette'
import FieldsSlider from '../../NewFieldModal/FieldsSlider/FieldsSlider'
import NewFieldForm from '../../NewFieldModal/NewFieldForm'
import FormDraft from './FormDraft'


const mapState = state => {


  return {
    loading: state.async.loading,
    field: state.field
  };
};


const actions = { selectFieldToEdit
}

 class FormBuilder extends Component {

    state={
        selectedFields:[], selectedField: {}, editField:false
    }

  onDelete = (id)=>{
    console.log('delete', "test")
    this.setState({selectedFields:[...this.state.selectedFields.filter(f=>f.id!==id)]})
  }

  handleSelectField  = async field => {
    console.log({field})
    if(field.label==='New Field'){
      this.setState({fieldLoading:true, editField:true})
      let newField = await this.props.selectFieldToEdit({})
      console.log({newField})
      this.setState({ selectedField: field.value});
      this.setState({fieldLoading:false})
      this.props.toggleEdit(true)
  //    this.forceUpdate()
    }
    else{
      this.setState({fieldLoading:true})
      let newField = await this.props.selectFieldToEdit(field)
      console.log({newField})
      this.setState({ selectedField: field.value, editField:true });
      this.setState({fieldLoading:false})
      this.props.toggleEdit(true)
    //  this.forceUpdate()

    }

  };

  onDrop= (ev, index)=>{
    let j = ev.dataTransfer.getData("j")
    console.log({j})
    let field = JSON.parse(ev.dataTransfer.getData("j"));
    console.log('on drop', field)
    if(field.label==='New Field')
    {

    } else {
        if(index===-1){
          this.setState({selectedFields:[...this.state.selectedFields, field]})
         
        } else {
      console.log('above drop')
      console.log('first', ...this.state.selectedFields.slice(0, index))
      console.log('second', ...this.state.selectedFields.slice( index))
      const stateArray= this.state.selectedFields
          this.setState({selectedFields:[...stateArray.slice(0, index), ...[field],...stateArray.slice(index) ]})
            
         
        }
       
    }
  }
    onDragStart=(ev, field)=>{
      let j = JSON.stringify(field);
      console.log('on drag', j)
      ev.dataTransfer.setData('j', j)
      // if(field.label==='New Field')
      // {

      // } else {
    
      //     this.setState({selectedFields:[...this.state.selectedFields, field]})
      //     console.log('handleSelectField force update', this.state.selectedFields)
       
      // }
    }


     

  


  render() {
      const {task} = this.props
      const {selectedFields, editField} = this.state
    return (
    
        <div>
        <FieldsSlider fields={this.props.fields} onDragStart={this.onDragStart} handleSelectField={this.handleSelectField}/>
 
         {this.props.showEdit ?
         <NewFieldForm toggleEdit={this.props.toggleEdit} selectedField={this.state.selectedField}/>
         :
        <FormDraft task={this.props.task} onDelete={this.onDelete} onDrop={this.onDrop} selectedFields={this.state.selectedFields}/>
      
        
        } 
           
      </div>
    )
  }
}


export default connect(mapState, actions)(FormBuilder)
