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

const actions = {
  closeModal
};

const mapState = state => {
  return {
    job: state.draft && state.draft.value
  };
};

class OldQuoteModal extends Component {
  state = {
    bidType: "",
    selectedDate: "",
    selectedHour: "",
    bidTypeLoading: false
  };


  renderPopupContent = phase => {
    let panels = [];
    //get the titles of the fieldTitles
    for (
      var i = 0;
      i < (phase.sectionsIncluded && phase.sectionsIncluded.length);
      i++
    ) {
      panels.push({
        key: i,
        title: phase.sectionsIncluded[i].sectionName,
        content: { content: this.expandSection(phase.sectionsIncluded[i]) }
      });
    }

    console.log({ panels });

    return (
      <div>
        <Accordion panels={panels} exclusive={false} />
      </div>
    );
  };

  expandSection = section => {
    console.log("expand Section", section);

    let sectionPanels = [];
    for (
      var i = 0;
      i < (section.clausesIncluded && section.clausesIncluded.length);
      i++
    ) {
      sectionPanels.push({
        key: i,
        title: section.clausesIncluded[i].clause,
        content: section.clausesIncluded[i].clause
      });
    }

    console.log({ sectionPanels });

    return (
      <div>
        <Accordion panels={sectionPanels} exclusive={false} />
      </div>
    );
  };

handleSelectBidType =  (e) => {
  


  this.setState({ bidType: e.target.value })
 
}

  onFormSubmit = async values => {
    console.log("form submit", values);
  };

  render() {
    const { closeModal, job } = this.props;
    const {
      title,
      bookingType,
      phases,
      acceptsHourlyContractor,
      acceptsHourlyOwner,
      acceptsFlatOwner,
      acceptsFlatContractor,
      timesSelected
    } = job;
    return (
      <Modal closeIcon="close" open={true} onClose={closeModal}>
        <Modal.Header>Quote {title}</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {bookingType === "online" ? (
              <Message warning>
                <Message.Header>This job is booked online</Message.Header>
                <p>
                  If a site visit is required for this task, please contact the
                  task manager
                </p>
              </Message>
            ) : null}

<Message icon>
<Icon name='dollar' loading={this.state.bidTypeLoading} />
<Message.Content>
                <Message.Header>Select a Bid Type</Message.Header>
                <p>
                  The following bid types are accepted for this job.  
                </p>

                </Message.Content>
              </Message>

            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Form.Group inline>
                {acceptsHourlyContractor && (
                  <Field
                    name="bidType"
                    type="radio"
                    value="hourlyContractor"
                    label="$/HR Contractor Materials"
                    component={RadioInput}
                    onChange={e => this.handleSelectBidType(e)}
                  />
                )}
                {acceptsHourlyOwner && (
                  <Field
                    name="bidType"
                    type="radio"
                    value="hourlyOwner"
                    label="$/HR Owner Materials"
                    component={RadioInput}
                    onChange={e => this.setState({ bidType: e.target.value })}
                  />
                )}
                {acceptsFlatContractor && (
                  <Field
                    name="bidType"
                    type="radio"
                    value="flatContractor"
                    label="Flat Rate, Contractor Materials"
                    component={RadioInput}
                    onChange={e => this.setState({ bidType: e.target.value })}
                  />
                )}
                {acceptsFlatOwner && (
                  <Field
                    name="bidType"
                    type="radio"
                    value="flatOwner"
                    label="Flat Rate, Owner Materials"
                    component={RadioInput}
                    onChange={e => this.setState({ bidType: e.target.value })}
                  />
                )}
              </Form.Group>
              
              {this.state.bidType == "" ? (
                <Label warning> Please Select a bid type</Label>
              ) : (
                <div>
                  <Message>
                    <Message.Header>Select on-site meeting time</Message.Header>
                    <p>
                      If a site visit is required for this task, please contact
                      the task manager
                    </p>
                  </Message>
                  {timesSelected &&
                    timesSelected.map((day, dayIndex) =>
                      day.timeSlots.map(
                        (hour, hourIndex) =>
                          hour.selected && (
                            <Button
                              size="mini"
                              primary={
                                this.state.selectedDate === day.timeStamp &&
                                this.state.selectedHour === hour.label
                              }
                              onClick={() => {
                                this.setState({
                                  selectedDate: day.timeStamp,
                                  selectedHour: hour.label
                                });
                              }}
                            >
                              {format(
                                moment(day.timeStamp).toDate(),
                                "ddd MMM Do"
                              )}{" "}
                              {hour.label}
                            </Button>
                          )
                      )
                    )}{" "}

                    <div style={{paddingTop:'10px', height:'200px', overflowY:'auto', overflowX:'hidden'}}>
                  {phases &&
                    phases.map((phase, index) => (
                      <Grid>
                        <Grid.Column width={3}>
                          <Popup
                            hoverable
                            trigger={<Label>{phase.phaseName}</Label>}
                            content={this.renderPopupContent(phase)}
                          />
                        </Grid.Column>

                        <Grid.Column width={3}>
                          <Field
                            key={`${index}_daysRequired`}
                            type="text"
                            name={`${phase.phaseName}_daysRequired`}
                            component={TextInput}
                            placeholder={`Days Required`}
                          />
                        </Grid.Column>

                        {this.state.bidType === "hourlyOwner" ||
                        this.state.bidType === "hourlyContractor" ? (
                          <Grid.Column width={3}>
                            <Field
                              key={`${index}_hourlyRate`}
                              type="text"
                              name={`${phase.phaseName}_hourlyRate`}
                              component={TextInput}
                              placeholder={`Hourly Rate`}
                            />
                          </Grid.Column>
                        ) : (
                          <Grid.Column width={3}>
                            <Field
                              key={`${index}_deposit`}
                              type="text"
                              name={`${phase.phaseName}_deposit`}
                              component={TextInput}
                              placeholder={`Deposit Required`}
                            />
                          </Grid.Column>
                        )}

                        {this.state.bidType === "hourlyOwner" ||
                        this.state.bidType === "hourlyContractor" ? (
                          <Grid.Column width={3}>
                            <Field
                              key={`${index}_estimatedHours`}
                              type="text"
                              name={`${phase.phaseName}_estimatedHours`}
                              component={TextInput}
                              placeholder={`Estimated Billable Hours`}
                            />
                          </Grid.Column>
                        ) : (
                          <Grid.Column width={3}>
                            <Field
                              key={`${index}_due`}
                              type="text"
                              name={`${phase.phaseName}_due`}
                              component={TextInput}
                              placeholder={`Due at Completion`}
                            />
                          </Grid.Column>
                        )}
                      </Grid>
                    ))}

</div>
                  <Field
                    key={`targetCompletionDate`}
                    type="text"
                    name={`targetCompletionDate`}
                    component={DateInput}
                    placeholder={`Target Completion Date`}
                    dateFormat="YYYY-MM-DD"
                    showYearDropdown={true}
                    showMonthDropdown={true}
                    dropdownMode="select"
                    minDate={moment(Date.now())}
                  />
                  <Field
                    key={`notes`}
                    type="text"
                    name={`notes`}
                    component={TextArea}
                    placeholder={`Additional Notes`}
                  />
                </div>
              )}
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default reduxForm({ form: "quoteForm", enableReinitialize: true })(
  connect(
    mapState,
    actions
  )(OldQuoteModal)
);
