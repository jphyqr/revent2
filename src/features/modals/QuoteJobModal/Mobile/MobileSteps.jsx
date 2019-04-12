import React, { Component } from 'react'
import {Label, Icon, Button} from 'semantic-ui-react'
import moment from "moment";
import format from "date-fns/format";
 class MobileSteps extends Component {
  render() {
    const {quote, handleGoBackToStep} = this.props
    const {showState, lineItems, total, paymentType, notes, schedule, submitted, bidType} = quote || {}
    const {completionDate, startDate, startHour} =schedule||{}
    const {showBidType, showLineItems, showSchedule, showNotes,  showPayments,showConfirm} = showState || {}
    return (
        <div>
        <Label as={Button} fluid onClick={()=>handleGoBackToStep("showBidType")}completed={ !(bidType==null)}  active={showBidType} disabled={submitted}>
          <Icon  name='truck' />
         
            Bid Type
            <Label.Detail>{bidType|| "Choose from available bidding types"}</Label.Detail>
          
         
        </Label>
    
        <Label as={Button} fluid onClick={()=>handleGoBackToStep("showLineItems")} completed={ !(total==undefined)}  active={showLineItems} disabled={showBidType||submitted}>
          <Icon name='clipboard outline' />
        Line Items
            <Label.Detail>{(showSchedule|| showNotes||  showPayments||showConfirm) ? `Total: $${total}`: 'individual line items'} </Label.Detail>
         
        </Label>
    
        <Label as={Button} fluid  onClick={()=>handleGoBackToStep("showSchedule")}  completed={  !(startDate==null)}  active={showSchedule} disabled={showBidType||submitted}>
          <Icon name='calendar' />
          
            Schedule
            <Label.Detail> {startDate ? `${format(
                              moment(startDate * 1000).toDate(),
                              "ddd MMM D"
                            )}, ${startHour}`: "Select on-site time"}</Label.Detail>
         
         </Label>
        <Label as={Button} fluid  onClick={()=>handleGoBackToStep("showNotes")} completed={    showPayments||showConfirm}  active={showNotes} disabled={showBidType|| submitted}>
          <Icon name='sticky note' />
         
            Notes
            <Label.Detail>{notes? "Notes Provided" : "Provide additional notes"}</Label.Detail>
         
            </Label>
        <Label as={Button} fluid onClick={()=>handleGoBackToStep("showPayments")} completed={  showConfirm}  active={showPayments} disabled={showBidType||submitted}>
          <Icon name='payment' />
         
            Payments
            <Label.Detail>{paymentType || "Select Payment method"}</Label.Detail>
         
            </Label>
        <Label as={Button} fluid  completed={submitted} active={showConfirm} disabled={!showConfirm||submitted}>
          <Icon name='info' />
         
            {submitted ? "Quote Submitted" : "Confirm Quote"}
         </Label>
      
        </div>
  
    )
  }
}

export default MobileSteps