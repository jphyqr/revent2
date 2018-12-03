import React, { Component } from "react";
import { Modal, Loader, Dimmer } from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { compose } from "redux";
import { StripeProvider } from "react-stripe-elements";
import BankAccountManager from "./BankAccountManager/BankAccountManager";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
const actions = {
  closeModal
};

const mapState = state => {
  let authuid = state.firebase.auth.uid;

  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    accountToken:
      authuid &&
      state.firebase.ordered.stripe_connected_account &&
      state.firebase.ordered.stripe_connected_account[authuid] &&
      state.firebase.ordered.stripe_connected_account[authuid][0]
  };
};

class ConnectBankAccountModal extends Component {

  handleUnmount(){
    console.log
  }


  render() {
    const { closeModal,accountToken } = this.props;
    console.log("connectbankaccount token", accountToken);

    return (
      <Modal open={true}  onUnmount={()=>this.handleUnmount()}closeIcon="close" onClose={closeModal} closeOnDimmerClick={false}>
        <Modal.Header>Stripe Connect</Modal.Header>
        <Modal.Content>
         
          <Modal.Description>
            
            {!isLoaded(accountToken) ? (
              <Dimmer active inverted>
                <Loader content="Connecting to Stripe" />
              </Dimmer>
            ) : (
              <StripeProvider apiKey="pk_test_Y9DV2lcx7cuPwunYtda4wGyu">
                <BankAccountManager
                  accountToken={accountToken}
               
                />
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
  firebaseConnect(props => [`stripe_connected_account/${props.auth.uid}`])
)(ConnectBankAccountModal);
