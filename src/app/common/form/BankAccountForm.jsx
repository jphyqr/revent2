import React, { Component } from "react";

//import { injectStripe } from "react-stripe-elements";
import {connect} from 'react-redux'
import BankAccountSection from "./BankAccountSection";
import {
  BANK_ACCOUNT_FORM_COUNTRY,
  BANK_ACCOUNT_FORM_CURRENCY,
  BANK_ACCOUNT_FORM_ROUTING_NUMBER,
  BANK_ACCOUNT_FORM_ACCOUNT_NUMBER,
  BANK_ACCOUNT_FORM_ACCOUNT_HOLDER_NAME,
  BANK_ACCOUNT_FORM_ACCOUNT_HOLDER_TYPE
} from "./BankAccountSection";

import {addBankAccount} from '../../../features/modals/ConnectBankAccountModal/BankAccountManager/accountActions'
const actions = {
    addBankAccount
}
class BankAccountForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countryValue: "CA",
      currencyValue: "CAD",
      routingNumberValue: "11000-000",
      accountNumberValue: "000123456789",
      accountHolderNameValue: "Jo JO",
      accountHolderTypeValue: "individual"
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onTextboxChange = this.onTextboxChange.bind(this);
  }

  async handleSubmit(ev) {
    ev.preventDefault();
    const {

        countryValue,
        currencyValue,
        routingNumberValue,
        accountNumberValue,
        accountHolderNameValue,
        accountHolderTypeValue,
    } = this.state

    const {accountToken} = this.props

        const params = {
            country:countryValue,
        currency: currencyValue,
        routing_number: routingNumberValue,
        account_number: accountNumberValue,
        account_holder_name: accountHolderNameValue,
        account_holder_type: accountHolderTypeValue
        }

  
        let result = await this.props.addBankAccount(params, accountToken)
    console.log(' bank acount form', result)

  }


  onTextboxChange(e, textboxKey) {
    const value = e.target.value;
    if (textboxKey === BANK_ACCOUNT_FORM_COUNTRY) {
      this.setState({ countryValue: value });
    } else if (textboxKey === BANK_ACCOUNT_FORM_CURRENCY) {
      this.setState({ currencyValue: value });
    } else if (textboxKey === BANK_ACCOUNT_FORM_ROUTING_NUMBER) {
      this.setState({ routingNumberValue: value });
    } else if (textboxKey === BANK_ACCOUNT_FORM_ACCOUNT_NUMBER) {
      this.setState({ accountNumberValue: value });
    } else if (textboxKey === BANK_ACCOUNT_FORM_ACCOUNT_HOLDER_NAME) {
      this.setState({ accountHolderNameValue: value });
    } else if (textboxKey === BANK_ACCOUNT_FORM_ACCOUNT_HOLDER_TYPE) {
      this.setState({ accountHolderTypeValue: value });
    }
  }

  render() {
    const {
      countryValue,
      currencyValue,
      routingNumberValue,
      accountNumberValue,
      accountHolderNameValue,
      accountHolderTypeValue
    } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <BankAccountSection
          onChangeFunc={this.onTextboxChange}
          countryValue={countryValue}
          currencyValue={currencyValue}
          routingNumberValue={routingNumberValue}
          accountNumberValue={accountNumberValue}
          accountHolderNameValue={accountHolderNameValue}
          accountHolderTypeValue={accountHolderTypeValue}
        />
        <button>Save Account</button>
      </form>
    );
  }
}

export default connect(null,actions)(BankAccountForm);
