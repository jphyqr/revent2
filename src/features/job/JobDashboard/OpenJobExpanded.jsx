import React, { Component } from "react";
import {
  Button,
  Grid,
  Label,
  Segment,
  Dimmer,
  Loader
} from "semantic-ui-react";

import OwnerProfile from "./OwnerProfile";
import OpenJobSummary from "./OpenJobSummary";
import { isEmpty, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";
import {toastr} from 'react-redux-toastr'
const mapState = state => {
  return {
    role: state.role
  };
};
class OpenJobExpanded extends Component {
  state = {
    jobId: "",
    quoteId: "",
    showEditButton: false,
    quoteSubmitted: false
  };

  componentWillReceiveProps = nextProps => {
    const { jobId } = this.state;
    const { selectedJobId, myQuotes } = nextProps;
    if (jobId == "" || selectedJobId !== jobId) {
      this.setState({
        jobId: selectedJobId,
        quoteId: "",
        showEditButton: false,
        quoteButtonLoading: true
      });

      for (var i = 0; i < myQuotes.length; i++) {
        if (
          typeof myQuotes[i] == "object" &&
          myQuotes[i].jobId === selectedJobId
        ) {
          this.setState({
            quoteId: myQuotes[i].quoteId,
            showEditButton: true,
            quoteSubmitted: myQuotes[i].submitted
          });
        }
      }
    }
  };

  handleEditQuote = async () => {
    await this.props.selectQuoteToEdit(this.state.quoteId);
    this.props.openModal("QuoteJobModal");
  };

  render() {
    const {
      selectedJob,
      selectedJobId,
      quotesLoading,
      ownerProfileLoading,
      compactDisplayMode,
      role
    } = this.props || {};
    const { isAdmin } = role || {};

    const contractorHired = !(selectedJob.contract == undefined);

    const { quoteId, showEditButton, jobId } = this.state;
    const {
      ownerUid,
      title,
      venueLatLng,
      customFields,
      date,
      acceptsHourlyOwner
    } = selectedJob;
    return (
      <Segment
        attached="bottom"
        style={{
          maxHeight: compactDisplayMode ? "300px" : "500px",
          height: compactDisplayMode ? "300px" : "500px",
          paddingBottom: "0px"
        }}
      >
        <div style={{ color: "black", width: "100%" }}>
          {quotesLoading ? (
            <Dimmer style={{ paddingBottom: "0px" }} active inverted>
              <Loader style={{ paddingBottom: "0px" }} content="Loading Job" />
            </Dimmer>
          ) : compactDisplayMode ? (
            <div
              style={{
                paddingLeft: 10,
                background: "lightgrey",
                height: 260,
                overflowY: "auto",
                overflowX: "hidden",
                width: "100%"
              }}
            >
              <div>
                {contractorHired ? (
                  <Label size="big" color="red">
                    Contractor Hired
                  </Label>
                ) : this.state.quoteSubmitted ? (
                  <Label size="big" color="green">
                    Quote Submitted
                  </Label>
                ) : showEditButton ? (
                  <Button
                    primary
                    loading={quotesLoading}
                    fluid
                    
                    onClick={
                      isAdmin
                        ? () => this.handleEditQuote
                        : () => {
                            toastr.confirm("This is a fake job for demo purposes Real jobs to come.", {
                              onOk: () => {}
                            });
                          }
                    }
                  >
                    Edit Quote
                  </Button>
                ) : (
                  <Button
                    primary
                    loading={quotesLoading}
                    fluid
                    onClick={
                      isAdmin
                        ? () => this.props.openModal("QuoteJobModal")
                        : () => {
                            toastr.confirm("This is a fake job for demo purposes Real jobs to come.", {
                              onOk: () => {}
                            });
                          }
                    }
                  >
                    Quote Now
                  </Button>
                )}
                <OwnerProfile
                  compactDisplayMode={compactDisplayMode}
                  ownerUid={ownerUid}
                  profileType="owner"
                />
                <OpenJobSummary
                  compactDisplayMode={compactDisplayMode}
                  selectedJob={selectedJob}
                />{" "}
              </div>
            </div>
          ) : (
            <div>
              <Grid>
                <Grid.Column width={4}>
                  <OwnerProfile ownerUid={ownerUid} profileType="owner" compactDisplayMode={compactDisplayMode} />
                  {contractorHired ? (
                    <Label size="big" color="red">
                      Contractor Hired
                    </Label>
                  ) : this.state.quoteSubmitted ? (
                    <Label size="big" color="green">
                      Quote Submitted
                    </Label>
                  ) : showEditButton ? (
                    <Button
                      primary
                      loading={quotesLoading}
                      fluid
                      onClick={this.handleEditQuote}
                    >
                      Edit Quote
                    </Button>
                  ) : (
                    <Button
                      primary
                      loading={quotesLoading}
                      fluid
                      onClick={() => this.props.openModal("QuoteJobModal")}
                    >
                      Quote Now
                    </Button>
                  )}
                </Grid.Column>
                <Grid.Column width={10}>
                  {" "}
                  <OpenJobSummary selectedJob={selectedJob} />{" "}
                </Grid.Column>
                <Grid.Column width={2} />
              </Grid>
            </div>
          )}
        </div>
      </Segment>
    );
  }
}
export default connect(
  mapState,
  null
)(OpenJobExpanded);
