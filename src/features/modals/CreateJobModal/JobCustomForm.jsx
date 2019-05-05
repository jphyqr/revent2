import React, { Component } from 'react'
import TextInput from "../../../app/common/form/TextInput";
import { reduxForm, Field } from "redux-form";
import ExamplePhotoSlider from "../../../app/common/form/PhotoUpload/ExamplePhotoSlider";
import SelectInput from "../../../app/common/form/SelectInput";
import PhotoUpload from "../../../app/common/form/PhotoUpload/PhotoUpload";
import RadioInput from "../../../app/common/form/RadioInput";
import TextArea from "../../../app/common/form/TextArea";
import PlaceInput from "../../../app/common/form/PlaceInput";
import BlankInput from "../../../app/common/form/BlankInput";
import DateInput from "../../../app/common/form/DateInput";
import {Form, Grid, Image, Label, Button} from 'semantic-ui-react'
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan,
  isNumeric,
  isAlphabetic
} from "revalidate";

const validate = combineValidators({
  label: isRequired({ message: "Pleaes provide a label" }),
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
    isRequired({ message: "Max Length is Required" }),
    isAlphabetic({ message: "Should be Alphabetic" })
  )(),
  rows: composeValidators(
    isRequired({ message: "Rows Required" }),
    isNumeric({ message: "Should be Numeric" })
  )()
});

class JobCustomForm extends Component {


  onFormSubmit = async values => {
 
    await this.props.updateJobCustom(this.props.draft, values);

  };


  render() {
    const {draft} = this.props ||{}
    const {value:draftValue} =draft ||{}
    const {fields} = draftValue ||[]


 
    return (
      <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
      {fields &&
        fields.map(
          (
            {
              example,
              component,
              examplePhotos,
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
      

              <Grid>
                <Grid.Column width={12}>
                  {" "}
                  <Field
                    key={index}
                    name={name}
                    type={component.type}
                    placeholder={label}
                    options={selectItems}
                    photos={examplePhotos}
                    aboveMessage={aboveMessage}
                    //      value={this.state.required}
                    //   onClick={this.handleChange}
                    label={label}
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
                        ? BlankInput
                        : component.component === "PlaceInput"
                        ? PlaceInput
                        : component.component === "DateInput"
                        ? DateInput
                        : null
                    }
                  />



                </Grid.Column>





              </Grid>
            </div>
             
          )
        )}



<Button
           //  disabled={(invalid || submitting || (pristine&&!fieldChanged))}
            positive
        //    loading={loading}
            type="submit"
          >
            Submit
          </Button>
    </Form>
    )
  }
}



export default reduxForm({
  form: "jobCustomForm",
  enableReinitialize: true,
  validate
})(JobCustomForm);
