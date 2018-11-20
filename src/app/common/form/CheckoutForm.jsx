import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { chargeCard } from "../../../features/user/userActions";
import { connect } from "react-redux";
import firebase from "../../config/firebase";
import { toastr } from "react-redux-toastr";
import { Field, reduxForm } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import {addPaymentCard} from '../../../features/user/userActions'
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {Divider, Button} from 'semantic-ui-react'

const style = {
  base: {
    color: '#32325d',
    lineHeight: '18px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

const mapState = state => {
  return  { 
    loading: state.async.loading
  }
}
const actions = {
  chargeCard,
  addPaymentCard
};
class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit() {
    const {billingAddress, billingName, billingPostalCode, city} = this.props.billingProfile
 
    let response = await this.props.stripe.createSource({ type: "card", owner:{name: billingName, address:{city:city, line1:billingAddress} }});
    console.log("Checkout Form");
    // console.log({status})
    console.log({ response });
    //   let response = await this.props.chargeCard(token)
    //  console.log({response})
    //  if (response && response.ok) console.log("Card Add Complete!")

    if (response.error) {
      console.log(response.error.message);
      toastr.error("Oops", "Problem adding card");
    } else {
      // firebase
      //   .database()
      //   .ref(`/stripe_customers/${firebase.auth().currentUser.uid}/sources`)
      //   .push({ token: response.source.id })
      //   .then(() => {
      //     toastr.success("Success", "Card Added");
      //   });
      this.props.addPaymentCard(response)
    }
  }

  render() {
    const { pristine, submitting, user , form, addPaymentCard, loading, billingProfile} = this.props;
   if (loading) return <LoadingComponent inverted={true} />;
   
    return (
      <div className="checkout">
        <Divider horizontal> Billing Information </Divider>
        <Field
          width={8}
          name="billingName"
          type="text"
          component={TextInput}
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
        <CardElement />
        <br></br>
        <Button primary onClick={this.submit}>Add Card</Button>
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
    })(CheckoutForm)
  )
);
