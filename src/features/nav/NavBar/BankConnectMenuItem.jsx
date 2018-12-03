import React, { Component } from "react";
import { Menu, Button, Label } from "semantic-ui-react";
import _ from "lodash";
import { connect } from "react-redux";

const mapState = state => {
  return {
    loading: state.async.loading,
    currentAccount: state.account
  };
};

class BankConnectMenuItem extends Component {
  render() {
    const { currentAccount, bankConnect, loading } = this.props;

    return (
      <Menu.Item position="right">
        <Button
          loading={loading}
          circular
          icon="stripe"
          onClick={bankConnect}
          size="mini"
        />

        {!loading ? (
          _.isEmpty(currentAccount) ? (
            <Label basic pointing="left" color="blue">
              Add connected account
            </Label>
          ) : (currentAccount.legal_entity &&
              currentAccount.legal_entity.verification &&
              currentAccount.legal_entity.verification &&
              currentAccount.legal_entity.verification.status) ===
            "verified" ? (
            <Label basic pointing="left" color="green">
              Verified
            </Label>
          ) : (currentAccount.verification &&
              currentAccount.verification.fields_needed &&
              currentAccount.verification.fields_needed.length) > 0 ? (
            <Label basic pointing="left" color="red">
              Fields Needed
            </Label>
          ) : (
            <Label basic pointing="left" color="blue">
              Pending
            </Label>
          )
        ) : (
          <Label basic pointing="left" color="blue">
            Checking Status
          </Label>
        )}
      </Menu.Item>
    );
  }
}

export default connect(
  mapState,
  null
)(BankConnectMenuItem);
