import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { chargeCard } from "../../../features/user/userActions";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { Field, reduxForm } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import PaymentTextInput from "../../../app/common/form/PaymentTextInput";
import { addPaymentCard } from "../../../features/user/userActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Divider, Button } from "semantic-ui-react";

const mapState = state => {
  return {
    loading: state.async.loading
  };
};
const actions = {
  chargeCard,
  addPaymentCard
};
class AddCardForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit() {
    const { billingAddress, billingName, city } = this.props.billingProfile;

    let { token, error } = await this.props.stripe.createToken({
      type: "card",
      owner: {
        name: billingName,
        address: { city: city, line1: billingAddress }
      }
    });

    if (error) {
      console.log(error.message);
      toastr.error("Oops", "Problem adding card");
    } else {
      this.props.addPaymentCard(token);
    }
  }

  render() {
    const { loading } = this.props;
    if (loading) return <LoadingComponent inverted={true} />;

    return (
      <div className="checkout">
        <Divider horizontal> Billing Information </Divider>
        <Field
          width={8}
          name="billingName"
          type="text"
          component={PaymentTextInput}
          placeholder="Billing Name"
        />

        <Field
          width={8}
          name="billingAddress"
          type="text"
          component={TextInput}
          placeholder="Billing Address"
        />
        <Field
          width={8}
          name="billingPostalCode"
          type="text"
          component={TextInput}
          placeholder="Billing Postal Code"
        />
        <Divider horizontal> Credit Card Information </Divider>
        <CardElement hidePostalCode />
        <br />
        <Button primary onClick={this.submit}>
          Add Card
        </Button>
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(
  injectStripe(
    reduxForm({
      form: "userProfile",
      enableReinitialize: true,
      destroyOnUnmount: false
    })(AddCardForm)
  )
);
