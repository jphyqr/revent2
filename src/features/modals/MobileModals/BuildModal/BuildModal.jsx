import React, { Component } from "react";
import {
  Modal,
  Transition,
  Header,
  Button,
  Statistic,
  Grid,
  Icon,
  Message
} from "semantic-ui-react";
import { closeModal } from "../../modalActions";
import { connect } from "react-redux";

import { toastr } from "react-redux-toastr";

import { isEmpty, isLoaded } from "react-redux-firebase";
import moment from "moment";
import format from "date-fns/format";
import { objectToArray } from "../../../../app/common/util/helpers";

const actions = {closeModal};

const mapState = state => {
  return {};
};

class BuildModal extends Component {
  state = { showDetails: false, hireLoader: false };

  handleHire = async () => {
    const message = "Are you sure you want to Hire";
    toastr.confirm(message, {
      onOk: () => {
        this.setState({ hireLoader: true });
        this.props.hireContractor(this.props.quote);
        this.setState({ hireLoader: false });
      }
    });
  };

  handleClose = async () => {
   
    this.props.closeModal();
  };

  render() {
    return (
      <Modal
        size="fullscreen"
        closeIcon="close"
        open={true}
        onClose={this.handleClose}
      >
        <Modal.Header>Build Modal</Modal.Header>
        <Modal.Content scrolling>
          <div>Build Modal</div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default connect(
  mapState,
  actions
)(BuildModal);
