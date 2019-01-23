import React, { Component } from 'react'
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import {  Form, Button, Grid, Header } from "semantic-ui-react";
import {
    composeValidators,
    combineValidators,
    isRequired,
    hasLengthGreaterThan
  } from "revalidate";

  import TextInput from "../../../../app/common/form/TextInput";
import RadioInput from '../../../../app/common/form/RadioInput'
import TextArea from "../../../../app/common/form/TextArea";
import Checkbox from "../../../../app/common/form/Checkbox";
import PhotoUpload from '../../../../app/common/form/PhotoUpload/PhotoUpload'

const validate = combineValidators({
    name: isRequired({ message: "Name the phase" }),
    duration: isRequired({ message: "How many business days to complete the phase?" }),
    

  });


 class ContractForm extends Component {

    componentDidMount() {
        this.setState({ phases: (this.props.task&&this.props.task.phases) || [] });
      }

    onFormSubmit = async values => {
        console.log('contract form submitted')
        const {initialValues, updateContractPhases, task} = this.props
            const currentPhases = this.state.phases
         //   currentPhases = this.
     //  await this.setState({phases:[...this.state.phases, values]})
  
        await this.props.handlePhasesUpdated(values)
       

      };


  render() {
      const {invalid, submitting, pristine, loading} = this.props
    return (
      <div >
        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
        <Form.Group inline>
        <Field
              name="name"
              type="text"
              placeholder="Payment phase..."
              component={TextInput}
            /> 
                    <Field
              name="duration"
              type="text"
              placeholder="# business days required"
              component={TextInput}
            /> 
        </Form.Group>
        <Field
              name="prior"
              type="text"
              placeholder="Prior to work start conditions..."
              component={TextArea}
              rows={1}
            /> 

<Field
              name="scope"
              type="text"
              placeholder="Scope of work included ..."
              component={TextArea}
              rows={1}
            /> 
            <Field
              name="excluded"
              type="text"
              placeholder="Work not included..."
              component={TextArea}
              rows={1}
            /> 
                                    <Field
              name="backcharges"
              type="text"
              placeholder="Backcharges..."
              component={TextArea}
              rows={1}
            /> 
                        <Field
              name="finish"
              type="text"
              placeholder="End of work site conditions expected..."
              component={TextArea}
              rows={1}
            /> 



                        <Button
              disabled={invalid || submitting}
              positive
              loading={loading}
              type="submit"
            >
              Add Phase
            </Button>
        </Form>
      </div>
    )
  }
}




export default 
    connect(
      null,
      null
    )(
      reduxForm({ form: "contractPhaseForm", enableReinitialize: true, validate })(
        ContractForm
      )
    )
  ;
  