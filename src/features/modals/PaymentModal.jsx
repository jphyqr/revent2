import React, { Component } from "react";
import { Modal, Dropdown, Divider, Button } from "semantic-ui-react";
import { closeModal } from "./modalActions";
import { connect } from "react-redux";
import Script from "react-load-script";
import { objectToArray } from "../../app/common/util/helpers";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "../../app/common/form/CheckoutForm";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase"; //even though we using firestore this gives our binding
import LoadingComponent from "../../app/layout/LoadingComponent";

const actions = {
  closeModal
};

const mapState = (state, ownProps) => {
  let sources = {};
  let billingProfile = {};
  let authuid = state.firebase.auth.uid;
  sources =
    !isEmpty(state.firebase.ordered.stripe_customers) &&
    isLoaded(state.firebase.ordered.stripe_customers) &&
    state.firebase.ordered.stripe_customers[authuid].sources;

  billingProfile =
    !isEmpty(state.form.userProfile) &&
    isLoaded(state.form.userProfile) &&
    state.form.userProfile.values;

  return {
    user: state.firebase.profile,
    auth: state.firebase.auth,
    requesting: state.firestore.status.requesting,
    sources,

    billingProfile
  };
};

class PaymentModal extends Component {
  state = {
    scriptLoaded: false,
    selectedCardId: ""
  };


  handleChange = (e, { value }) => this.setState({ selectedCardId:value })


  handleScriptLoaded = () => this.setState({ scriptLoaded: true });

  buildDropdownList = array => {
    let list = [];
    array &&
      array.map(item => {
        if (item) {
          let newItem = {
            text: `${item.value.card.brand} ... xxxx-xxxx-xxxx- ${
              item.value.card.last4
            } ... ${item.value.owner.address.line1} .... ${
              item.value.owner.name
            }`,
            value: item.value.id
          };
          list.push(newItem);
        }
      });
    return list;
  };

  render() {
    const {
      closeModal,
      user,
      requesting,
      auth,
      sources,
  
      billingProfile
    } = this.props;


    const {selectedCardId} = this.state
    const loading = Object.values(requesting).some(a => a === true);
    let cardSelected = false;
    if(selectedCardId!==""){
      cardSelected = true
    }
    if (loading) return <LoadingComponent inverted={true} />;
    return (
      <Modal closeIcon="close" open={true} onClose={closeModal}>
        <Modal.Header>Test Modal</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <StripeProvider apiKey="pk_test_Y9DV2lcx7cuPwunYtda4wGyu">
              <div className="example">
                <h1>Pay for Service</h1>
                <Elements>
                  <CheckoutForm
                    initialValues={user}
                    sources={sources}
                    billingProfile={billingProfile}
                  />
                </Elements>
                <Divider horizontal> Select a Card </Divider>
                <Dropdown
                  loading={loading}
                  placeholder="Select a Card"
                  fluid
                  selection
                  onChange={this.handleChange}
                  value={selectedCardId}
                  options={this.buildDropdownList(objectToArray(sources))}
                />
                <br />{" "}
                <Button disabled={!cardSelected}primary onClick={this.submit}>
                  Purchase
                </Button>
              </div>
            </StripeProvider>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default connect(
  mapState,
  actions
)(
  firebaseConnect(props => [`stripe_customers/${props.auth.uid}/sources`])(
    PaymentModal
  )
);
