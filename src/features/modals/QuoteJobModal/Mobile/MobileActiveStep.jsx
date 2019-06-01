import React, { Component } from "react";
import MobileBidType from "./MobileBidType";
import MobileSchedule from "./MobileSchedule"
 import Confirm from "../ActiveSteps/Confirm";
 import MobileLineItemList from "./LineItems/MobileLineItemList";
 import Notes from "../ActiveSteps/Notes";
 import MobilePayments from "./MobilePayments";
// import Schedule from "./Schedule";
class MobileActiveStep extends Component {
  render() {
    const { quote, jobValues , loading, handleSubmitQuote, handleSelectPaymentType, handleUpdateNotes, handleSelectBidType, handleUpdateLineItem, handleLineItemNext, handleUpdateSchedule} = this.props;
    const { showState, submitted, bidType, schedule } = quote || {};
    const {
      showBidType,
      showLineItems,
      showSchedule,
      showNotes,
      showPayments,
      showConfirm
    } = showState ||{};

    const {
      title,
      bookingType,
      phases,
      acceptsHourlyContractor,
      acceptsHourlyOwner,
      acceptsFlatOwner,
      acceptsFlatContractor,
      timesSelected
    } = jobValues ||{};


    return (
      <div
        style={{
          height: "auto",
          width: "auto",
          backgroundColor: "whiteSmoke"
        }}
      >

      {showBidType ? (
          <MobileBidType  handleSelectBidType={handleSelectBidType} acceptsHourlyContractor={acceptsHourlyContractor} acceptsFlatContractor={acceptsFlatContractor} acceptsHourlyOwner={acceptsHourlyOwner} acceptsFlatOwner={acceptsFlatOwner}/>
        ) : showLineItems ? (
          <MobileLineItemList handleLineItemNext={handleLineItemNext} quote={quote} handleUpdateLineItem={handleUpdateLineItem} bidType={bidType} phases={phases}/>
        ) 
        
        
        : showSchedule ? (
          <MobileSchedule schedule={schedule} handleUpdateSchedule={handleUpdateSchedule} timesSelected={timesSelected}/>
        )   : showNotes ? (
          <Notes handleUpdateNotes={handleUpdateNotes}/>
        ) : showPayments ? (
          <MobilePayments handleSelectPaymentType={handleSelectPaymentType}/>
        ) : <Confirm  handleVideoUpload={this.props.handleVideoUpload} contractorIntroVideo={this.props.contractorIntroVideo} submitted={submitted} handleSubmitQuote={handleSubmitQuote}/>
         }
      </div>
    );
  }
}

export default MobileActiveStep;
