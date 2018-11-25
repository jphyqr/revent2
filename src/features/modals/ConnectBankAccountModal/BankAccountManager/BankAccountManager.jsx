import React, { Component } from "react";
import { connect } from "react-redux";
import { injectStripe } from "react-stripe-elements";
import { compose } from "redux";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import axios from "axios";

const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

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
    try {
      // const {accountToken} = this.props
      // console.log("account token value")
      //console.log(accountToken.value)
      // await axios.post(`${ROOT_URL}/retrieveAccount`,{test:"test"});

      //    await axios({
      //         method: "post",
      //         url:
      //         `${ROOT_URL}/retrieveAccount`,
      //         data: {test:"test"},
      //         headers: { "Content-Type": "application/json" }
      //       });

      const params = {
        accountToken: this.props.accountToken
      };
      console.log('accountToken', this.props.accountToken)

      await axios.post(`${ROOT_URL}/retrieveAccount`, {accountToken: this.props.accountToken.value}, {
        headers: {
          "content-type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } catch (err) {
      console.log({ err });
    }
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
    null,
    null,
    {
      pure: false
    }
  ),
  firebaseConnect(props => [`stripe_accounts/${props.auth.uid}`])
)(BankAccountManager);
