import React, { Component } from "react";
import BidType from "./BidType";
import Confirm from "./Confirm";
import LineItemsList from "./LineItems/LineItemsList";
import Notes from "./Notes";
import Payments from "./Payments";
import Schedule from "./Schedule";
class ActiveStep extends Component {
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
          height: "400px",
          width: "auto",
          backgroundColor: "whiteSmoke"
        }}
      >
        {showBidType ? (
          <BidType  handleSelectBidType={handleSelectBidType} acceptsHourlyContractor={acceptsHourlyContractor} acceptsFlatContractor={acceptsFlatContractor} acceptsHourlyOwner={acceptsHourlyOwner} acceptsFlatOwner={acceptsFlatOwner}/>
        ) : showLineItems ? (
          <LineItemsList handleLineItemNext={handleLineItemNext} quote={quote} handleUpdateLineItem={handleUpdateLineItem} bidType={bidType} phases={phases}/>
        ) : showSchedule ? (
          <Schedule schedule={schedule} handleUpdateSchedule={handleUpdateSchedule} timesSelected={timesSelected}/>
        ) : showNotes ? (
          <Notes handleUpdateNotes={handleUpdateNotes}/>
        ) : showPayments ? (
          <Payments handleSelectPaymentType={handleSelectPaymentType}/>
        ) : showConfirm ? (
          <Confirm handleVideoUpload={this.props.handleVideoUpload} contractorIntroVideo={this.props.contractorIntroVideo} submitted={submitted} handleSubmitQuote={handleSubmitQuote}/>
        ) : null}
      </div>
    );
  }
}

export default ActiveStep;
