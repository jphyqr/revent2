//OLD MESSAGE

import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import TextArea from "../../../../app/common/form/TextArea";
import { messageUser } from "../../userActions";
import { connect } from "react-redux";

const actions = {
  messageUser
};

class UserDirectMessageForm extends Component {
  handleCommentSubmit = async values => {
    const {
      addDirectMessage,
      reset,
      selectedMessage,
      messageUser
    } = this.props;
    addDirectMessage(selectedMessage.id, values);

    messageUser(selectedMessage);
    reset();
  };
  render() {
    return (
      <Form onSubmit={this.props.handleSubmit(this.handleCommentSubmit)}>
        <Field name="comment" type="text" component={TextArea} rows={1} />
        <Button content="Add Reply" labelPosition="left" icon="edit" primary />
      </Form>
    );
  }
}

export default connect(
  null,
  actions
)(reduxForm({ Fields: "directmessage" })(UserDirectMessageForm));
