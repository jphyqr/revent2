import React, { Component } from "react";

import { Modal, Button, Dropdown, Message, Loader } from "semantic-ui-react";
class SelectCountryForm extends Component {
  state = { modalOpen: true, countrySelected: "" };
  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => {
    this.props.closeModal();
  };

  state = { modalOpen: true, countrySelected: "" };
  handleChange = (e, { value }) => this.setState({ countrySelected: value });

  handleSubmit = () => {
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
      registerAsContractor
    } = this.props;

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

export default SelectCountryForm;
