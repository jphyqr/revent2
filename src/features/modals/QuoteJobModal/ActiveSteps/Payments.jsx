import React, { Component } from 'react'
import {Grid, Message} from 'semantic-ui-react'
class Payments extends Component {

  state={selectPaymentType: {}}

  render() {


    const acceptsCreditCard = true
    const acceptsConnectedAccount = true
    const acceptsOutOfApp = true


    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
        <Message info>
    <Message.Header>Select Payment Type</Message.Header>
    <p>The following bid types are accepted by the owner</p>
  </Message>
  </Grid.Column>
        </Grid.Row>
  
        <Grid.Row>

   
        <Grid.Column width={8}>
          {" "}
          <Message
          positive = {this.state.selectPaymentType==="connectedAccount"}
          onClick={acceptsConnectedAccount ? ()=>{this.props.handleSelectPaymentType("connectedAccount")} : ()=>{}}
          style={{height:"100%", opacity: true ? '1' : '0.3'}}
            icon="globe"
            header="Connected Account"
            content="Get paid directly to your bank account."
          />


   </Grid.Column>
        <Grid.Column width={8}>
          {" "}
          <Message style={{height:"100%", opacity: true ? '1' : '0.3'}}
          positive={this.state.selectPaymentType==="creditCard"}
          onClick={acceptsCreditCard ? ()=>{this.props.handleSelectPaymentType("creditCard")} : ()=>{}}

            icon="credit card"
            header="Credit Card"
            content="Get paid to a valid credit card."
          />
       
        </Grid.Column>
        </Grid.Row>
        <Grid.Row>
        <Grid.Column width={8}>
          {" "}
          <Message

          onClick={acceptsOutOfApp ? ()=>{this.props.handleSelectPaymentType("outOfApp")} : ()=>{}}
          positive={this.state.selectPaymentType==="outOfApp"}
          style={{height:"100%", opacity: acceptsOutOfApp ? '1' : '0.3'}}
            icon="dollar sign"
            header="Off App"
            content="Payments will be handled outside of YAYbour"
          />
        </Grid.Column>
   
          <Grid.Column width={8}>
         
          </Grid.Column>

        </Grid.Row>
      </Grid>
    )
  }
}

export default Payments