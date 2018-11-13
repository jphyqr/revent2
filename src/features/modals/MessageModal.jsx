import React, { Component } from "react";
import { Modal, Image, Form, Button } from "semantic-ui-react";
import { closeModal } from "./modalActions";
import { connect } from "react-redux";
import { addDirectMessage, messageUser } from "../user/userActions";

import { Field, reduxForm } from "redux-form";
import TextArea from "../../app/common/form/TextInput";

const actions = {
  closeModal, addDirectMessage, messageUser
};

class MessageModal extends Component {
  handleCommentSubmit = values => {
    const { reset, messageUser, data , closeModal, addDirectMessage} = this.props;
    console.log({data})
    console.log({values})
    const value = {comment: values.newmessage}
    addDirectMessage(data.id, value);
    messageUser(data)
    closeModal();
  };

  render() {
    const { closeModal, data } = this.props;
    return (
      <Modal closeIcon="close" open={true} onClose={closeModal}>
        <Modal.Header>New Message</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Image wrapped size="small" src={data.photoURL} />
            <Form onSubmit={this.props.handleSubmit(this.handleCommentSubmit)}>
              <Field name="newmessage" type="text" component={TextArea} rows={2} />
              <Button
                content="Send Message"
                labelPosition="left"
                icon="edit"
                primary
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default connect(
  null,
  actions
)(reduxForm({ form: "newmessage" })(MessageModal));
