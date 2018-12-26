import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { isLoaded } from "react-redux-firebase";

import VerificationDocumentUpload from "./VerificationDocumentUpload";
import AccountProgress from "./AccountProgress";
import SelectCountryForm from "../SelectCountryForm";
import moment from "moment";


import {
  getAccount,
  updateAccount,
  addBankAccount,
  updateTOS,
  createConnectedAccount
} from "./accountActions";
import { Dimmer, Loader, Button, Form, Message } from "semantic-ui-react";
import { reduxForm, Field } from "redux-form";
import TextInput from "../../../../app/common/form/TextInput";
import RadioInput from "../../../../app/common/form/RadioInput";
import SelectInput from "../../../../app/common/form/SelectInput";
import DateInput from "../../../../app/common/form/DateInput";


import NewBankAccountForm from "./NewBankAccountForm";
import { Elements } from "react-stripe-elements";
import {
  composeValidators,
  combineValidators,
  isRequired,
  isNumeric,
  matchesPattern,
  hasLengthBetween
} from "revalidate";
import UserAgreementForm from "./UserAgreementForm";

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
  if (
    !state.account ||
    state.account === undefined ||
    state.account.length === 0
  ) {
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

const provinces = [
  { key: "AB", text: "Alberta", value: "AB" },
  { key: "BC", text: "British Columbia", value: "BC" },
  { key: "MB", text: "Manitoba", value: "MB" },
  { key: "NL", text: "Newfoundland", value: "NL" },
  { key: "NS", text: "Nova Scotia", value: "NS" },
  { key: "NT", text: "North West Territories", value: "NT" },
  { key: "NU", text: "Nunavit", value: "NU" },
  { key: "ON", text: "Ontario", value: "ON" },
  { key: "PE", text: "Prince Edward Island", value: "PE" },
  { key: "QC", text: "Quebec", value: "QC" },
  { key: "SK", text: "Saskatchewan", value: "SK" },
  { key: "YT", text: "Yukon", value: "YT" }
];


const STRIPE_FIELD_NAMES = {
  "legal_entity.address.city" : "Applicants City",
  "legal_entity.address.line1" : "Applicants Street Address",
  "legal_entity.address.postal_code" : "Applicants Postal Code",
  "legal_entity.personal_id_number" : "Social Insurance Number",
  "legal_entity.first_name" : "Applicants First Name",
  "legal_entity.last_name" : "Applicants Last Name",
  "account_holder_name.address.city" : "Applicants City",

}

const validate = combineValidators({
  "legal_entity.dob": isRequired({ message: "Date of Birth is required" }),
  "legal_entity.first_name": isRequired({ message: "First Name is required" }),
  "legal_entity.address.city": isRequired({ message: "City is Required" }),

  "legal_entity.personal_id_number": composeValidators(
    isRequired({ message: "Social Insurance Number Required" }),
    isNumeric({ message: "Should be Numeric" }),
    hasLengthBetween(9, 9)({
      message: "Social Insurance Number must be 9 characters long"
    })
  )(),

  "legal_entity.address.line1": isRequired({
    message: "Street Address is Required"
  }),
  "legal_entity.address.state": isRequired({ message: "Province is Required" }),
  "legal_entity.last_name": isRequired({ message: "Last Name is required" }),
  "legal_entity.type": isRequired({
    message: "Entity Type ('Individual' or 'Business') is required"
  }),
  "tos_acceptance.date": isRequired({ message: "TOS required" }),
  "tos_acceptance.ip": isRequired({ message: "TOS required" }),
  "legal_entity.address.postal_code": composeValidators(
    isRequired({ message: "Please enter a postal code" }),
    matchesPattern(/([ABCEGHJKLMNPRSTVWXYZ]\d){3}/i)({
      message: "Postal code must match A#A#A# format"
    })
  )(),
  city: isRequired("city"),
  venue: isRequired("venue"),
  date: isRequired("date")
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
    let valuesToSubmit = values;
    if (values.legal_entity.dob) {
      let dob = values.legal_entity.dob;


      valuesToSubmit = {
        legal_entity: {
          dob: { year: dob.year(), month: dob.month() + 1, day: dob.date() },
          first_name: values.legal_entity.first_name,
          last_name: values.legal_entity.last_name,
          type: values.legal_entity.type
        }
      };
    }

    let account = await this.props.updateAccount(
      this.props.accountToken.value,
      valuesToSubmit
    );

   
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
        {loading ? (
          <Dimmer active inverted>
            <Loader content="Connecting to Stripe" />
          </Dimmer>
        ) : showCountrySelect ? (
          <SelectCountryForm
            createConnectedAccount={createConnectedAccount}
            userUID={userUID}
          />
        ) : showTOS ? (
          <div>
            {accountToken && accountToken.value && (
              <UserAgreementForm
                updateTOS={() => updateTOS(accountToken.value)}
              />
            )}
          </div>
        ) : showBankForm ? (
          <Elements>
            <NewBankAccountForm
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
                  } else if (fieldKey === "legal_entity.address.state") {
                    return (
                      <Field
                        name={fieldKey}
                        type={fieldKey}
                        component={SelectInput}
                        options={provinces}
                        placeholder="Select Province"
                      />
                    );
                  } else if (fieldKey.includes("legal_entity.dob.year")) {
                    return (
                      <Field
                        name="legal_entity.dob"
                        type="text"
                        component={DateInput}
                        dateFormat="YYYY-MM-DD"
                        placeholder="Date of Birth"
                        showYearDropdown={true}
                        showMonthDropdown={true}
                        dropdownMode="select"
                        maxDate={moment().subtract(13, "years")}
                      />
                    );
                  } else if (fieldKey.includes("legal_entity.dob.month"))
                    return <div />;
                  else if (fieldKey.includes("legal_entity.dob.day"))
                    return <div />;
                  else if (fieldKey === "legal_entity.type") {
                    return (
                      <Form.Group inline>
                        <label> Entity: </label>
                        <Field
                          name="legal_entity.type"
                          type="radio"
                          value="individual"
                          label="Individual"
                          component={RadioInput}
                        />
                        <Field
                          name="legal_entity.type"
                          type="radio"
                          value="company"
                          label="Company"
                          component={RadioInput}
                        />
                      </Form.Group>
                    );
                  } else if (fieldKey) {
                    return (
                      <Field
                        name={fieldKey}
                        type="text"
                        component={TextInput}
                        placeholder={STRIPE_FIELD_NAMES[fieldKey]}
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
              header="Thats it for now!"
              content="You will be notified if Stripe requires more information."
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
