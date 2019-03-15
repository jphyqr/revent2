import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Form, Button } from "semantic-ui-react";
import TextArea from "../../../../app/common/form/TextArea";
import { connect } from "react-redux";

const mapState = state => {
  return {
    initialValues: state.quote
  };
};

class Notes extends Component {
  onFormSubmit = async values => {
    await this.props.handleUpdateNotes(values);
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
          <Field
            key="notes"
            type="text"
            name="notes"
            component={TextArea}
             rows={15}
            placeholder="Add any notes about your Quote"
          />
          <Button positive type="submit">
            Next
          </Button>
        </Form>
      </div>
    );
  }
}

export default connect(
  mapState,
  null
)(reduxForm({ form: "notesForm", enableReinitialize: true })(Notes));
