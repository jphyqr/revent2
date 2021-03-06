import React, { Component } from "react";
import {
  Modal,
  Button,
  Message,
  Form,
  Grid,
  Label,
  Popup,
  Accordion,
  Icon
} from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import DateInput from "../../../app/common/form/DateInput";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import RadioInput from "../../../app/common/form/RadioInput";
import moment from "moment";
import format from "date-fns/format";
import Steps from "./Steps";
import { toastr } from "react-redux-toastr";
import ActiveStep from "./ActiveSteps/ActiveStep";
import { firestoreConnect } from "react-redux-firebase";
import {
  createQuote,
  updateSubmitQuote,
  updateNotes,
  clearQuote,
  updateQuoteBid,
  updatePaymentType,
  updateSchedule,
  goBackToStep,
  updateLineItem,
  updateLineItemNext,
  uploadCustomVideo
} from "./quoteActions";
import { isEmpty, isLoaded } from "react-redux-firebase";
import MobileSteps from "./Mobile/MobileSteps";
import MobileActiveStep from "./Mobile/MobileActiveStep";

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "contractorIntroVideo", doc: auth.uid }],
      storeAs: "contractor_intro_video"
    }
  ];
};

const actions = {
  closeModal,
  createQuote,
  clearQuote,
  updateSubmitQuote,
  updatePaymentType,
  updateNotes,
  updateQuoteBid,
  goBackToStep,
  updateLineItem,
  updateLineItemNext,
  updateSchedule,
  uploadCustomVideo
};

const mapState = state => {
  return {
    job: state.draft,
    auth: state.firebase.auth,
    quote: state.quote,
    loading: state.async.loading,
    contractorIntroVideo:
      (state.firestore.ordered.contractor_intro_video &&
        state.firestore.ordered.contractor_intro_video[0]) ||
      {}
  };
};

class QuoteJobModal extends Component {
  state = {
    quote: {},
    total: 0,
    sum: 0,
    tax: 0,
    width: window.innerWidth
  };

  componentWillMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  // make sure to remove the listener
  // when the component is not mounted anymore
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
  }


  handleVideoUpload = async (file) =>{
this.props.uploadCustomVideo(this.props.quote, file)
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  async componentDidMount() {
    const { quote, createQuote, job } = this.props;
    if (isLoaded(quote) && isLoaded(job)) {
      console.log("QuoteJobModal Mounted");
      console.log({ quote });
      if (isEmpty(quote)) {
        console.log("quote empty, creatingQuote");
        await createQuote(job);
      }
      this.setState({ quote: this.props.quote });
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.quote !== this.state.quote) {
      this.setState({ quote: nextProps.quote });
    }
  };

  handleUpdateNotes = values => {
    this.props.updateNotes(this.state.quote, values);
  };

  handleSubmitQuote = () => {
    this.props.updateSubmitQuote(this.state.quote);
  };

  handleLineItemNext = total => {
    this.props.updateLineItemNext(this.state.quote, total);
  };

  handleUpdateSchedule = (startDate, startHour, completionDate) => {
    this.props.updateSchedule(
      this.state.quote,
      startDate,
      startHour,
      completionDate
    );
  };

  handleUpdateLineItem = (isNew, values, phase) => {
    this.props.updateLineItem(this.state.quote, isNew, values, phase);
  };
  handleGoBackToStep = async step => {
    const message = "Going back to Bid Type will clear the Quote";
    if (step === "showBidType") {
      toastr.confirm(message, {
        onOk: () => this.props.goBackToStep(this.state.quote, step)
      });
    } else {
      this.props.goBackToStep(this.state.quote, step);
    }
  };

  handleTimeSelected = (timeStamp, index) => {
    console.log("quote model handleTimeSelected");
  };

  handleSelectBidType = async bidType => {
    this.props.updateQuoteBid(this.state.quote, bidType);
  };

  handleSelectPaymentType = paymentType => {
    this.props.updatePaymentType(this.state.quote, paymentType);
  };

  handleClose = async () => {
    await this.props.clearQuote();
    this.props.closeModal();
  };

  render() {
    const { quote, width } = this.state;

    const isMobile = width <= 500;
    const { showState } = quote;
    const { closeModal, job, loading } = this.props || {};
    const { value: jobValues, key: jobId } = job;
    const { title, timesSelected } = jobValues;
    return (
      <Modal closeIcon="close" open={true} onClose={this.handleClose}>
        <Modal.Header>Quote {title}</Modal.Header>
        <Modal.Content>
          {isMobile ? (
            <div>
              <MobileSteps
                handleGoBackToStep={this.handleGoBackToStep}
                loading={loading}
                quote={quote}
              />
              <MobileActiveStep
                handleSubmitQuote={this.handleSubmitQuote}
                handleSelectPaymentType={this.handleSelectPaymentType}
                handleUpdateNotes={this.handleUpdateNotes}
                handleUpdateSchedule={this.handleUpdateSchedule}
                handleLineItemNext={this.handleLineItemNext}
                handleUpdateLineItem={this.handleUpdateLineItem}
                loading={loading}
                handleSelectBidType={this.handleSelectBidType}
                quote={quote}
                jobValues={jobValues}
                contractorIntroVideo={this.props.contractorIntroVideo}
                handleVideoUpload={this.handleVideoUpload}
              />
            </div>
          ) : (
            <div style={{ height: "450px" }}>
              <Grid>
                <Grid.Column width={6}>
                  <Steps
                    handleGoBackToStep={this.handleGoBackToStep}
                    loading={loading}
                    quote={quote}
                  />
                </Grid.Column>
                <Grid.Column width={10}>
                  <ActiveStep
                    handleSubmitQuote={this.handleSubmitQuote}
                    handleSelectPaymentType={this.handleSelectPaymentType}
                    handleUpdateNotes={this.handleUpdateNotes}
                    handleUpdateSchedule={this.handleUpdateSchedule}
                    handleLineItemNext={this.handleLineItemNext}
                    handleUpdateLineItem={this.handleUpdateLineItem}
                    loading={loading}
                    handleSelectBidType={this.handleSelectBidType}
                    quote={quote}
                    jobValues={jobValues}
                    contractorIntroVideo={this.props.contractorIntroVideo}
                    handleVideoUpload={this.handleVideoUpload}
                  />
                </Grid.Column>
              </Grid>
            </div>
          )}
        </Modal.Content>
      </Modal>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(QuoteJobModal));
