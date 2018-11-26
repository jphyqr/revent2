import React, { Component } from "react";
import {connect} from 'react-redux'
import {
  Modal,
  Button,
  Dropdown,
  Message,
  Loader,
  Dimmer
} from "semantic-ui-react";

import { registerAsContractor } from "../../user/userActions";


const actions = {
  registerAsContractor
}
const mapState = state => {
  let authuid = state.firebase.auth.uid;
  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    requesting:
    authuid &&
    state.firebase.requesting.stripe_accounts &&
    state.firebase.requesting.stripe_accounts[authuid]
 
  };
};


class SelectCountryForm extends Component {
  state = { modalOpen: true, countrySelected: "" };
  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => {
    this.props.closeModal();
  };

  state = { modalOpen: true, countrySelected: "" };
  handleChange = (e, { value }) => this.setState({ countrySelected: value });

   handleSubmit = async () => {
    this.props.handleCountrySet();
    const { countrySelected } = this.state;
    console.log("handleSubmit", countrySelected);
    this.props.registerAsContractor(countrySelected);
   
  };
  render() {
    let isCountrySelected = false;
    if (isCountrySelected !== "") {
      isCountrySelected = true;
    }

    const {
      loading,
      countryOptions,
      requesting
    } = this.props;


    if(loading||requesting){
      return <div>            <Dimmer active inverted>
      <Loader content="Loading" />
    </Dimmer></div>
    }

    return (
      <div>
        <p>
          We need to know which country you are in so we can determine which
          information Stripe requires.
        </p>
        <br />
        <Message info>
          <Message.Header>Canada Only</Message.Header>
          <p>Our services are only available in Canada for now</p>
        </Message>
        <Dropdown
          placeholder="Select Country"
          fluid
          search
          selection
          onChange={this.handleChange}
          options={countryOptions}
        />
        <br />
        <Button
          primary
          disabled={!isCountrySelected}
          content="Set Country"
          loading={loading}
          onClick={() => this.handleSubmit()}
        />
      </div>
    );
  }
}

export default connect(mapState, actions)(SelectCountryForm);
