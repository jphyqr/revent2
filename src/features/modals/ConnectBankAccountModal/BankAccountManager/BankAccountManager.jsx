import React, { Component } from "react";
import { connect } from "react-redux";
import { injectStripe } from "react-stripe-elements";
import { compose } from "redux";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
const stripe = require("stripe")("pk_test_Y9DV2lcx7cuPwunYtda4wGyu");

const mapState = state => {
  let authuid = state.firebase.auth.uid;
  let accountToken = {};
  if (
    authuid &&
    state.firebase.ordered.stripe_accounts &&
    state.firebase.ordered.stripe_accounts[authuid]
  ) {
    accountToken = state.firebase.ordered.stripe_accounts[authuid][0];
  }

  // let accountToken =
  //   !isEmpty(state.firebase.ordered.stripe_customers) &&
  //   isLoaded(state.firebase.ordered.stripe_customers) &&
  //   state.firebase.ordered.stripe_customers[authuid];
  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    accountToken
  };
};

class BankAccountManager extends Component {
  async componentDidMount() {
 
    let account = await stripe.accounts.retrieve(
      this.props.accountToken, function(err, account){
        console.log({ account });
      }
    );
   



   
  }

  render() {
    const { accountToken, loading } = this.props;
    return (
      <div>
        <h1>Bank Account Manager</h1>
      </div>
    );
  }
}

export default compose(
  
  connect(
    mapState,
    null,null,
    {
      pure: false
    }
  ),
  firebaseConnect(props => [`stripe_accounts/${props.auth.uid}`])
)(BankAccountManager);
