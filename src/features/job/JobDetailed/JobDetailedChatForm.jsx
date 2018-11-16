import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import TextArea from "../../../app/common/form/TextArea";

class JobDetailedChatForm extends Component {
    handleCommentSubmit = values => {
        const {addJobComment, reset, jobId, closeForm, parentId} = this.props;
        addJobComment(jobId, values, parentId);
        reset();
        if(parentId!== 0){
          closeForm();
        }
    }
  render() {
    return (
      <Form onSubmit={this.props.handleSubmit(this.handleCommentSubmit)}>
        <Field 
        name='jobcomment'
        type='text'
        component={TextArea}
        rows={2}
        />
        <Button content="Add Reply" labelPosition="left" icon="edit" primary />
      </Form>
    );
  }
}

export default reduxForm({Fields: 'jobcomment'})(JobDetailedChatForm);
