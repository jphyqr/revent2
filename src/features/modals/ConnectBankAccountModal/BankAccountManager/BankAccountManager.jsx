import React, { Component } from "react";
import { connect } from "react-redux";
import { injectStripe } from "react-stripe-elements";
import { compose } from "redux";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import axios from "axios";
import { getAccount, updateAccount } from "./accountActions";
import { Dimmer, Loader, Button, Form, Label, Icon } from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import TextInput from "../../../../app/common/form/TextInput";
import Checkbox from "../../../../app/common/form/Checkbox";
import BankAccountForm from "../../../../app/common/form/BankAccountForm";
import { Elements } from "react-stripe-elements";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

const actions = {
  getAccount,
  updateAccount
};

const mapState = state => {
  return {
    loading: state.async.loading,
    account: state.account,
    fieldsNeeded:
      state.account &&
      state.account.verification &&
      state.account.verification.fields_needed,
    auth: state.firebase.auth
  };
};

const validate = combineValidators({
  "legal_entity.dob.day": isRequired({ message: "DAY is required" }),
  "legal_entity.dob.month": isRequired({ message: "MONTH is required" }),
  "legal_entity.dob.year": isRequired({ message: "YEAR is required" }),
  "legal_entity.first_name": isRequired({ message: "First Name is required" }),
  "legal_entity.last_name": isRequired({ message: "Last Name is required" }),
  "legal_entity.type": isRequired({
    message: "Entity Type ('Individual' or 'Business') is required"
  }),
  "tos_acceptance.date": isRequired({ message: "TOS required" }),
  "tos_acceptance.ip": isRequired({ message: "TOS required" }),
  description: composeValidators(
    isRequired({ message: "Please enter a description" }),
    hasLengthGreaterThan(4)({
      message: "Description needs to be at least 5 characters"
    })
  )(),
  city: isRequired("city"),
  venue: isRequired("venue"),
  date: isRequired("date")
});

class BankAccountManager extends Component {
  async componentDidMount() {
    if (this.props.accountToken) {
      console.log("loaded");

      console.log("props account token", this.props.accountToken);
      let account = await this.props.getAccount(this.props.accountToken.value);
      console.log({ account });
    }
  }

  onFormSubmit = async values => {
    console.log("on formSubmit", values);

    let account = await this.props.updateAccount(
      this.props.accountToken.value,
      values
    );
    console.log({ account });
  };

  render() {
    const {
      accountToken,
      loading,
      fieldsNeeded,
      invalid,
      submitting,
      pristine
    } = this.props;

    if (loading || !isLoaded(accountToken)) {
      return (
        <div>
          {" "}
          <Dimmer active inverted>
            <Loader content="Getting Fields.." />
          </Dimmer>
        </div>
      );
    }

    return (
      <div>
        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
          {fieldsNeeded && fieldsNeeded.length === 0 ? (
            <p>all set up</p>
          ) : (
            fieldsNeeded &&
            fieldsNeeded.map(fieldKey => {
              if (fieldKey === "external_account") {
                return (
                  <Elements>
                    <BankAccountForm accountToken={accountToken}/>
                  </Elements>
                );
              }
              return (
                <Field
                  name={fieldKey}
                  type={fieldKey}
                  component={TextInput}
                  placeholder={fieldKey}
                />
              );
            })
          )}

          <Checkbox
            name="TOS"
            label={
              <label>
                I accept{" "}
                <a href="https://stripe.com/ca/connect-account/legal">
                  Revents Service Agreement
                </a>{" "}
                and the{" "}
                <a href="https://stripe.com/ca/connect-account/legal">
                  Stripe Connected Account Agreeement
                </a>
              </label>
            }
          />

          <br />

          <Button
            disabled={invalid || submitting || pristine}
            positive
            loading={loading}
            type="submit"
            content="Submit"
          />
        </Form>
      </div>
    );
  }
}

export default compose(
  connect(
    mapState,
    actions,
    null,
    {
      pure: false
    }
  ),
  reduxForm({ form: "bankAccountForm", enableReinitialize: true, validate })
)(BankAccountManager);
