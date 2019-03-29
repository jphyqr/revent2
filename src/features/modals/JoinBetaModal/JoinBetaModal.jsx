import React, { Component } from "react";
import { Modal, Form, Button, Divider } from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { joinBeta } from "../../user/userActions";
import { connect } from "react-redux";

import { Field, reduxForm } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import SelectInput from "../../../app/common/form/SelectInput";
const actions = {
  closeModal,
  joinBeta
};

const mapState = state => {
  return {
    loading: state.async.loading
  };
};
const levelsOfInterest = [
    { key: "alpha", text: "Alpha Request", value: "alpha" },
    { key: "beta", text: "Beta Request", value: "beta" },
    { key: "launch", text: "Launch Notification", value: "launch" },
    { key: "followUp", text: "Follow Up", value: "followUp" }
  ];


const salesPeople = [
  { key: "joshdonelly", text: "Josh Donelly", value: "Josh Donelly" },
  { key: "frasierparry", text: "Frasier Parry", value: "Fraisier Parry" },
  { key: "roeborgman", text: "Roe Borgman", value: "Roe Borgman" },
  { key: "ericwijicowski", text: "Eric Wijicowski", value: "Eric Wijicowski" },
  { key: "dallenkeen", text: "Dallen Keen", value: "Dallen Keen" },
  { key: "samvarao", text: "Sam Varao", value: "Sam Varao" },
  { key: "other", text: "other", value: "other" },
]
class JoinBetaModal extends Component {
  render() {
    const { closeModal, loading, joinBeta } = this.props;
    return (
      <Modal closeIcon="close" open={true} onClose={closeModal}>
        <Modal.Header>Join Beta</Modal.Header>
        <Modal.Content style={{width:400}}>
          <Modal.Description>
            <Form onSubmit={this.props.handleSubmit(joinBeta)}>
            <Field
                name="salesperson"
                type="text"
                component={SelectInput}
                options={salesPeople}
                placeholder="Sales Person"
              />
                            <Field
              
              name="email"
              type="text"
              component={TextInput}
              placeholder="Email"
            />
            <Divider></Divider>
              <Field
              
                name="name"
                type="text"
                component={TextInput}
                placeholder="Name"
              />
              <Field
              
                name="company"
                type="text"
                component={TextInput}
                placeholder="Company"
              />
                            <Field
              
                name="role"
                type="text"
                component={TextInput}
                placeholder="Role"
              />
              <Field
              
                name="industry"
                type="text"
                component={TextInput}
                placeholder="Industry"
              />
              <Field
                name="interest"
                type="text"
                component={SelectInput}
                options={levelsOfInterest}
                placeholder="Level of Interest"
              />


              <Field
              
                name="phone"
                type="text"
                component={TextInput}
                placeholder="Phone"
              />
              <Field
              
                name="notes"
                type="text"
                component={TextInput}
                placeholder="Notes"
              />

              

              <Button
                loading={loading}
                size="large"
                positive
                content="Join Beta"
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default connect(
  mapState,
  actions
)(reduxForm({ form: "joinBetaForm", enableReinitialize: true })(JoinBetaModal));
