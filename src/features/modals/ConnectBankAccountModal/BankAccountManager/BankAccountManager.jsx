import React, { Component } from "react";
import { connect } from "react-redux";
import { injectStripe } from "react-stripe-elements";
import { compose } from "redux";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import axios from "axios";
import { getAccount } from "./accountActions";

const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

const actions = {
  getAccount
};

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
    account: state.account,
    auth: state.firebase.auth,
    accountToken
  };
};

class BankAccountManager extends Component {
  async componentWillMount() {
     
    if(this.props.accountToken){
          console.log('loaded')
      
        console.log('props account token', this.props.accountToken)
      let account = await this.props.getAccount(this.props.accountToken.value);
      console.log({ account });
    }
    
  }

  render() {
    const { accountToken, loading, getAccount } = this.props;

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
    actions,
    null,
    {
      pure: false
    }
  ),
  firebaseConnect(props => [`stripe_accounts/${props.auth.uid}`])
)(BankAccountManager);
