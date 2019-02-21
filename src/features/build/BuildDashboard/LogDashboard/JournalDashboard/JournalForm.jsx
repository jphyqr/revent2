import React, { Component } from 'react'
import { Field, reduxForm } from "redux-form";
import {Form, Button} from 'semantic-ui-react'

import TextArea from '../../../../../app/common/form/TextArea'
 class JournalForm extends Component {


  handleSubmit = async values => {
    const {day, dayIndex, auth, addJournalEntry} = this.props
    await addJournalEntry(day, dayIndex, values);
   
  };
  render() {
    return (
      <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
      <Field name="entry" type="text" component={TextArea} rows={2} />
      <Button
        content="Add Entry"
        labelPosition="left"
        icon="edit"
        primary
      />
    </Form>
    )
  }
}




export default reduxForm({ form: `JournalForm` })(JournalForm);
