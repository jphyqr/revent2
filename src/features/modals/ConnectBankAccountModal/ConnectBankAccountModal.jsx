import React, { Component } from "react";
import {
  Modal,
  Button,
  Dropdown,
  Message,
  Loader,
  Dimmer
} from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { compose } from "redux";
import { registerAsContractor } from "../../user/userActions";
import SelectCountryForm from "./SelectCountryForm";
import { StripeProvider , Elements} from "react-stripe-elements";
import BankAccountManager from "./BankAccountManager/BankAccountManager";
import {
  firestoreConnect,
  isEmpty,
  isLoaded
} from "react-redux-firebase";
const actions = {
  closeModal,
  registerAsContractor
};

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [
        { collection: "registeredContractorFor", doc: auth.uid }
      ],
      storeAs: "registeredContractorFor"
    }
  ];
};

const mapState = state => {

  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    registeredContractorFor: state.firestore.ordered.registeredContractorFor
  };
};
class ConnectBankAccountModal extends Component {




  render() {
    const countryOptions = [
      { key: "ca", value: "CA", flag: "ca", text: "Canada" }
    ];

    const {
      closeModal,
      registerAsContractor,
      loading,
      registeredContractorFor,
      accountToken
    } = this.props;
console.log({accountToken})

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
            {!isLoaded(registeredContractorFor) ? (
              <Dimmer active inverted>
                <Loader content="Loading" />
              </Dimmer>
            ) : isEmpty(registeredContractorFor) ? (
              <SelectCountryForm
                closeModal={closeModal}
                countryOptions={countryOptions}
                loading={loading}
                registerAsContractor={registerAsContractor}
              />
            ) : (
              // <BasicDetailsForm
              
              <StripeProvider apiKey="pk_test_Y9DV2lcx7cuPwunYtda4wGyu">
              <Elements>
              <BankAccountManager/>
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
  firestoreConnect(props => query(props))
)(ConnectBankAccountModal);
