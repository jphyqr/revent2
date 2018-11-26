import React, { Component } from "react";
import { connect } from "react-redux";
import { injectStripe } from "react-stripe-elements";
import { compose } from "redux";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import axios from "axios";
import { getAccount } from "./accountActions";
import {Dimmer, Loader} from 'semantic-ui-react'

const ROOT_URL = "https://us-central1-revents-99d5b.cloudfunctions.net";

const actions = {
  getAccount
};

const mapState = state => {

  return {
    loading: state.async.loading,
    account: state.account,
    fieldsNeeded: state.account&&state.account.verification&&state.account.verification.fields_needed,
    auth: state.firebase.auth
  
  };
};

class BankAccountManager extends Component {
  async componentDidMount() {
    if (this.props.accountToken) {
      console.log("loaded");

      console.log("props account token", this.props.accountToken);
      let account = await this.props.getAccount(this.props.accountToken.value);
      console.log({ account });
    }
  }

  render() {
    const {
      accountToken,
      loading,
      fieldsNeeded
    } = this.props;


if(loading||!isLoaded(accountToken)||!isLoaded(fieldsNeeded)){
  return <div>            <Dimmer active inverted>
  <Loader content="Getting Fields.." />
</Dimmer></div>
}

    return (
      <div>
        {fieldsNeeded&&fieldsNeeded.length === 0 ? <p>all set up</p> :
        
        
        
        fieldsNeeded&&fieldsNeeded.map(fieldKey => {
           return( <div>
            <p>{fieldKey}</p>

            </div>
           )
        })
        
        
        
        
        
        }
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
  )
)(BankAccountManager);
