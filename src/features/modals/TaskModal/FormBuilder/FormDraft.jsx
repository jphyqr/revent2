import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan,
  isNumeric,
  isAlphabetic
} from "revalidate";
import {
  Segment,
  Form,
  Button,
  Grid,
  Header,
  Image,
  Label,
  Icon
} from "semantic-ui-react";
import TextInput from "../../../../app/common/form/TextInput";
import PhotoUpload from "../../../../app/common/form/PhotoUpload/PhotoUpload";
import SelectInput from "../../../../app/common/form/SelectInput";
import Checkbox from "../../../../app/common/form/Checkbox";
import RadioInput from "../../../../app/common/form/RadioInput";
import TextArea from "../../../../app/common/form/TextArea";
import PlaceInput from "../../../../app/common/form/PlaceInput";
import DateInput from "../../../../app/common/form/DateInput";
import DropdownInput from '../../../../app/common/form/DropdownInput'
const validate = combineValidators({
  component: isRequired({ message: "Please provide a component type" }),
  format: isRequired({ message: "Please select a format" }),
  minLength: composeValidators(
    isRequired({ message: "Min Length is Required" }),
    isNumeric({ message: "Should be Numeric" })
  )(),
  maxLength: composeValidators(
    isRequired({ message: "Max Length is Required" }),
    isNumeric({ message: "Should be Numeric" })
  )(),
  name: composeValidators(
    isRequired({ message: "Name is Required" }),
    isAlphabetic({ message: "Should be Alphabetic" })
  )(),
  rows: composeValidators(
    isRequired({ message: "Rows Required" }),
    isNumeric({ message: "Should be Numeric" })
  )()
});

class FormDraft extends Component {
  state = {
    displayFields: []
  };

  componentDidMount() {
    this.setState({ displayFields: this.props.selectedFields });
  }

  componentWillReceiveProps = nextProps => {
    console.log("nxtProps", nextProps);
    if (nextProps.selectedFields !== this.state.displayFields) {
      this.setState({ displayFields: nextProps.selectedFields });
    }

    // this.forceUpdate();
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  render() {
    const { task } = this.props;
    const { displayFields } = this.state;
    return (
      <div
  
        style={{
          height: 500,
          marginBottom: 1,
          marginTop: 5,
          width: "100%",
          backgroundColor: "snowwhite",
          overflowX: "hidden",
          overflowY: "auto",
          position: "relative"
        }}
      >
        <Header> {task && task.value && task.value.string}</Header>

        
          <Form onSubmit={() => console.log("submit")}>
            {displayFields &&
              displayFields.map(
                (
                  {
                    example,
                    component,
                    exampleURL,
                    format,
                    icon,
                    label,
                    maxLength,
                    minLength,
                    name,
                    required,
                    selectItems,
                    aboveMessage,
                    type,
                    id
                  },
                  index
                ) => (
                  <div
                    
                    style={{  backgroundColor: "snowwhite" }}
                  >
                <div  onDragOver={e => this.onDragOver(e)} onDrop={e => this.props.onDrop(e, index)} style={{ marginBottom:10, marginTop:10, border:'dashed 2px lightgrey', backgroundColor:"WhiteSmoke", height:'40px'}}></div>
                

                    <Grid style={{backgroundColor:"green"}}>
                    <Grid.Column width={3}>
                        <Button onClick={() => this.props.onDelete(id)}>X</Button>
                      </Grid.Column>
                      <Grid.Column width={3}>
                      <Label>{name}</Label>
                      </Grid.Column>
                      <Grid.Column width={6}>
                        {" "}
                        <Field
                          key={index}
                          name={name}
                          type={type}
                          placeholder={name}
                          options={selectItems}
                          //      value={this.state.required}
                          //   onClick={this.handleChange}
                          label={name}
                          component={
                            component.component === "TextInput"
                              ? TextInput
                              : component.component === "TextArea"
                              ? TextArea
                              : component.component === "SelectInput"
                              ? SelectInput
                              : component.component === "RadioInput"
                              ? RadioInput
                              : component.component === "PhotoInput"
                              ? PhotoUpload
                              : component.component === "PlaceInput"
                              ? PlaceInput
                              : component.component === "DateInput"
                              ? DateInput
                              : component.component === "DropdownInput"
                              ? DropdownInput
                              : null
                          }
                        />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        {example && <Image size="small" src={exampleURL} />}
                      </Grid.Column>
                    </Grid>
                  </div>
                   
                )
              )}
          </Form>
        

<div       onDragOver={e => this.onDragOver(e)}
        onDrop={e => this.props.onDrop(e, -1)}style={{marginTop:'10px', verticalAlign:'middle', textAlign:'center', fontSize:
        "20px", color:"lightgrey", paddingTop:'50px',border:'dashed 2px lightgrey', height:200, backgroundColor:"WhiteSmoke", }}>Drop Fields</div>
                
      </div>
    );
  }
}

export default reduxForm({
  form: "dynamicForm",
  enableReinitialize: true,
  validate
})(FormDraft);
