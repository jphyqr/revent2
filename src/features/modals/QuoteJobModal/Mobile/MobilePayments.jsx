import React, { Component } from 'react'
import {Grid, Message} from 'semantic-ui-react'
class MobilePayments extends Component {

  state={selectPaymentType: {}}

  render() {


    const acceptsCreditCard = false
    const acceptsConnectedAccount = false
    const acceptsOutOfApp = true


    return (
      <Grid style={{margin:'5px'}}>
        <Grid.Row>
       
        <Message style={{width:"100%"}} info>
    <Message.Header>Select Payment Type</Message.Header>
    <p>The following bid types are accepted by the owner</p>
  </Message>

  <Message style={{width:"100%"}} warning>
   
    <p>Only Off-app payments (cheques, transfers, cash) are avaialble during Alpha</p>
  </Message>
 
        </Grid.Row>
  
        <Grid.Row  style={{paddingBottom:"0px"}}>
       
       {" "}
       <Message
fluid
       onClick={acceptsOutOfApp ? ()=>{this.props.handleSelectPaymentType("outOfApp")} : ()=>{}}
       positive={this.state.selectPaymentType==="outOfApp"}
       style={{width:"100%", opacity: acceptsOutOfApp ? '1' : '0.3'}}
         icon="dollar sign"
         header="Off App"
         content="Payments will be handled outside of YAYbour"
       />
     
     


     </Grid.Row>

   
        <Grid.Row  style={{paddingBottom:"0px"}}>
          {" "}
          <Message
          fluid
          positive = {this.state.selectPaymentType==="connectedAccount"}
          onClick={acceptsConnectedAccount ? ()=>{this.props.handleSelectPaymentType("connectedAccount")} : ()=>{}}
          style={{width:"100%", opacity: acceptsConnectedAccount ? '1' : '0.3'}}
            icon="globe"
            header="Connected Account"
            content="Get paid directly to your bank account."
          />
          </Grid.Row>


 
          <Grid.Row  style={{paddingBottom:"0px"}}>
          {" "}
          <Message fluid style={{width:"100%", opacity: acceptsCreditCard ? '1' : '0.3'}}
          positive={this.state.selectPaymentType==="creditCard"}
          onClick={acceptsCreditCard ? ()=>{this.props.handleSelectPaymentType("creditCard")} : ()=>{}}

            icon="credit card"
            header="Credit Card"
            content="Get paid to a valid credit card."
          />
       
        </Grid.Row>
        

      </Grid>
    )
  }
}

export default MobilePayments