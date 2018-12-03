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

const countryOptions = [
  { key: "ca", value: "CA", flag: "ca", text: "Canada" }
];

class SelectCountryForm extends Component {
  state = { 
     options: [] ,
      selected: []
    };


    componentWillMount() {
      this.setState({
        options: [
          { key: "ca", value: 'CA', flag: "ca", text: "Canada" }
        ],
        selected: 'CA'
      });
    }


  handleChange = (e, { value }) => this.setState({ selected: value });

   handleSubmit = async () => {
    this.props.createConnectedAccount(this.props.userUID, this.state.selected);
   
  };
  render() {
    let isCountrySelected = false;
    if (isCountrySelected !== "") {
      isCountrySelected = true;
    }

    const {
      loading
    } = this.props;



    return (
      <div>
      
        <Message info>
          <Message.Header>Verification</Message.Header>
          <p>
          Skidstere will always ask for the minimum required data needed by Stripe.  This means you will be asked for personal data at different stages of verification.  You can expect to be asked for your I.D photo verification and Social Insurance Number .
        </p>
        </Message>
     
        <Message warning>
          <Message.Header>Canada Only</Message.Header>
          <p>Our services are only available in Canada for now</p>
        </Message>
        <Dropdown
       defaultValue={this.state.selected}
          placeholder="Select Country"
          fluid
          search
          selection
          onChange={this.handleChange}
          options={this.state.options}
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

export default connect(mapState, null)(SelectCountryForm);
