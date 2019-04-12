import React, { Component } from "react";
import { Grid, Message } from "semantic-ui-react";
class MobileBidType extends Component {

state={selectedBidType: {}}



  render() {
    const {
      acceptsHourlyContractor,
      acceptsFlatContractor,
      acceptsHourlyOwner,
      acceptsFlatOwner
    } = this.props || {};
    return (
   <div>
        <Message info>
    <Message.Header>Select Bid Type</Message.Header>
    <p>The following bid types are accepted by the owner</p>
  </Message>

          <Message
          positive={this.state.selectedBidType==="flatContractor"}
          onClick={acceptsFlatContractor ? ()=>{this.props.handleSelectBidType("flatContractor")} : ()=>{}}
          style={{width:"100%", opacity: acceptsFlatContractor ? '1' : '0.3'}}
            icon="dollar sign"
            header="Flat Rate Labour and Materials"
            content="Contractor will pay for all materials and charge a flat rate."
          />


         
          <Message style={{width:"100%", opacity: acceptsHourlyContractor ? '1' : '0.3'}}
          positive={this.state.selectedBidType==="hourlyContractor"}
          onClick={acceptsHourlyContractor ? ()=>{this.props.handleSelectBidType("hourlyContractor")} : ()=>{}}

            icon="clock"
            header="Per hour Plus Materials"
            content="Contractor charges hourly rate and will supply materials."
          />
       
   
          <Message

          onClick={acceptsFlatOwner ? ()=>{this.props.handleSelectBidType("flatOwner")} : ()=>{}}
          positive={this.state.selectedBidType==="flatOwner"}
          style={{width:"100%", opacity: acceptsFlatOwner ? '1' : '0.3'}}
            icon="dollar sign"
            header="Flat Rate Labour Only"
            content="Owner supplies materials. Materials purchased by contrator are added to the total"
          />
  
            <Message

            onClick={acceptsHourlyOwner ? ()=>{this.props.handleSelectBidType("hourlyOwner")} : ()=>{}}
            positive={this.state.selectedBidType==="hourlyOwner"}
            style={{width:"100%", opacity: acceptsHourlyOwner ? '1' : '0.3'}}
              icon="clock"
              header="Per Hour"
              content="Contractor only provides service for hourly rate."
            />
  
  </div>
    );
  }
}

export default MobileBidType;
