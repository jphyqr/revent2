import React, { Component } from 'react'
import {Step, Icon} from 'semantic-ui-react'
import moment from "moment";
import format from "date-fns/format";
 class Steps extends Component {
  render() {
    const {quote, handleGoBackToStep} = this.props
    const {showState, lineItems, total, paymentType, notes, schedule, submitted, bidType} = quote || {}
    const {completionDate, startDate, startHour} =schedule||{}
    const {showBidType, showLineItems, showSchedule, showNotes,  showPayments,showConfirm} = showState || {}
    return (
        <Step.Group vertical>
        <Step onClick={()=>handleGoBackToStep("showBidType")}completed={ !(bidType==null)}  active={showBidType} disabled={submitted}>
          <Icon name='truck' />
          <Step.Content>
            <Step.Title>Bid Type</Step.Title>
            <Step.Description>{bidType|| "Choose from available bidding types"}</Step.Description>
          </Step.Content>
        </Step>
    
        <Step onClick={()=>handleGoBackToStep("showLineItems")} completed={ !(total==undefined)}  active={showLineItems} disabled={showBidType||submitted}>
          <Icon name='clipboard outline' />
          <Step.Content>
            <Step.Title>Line Items</Step.Title>
            <Step.Description>{(showSchedule|| showNotes||  showPayments||showConfirm) ? `Total: $${total}`: 'individual line items'} </Step.Description>
          </Step.Content>
        </Step>
    
        <Step onClick={()=>handleGoBackToStep("showSchedule")}  completed={  !(startDate==null)}  active={showSchedule} disabled={showBidType||submitted}>
          <Icon name='calendar' />
          <Step.Content>
            <Step.Title>Schedule</Step.Title>
            <Step.Description> {startDate ? `${format(
                              moment(startDate * 1000).toDate(),
                              "ddd MMM D"
                            )}, ${startHour}`: "Select on-site time"}</Step.Description>
          </Step.Content>
        </Step>
        <Step onClick={()=>handleGoBackToStep("showNotes")} completed={    showPayments||showConfirm}  active={showNotes} disabled={showBidType|| submitted}>
          <Icon name='sticky note' />
          <Step.Content>
            <Step.Title>Notes</Step.Title>
            <Step.Description>{notes? "Notes Provided" : "Provide additional notes"}</Step.Description>
          </Step.Content>
        </Step>
        <Step onClick={()=>handleGoBackToStep("showPayments")} completed={  showConfirm}  active={showPayments} disabled={showBidType||submitted}>
          <Icon name='payment' />
          <Step.Content>
            <Step.Title>Payments</Step.Title>
            <Step.Description>{paymentType || "Select Payment method"}</Step.Description>
          </Step.Content>
        </Step>
        <Step  completed={submitted} active={showConfirm} disabled={!showConfirm||submitted}>
          <Icon name='info' />
          <Step.Content>
            <Step.Title>{submitted ? "Quote Submitted" : "Confirm Quote"}</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
    )
  }
}

export default Steps