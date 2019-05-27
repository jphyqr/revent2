import React, { Component } from 'react'
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import {Button, Form} from 'semantic-ui-react'
import TextInput from "../../../app/common/form/TextInput";


 class NewSpecForm extends Component {

    handleSubmit = async values => {
        await this.props.handleSpecSubmit(values);
       // await this.props.setRole( this.props.role.isAdmin, this.props.role.isOnboarder, true)
        this.setState({ showSuccess: true });
      };


    render() {
        return (
            <div>
               <Form
                  style={{ margin: "5px" }}
                  onSubmit={this.props.handleSubmit(this.handleSubmit)}
                >
             
                <Form.Group inline>
                    
                <Field
                    name="specName"
                    type="text"
                    component={TextInput}
                    placeholder="Spec Name"
                  />

                  <Button
                    fluid
                    size="large"
                    positive
                    content={"Add Spec"}
                  />   
                    
                    
                    </Form.Group>  
                </Form>     
            </div>
        )
    }
}



export default connect(
    null,
    null
  )(reduxForm({ form: "newSpecForm", enableReinitialize: true })(NewSpecForm));
  