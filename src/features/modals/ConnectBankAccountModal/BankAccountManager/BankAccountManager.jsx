import React, { Component } from "react";
import { connect } from "react-redux";
import { injectStripe } from "react-stripe-elements";
import { compose } from "redux";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import VerificationDocumentUpload from "./VerificationDocumentUpload";
import AccountProgress from "./AccountProgress";
import SelectCountryForm from "../SelectCountryForm";

import axios from "axios";
import _ from "lodash";
import {
  getAccount,
  updateAccount,
  addBankAccount,
  updateTOS,
  createConnectedAccount,
  
} from "./accountActions";
import {
  Dimmer,
  Loader,
  Button,
  Header,
  Form,
  Label,
  Icon,
  Input,
  Step,
  Message
} from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import TextInput from "../../../../app/common/form/TextInput";

import BankAccountForm from "../../../../app/common/form/BankAccountForm";
import { Elements } from "react-stripe-elements";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import UserAgreementForm from "./UserAgreementForm";
const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

const actions = {
  getAccount,
  updateAccount,
  addBankAccount,
  updateTOS,
  createConnectedAccount
};

const mapState = state => {
  const fieldsNeeded =
    state.account &&
    state.account.verification &&
    state.account.verification.fields_needed;
  let showCountrySelect = false;
  let showTOS = false;
  let showBankForm = false;
  let showInfo = false;
  let showComplete = false;
  console.log('map state account' ,state.account)
  if ( !state.account|| state.account === undefined || state.account.length === 0 ) {
    console.log("setting sghowCountrySelect True")
    showCountrySelect = true;
    showTOS = false;
    showBankForm = false;
    showInfo = false;
    showComplete = false;
  } else if (
    fieldsNeeded &&
    (fieldsNeeded.includes("tos_acceptance.date") ||
      fieldsNeeded.includes("tos_acceptance.ip"))
  ) {
    showTOS = true;

    showBankForm = false;
    showInfo = false;
    showComplete = false;
    showCountrySelect = false;
  } else if (fieldsNeeded && fieldsNeeded.includes("external_account")) {
    showTOS = false;

    showInfo = false;
    showComplete = false;
    showBankForm = true;
    showCountrySelect = false;
  } else if (fieldsNeeded && fieldsNeeded.length > 0) {
    showInfo = true;
    showTOS = false;

    showComplete = false;
    showBankForm = false;
    showCountrySelect = false;
  } else {
    showComplete = true;
    showTOS = false;

    showInfo = false;
    showBankForm = false;
    showCountrySelect = false;
  }

  return {
    loading: state.async.loading,
    account: state.account,
    fieldsNeeded:
      state.account &&
      state.account.verification &&
      state.account.verification.fields_needed,
    userUID: state.firebase.auth.uid,
    showTOS,
    showBankForm,
    showInfo,
    showComplete,
    showCountrySelect
  };
};

const validate = combineValidators({
  // "legal_entity.dob.day": isRequired({ message: "DAY is required" }),
  // "legal_entity.dob.month": isRequired({ message: "MONTH is required" }),
  // "legal_entity.dob.year": isRequired({ message: "YEAR is required" }),
  // "legal_entity.first_name": isRequired({ message: "First Name is required" }),
  // "legal_entity.last_name": isRequired({ message: "Last Name is required" }),
  // "legal_entity.type": isRequired({
  //   message: "Entity Type ('Individual' or 'Business') is required"
  // }),
  // "tos_acceptance.date": isRequired({ message: "TOS required" }),
  // "tos_acceptance.ip": isRequired({ message: "TOS required" }),
  // description: composeValidators(
  //   isRequired({ message: "Please enter a description" }),
  //   hasLengthGreaterThan(4)({
  //     message: "Description needys to be at least 5 characters"
  //   })
  // )(),
  // city: isRequired("city"),
  // venue: isRequired("venue"),
  // date: isRequired("date")
});

class BankAccountManager extends Component {
  state = {
    showTOS: false,
    showBankForm: false,
    showInfo: false,
    showComplete: false,
    showCountrySelect: false
  };



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
      pristine,
      addBankAccount,
      updateTOS,
      getAccount,
      showTOS,
      showBankForm,
      showInfo,
      showComplete,
      showCountrySelect,
      createConnectedAccount,
      userUID
    } = this.props;

    const countryOptions = [
      { key: "ca", value: "CA", flag: "ca", text: "Canada" }
    ];

    if (!isLoaded(accountToken)) {
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
        <AccountProgress
          showTOS={showTOS}
          showBankForm={showBankForm}
          showInfo={showInfo}
          showComplete={showComplete}
          showCountrySelect={showCountrySelect}
        />
        {loading  ? (
                       <Dimmer active inverted>
                       <Loader content="Connecting to Stripe" />
                     </Dimmer>
        ) : showCountrySelect ? (
          <SelectCountryForm
            countryOptions={countryOptions}
            createConnectedAccount={createConnectedAccount}
            userUID={userUID}
          />
        ) : showTOS ? (
          <div>
            <UserAgreementForm
              updateTOS={() => updateTOS(accountToken.value)}
            />
          </div>
        ) : showBankForm ? (
          <Elements>
            <BankAccountForm
              accountToken={accountToken}
              addBankAccount={addBankAccount}
              getAccount={getAccount}
            />
          </Elements>
        ) : showInfo ? (
          <div>
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              {fieldsNeeded &&
                fieldsNeeded.length > 0 &&
                fieldsNeeded.map(fieldKey => {
                  if (fieldKey === "legal_entity.verification.document") {
                    return (
                      <Elements>
                        <VerificationDocumentUpload
                          accountToken={accountToken}
                        />
                      </Elements>
                    );
                  } else {
                    return (
                      <Field
                        name={fieldKey}
                        type={fieldKey}
                        component={TextInput}
                        placeholder={fieldKey}
                      />
                    );
                  }
                })}

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
        ) : (
          <div>
            <Message
              success
              header="You account is set up"
              content="However, you may be notified if Stripe requires more information such as photo validation."
            />
         
          </div>
        )}
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
