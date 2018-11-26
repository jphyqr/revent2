import React, { Component } from "react";
import {
  Modal,
  Loader,
  Dimmer
} from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { compose } from "redux";
import SelectCountryForm from "./SelectCountryForm";
import { StripeProvider, Elements } from "react-stripe-elements";
import BankAccountManager from "./BankAccountManager/BankAccountManager";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import { isThisISOWeek } from "date-fns";
const actions = {
  closeModal
};



const mapState = state => {
  let authuid = state.firebase.auth.uid;

  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    requesting:
      authuid &&
      state.firebase.requesting.stripe_accounts &&
      state.firebase.requesting.stripe_accounts[authuid],
    accountToken:
      authuid &&
      state.firebase.ordered.stripe_accounts &&
      state.firebase.ordered.stripe_accounts[authuid] &&
      state.firebase.ordered.stripe_accounts[authuid][0]
  };
};

class ConnectBankAccountModal extends Component {
  state = {
    showCountryForm: true,
    accountLoadedOnce: false
  };

  async componentWillReceiveProps(nextProps) {
    console.log({ nextProps });

    if (nextProps.accountToken) {
      this.setState({ showCountryForm: false });
    } else {
      this.setState({ showCountryForm: true });
    }
  }

  handleCountrySet = () => {
    this.setState({ showCountryForm: false, accountLoadedOnce: true });
  };

  render() {
    const countryOptions = [
      { key: "ca", value: "CA", flag: "ca", text: "Canada" }
    ];

    const {
      closeModal,
      requesting,
      accountToken
    } = this.props;
    console.log("connectbankaccount token", accountToken);

    return (
      <Modal
        open={true}
        onClose={closeModal}
        closeOnEscape={false}
        closeOnDimmerClick={false}
      >
        <Modal.Header>Connect Bank Account</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {this.state.accountLoadedOnce && !accountToken && (
              <Dimmer active inverted>
                <Loader content="Account Found" />
              </Dimmer>
            )}

            {!isLoaded(accountToken) || requesting ? (
              <Dimmer active inverted>
                <Loader content="Loading" />
              </Dimmer>
            ) : this.state.showCountryForm ? (
              <SelectCountryForm
                closeModal={closeModal}
                countryOptions={countryOptions}
                handleCountrySet={this.handleCountrySet}
              />
            ) : (
              // <BasicDetailsForm

              <StripeProvider apiKey="pk_test_Y9DV2lcx7cuPwunYtda4wGyu">
                <Elements>
                  <BankAccountManager accountToken={accountToken} />
                </Elements>
              </StripeProvider>
            )}
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default compose(
  connect(
    mapState,
    actions
  ),
  firebaseConnect(props => [`stripe_accounts/${props.auth.uid}`])
)(ConnectBankAccountModal);
