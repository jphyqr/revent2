import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import {
  composeValidators,
  combineValidators,
  isRequired,
  isNumeric,
  hasLengthGreaterThan,
  hasLengthBetween
} from "revalidate";
import { Segment, Form, Button, Grid, Header ,} from "semantic-ui-react";
import TextInput from "../../../../app/common/form/TextInput";
import SelectInput from "../../../../app/common/form/SelectInput";
import RadioInput from "../../../../app/common/form/RadioInput";
const validate = combineValidators({
    "country": isRequired({ message: "Select a Country" }),
  "currency": isRequired({ message: "Select a currency" }),
  "account_holder_type": isRequired({ message: "Select an entity type" }),
  "account_holder_name": isRequired({ message: "Enter the Name on the account" }),

  "account_number": composeValidators(
    isRequired({ message: "Account Number Required" }),
    isNumeric({ message: "Should be Numeric" }),
    hasLengthBetween(7, 12)({
      message: "Account Number must be 7-12 numbers long"
    })
  )(),
  "institution_number": composeValidators(
    isRequired({ message: "Institution Number Required" }),
    isNumeric({ message: "Should be Numeric" }),
    hasLengthBetween(3, 3)({
      message: "Institution Number must be 3 numbers long"
    })
  )(),
  "transit_number": composeValidators(
    isRequired({ message: "Transit Number Required" }),
    isNumeric({ message: "Should be Numeric" }),
    hasLengthBetween(5, 5)({
      message: "Transit Number must be 5 characters long"
    })
  )()
});



const countries = [
    { key: "canada", text: "Canada", value: "CA" }
  ];

  const currencies = [
    { key: "canadian", text: "CAD$", value: "CAD" }
  ];

class NewBankAccountForm extends Component {


    onFormSubmit = async values => {

console.log('form values', values)
const routing_number = {routing_number: `${values.transit_number}-${values.institution_number}`}

const newValues = {...values, ...routing_number}


let {transit_number, ...noTransitNumber} = newValues
let {institution_number, ...noInstritutionNumber} = noTransitNumber

        let result = await this.props.addBankAccount(noInstritutionNumber, this.props.accountToken)
        console.log(' bank acount form', result)
        console.log('Bank acount added, about to get account... see if hit')
        let getAccount = await this.props.getAccount(this.props.accountToken.value)
        console.log({getAccount})
      };


  render() {
    const {
      accountToken,
      addBankAccount,
      getAccount,
      invalid,
      submitting,
      pristine
    } = this.props;
    return (
      <Grid>
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Bank Account Details" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field
                name="country"
                type="text"
                component={SelectInput}
                placeholder="Country"
                options={countries}
              />
              <Field
                name="currency"
                type="text"
                component={SelectInput}
                placeholder="Currency"
                options={currencies}
              />
              <Form.Group inline>
              <label> Transit Number: </label>
              <Field
                name="transit_number"
                type="text"
                component={TextInput}
                maxlength="5"
                placeholder="00000"
              />
              <label> Institution Number: </label>
                        <Field
                name="institution_number"
                type="text"
                maxlength="3"
                component={TextInput}
                placeholder="000"
              />
              </Form.Group>
    

              <Field
                name="account_number"
                type="text"
                maxlength="12"
                component={TextInput}
                placeholder="Account Number"
              />
              <Field
                name="account_holder_name"
                type="text"
                component={TextInput}
                placeholder="Account Holder Full Name"
              />
       


          <Form.Group inline>
          <label> Entity: </label>
            <Field
              name="account_holder_type"
              type="radio"
              value="individual"
              label="Individual"
              component={RadioInput}
            />
                        <Field
              name="account_holder_type"
              type="radio"
              value="company"
              label="Company"
              component={RadioInput}
            />
          </Form.Group>



              <Button
                disabled={invalid || submitting || pristine}
                positive
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default reduxForm({
  form: "newBankAccountForm",
  enableReinitialize: true,
  validate
})(NewBankAccountForm);
