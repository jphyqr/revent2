import React, { Component } from "react";
import { Button, Grid, Segment, Dimmer, Loader } from "semantic-ui-react";

import OwnerProfile from "./OwnerProfile";
import OpenJobSummary from "./OpenJobSummary";
import { isEmpty, isLoaded } from "react-redux-firebase";

class OpenJobExpanded extends Component {
  state = {
    jobId: "",
    quoteId: "",
    showEditButton: false
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
          this.setState({ quoteId: myQuotes[i].quoteId, showEditButton: true });
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
      ownerProfileLoading
    } = this.props;
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
      <Segment attached="bottom" style={{ paddingBottom: "0px" }}>
        <div style={{ color: "black", height: "500px", width: "100%" }}>
          {quotesLoading? (
            <Dimmer style={{ paddingBottom: "0px" }} active inverted>
              <Loader style={{ paddingBottom: "0px" }} content="Loading Job" />
            </Dimmer>
          ) : (
            <Grid>
              <Grid.Column width={4}>
              
                <OwnerProfile
                  
                  ownerUid={ownerUid}
                />
                {showEditButton ? (
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
              <Grid.Column width={2}>
                {" "}
                <Button onClick={() => this.props.handleHideMap()}>
                  Show Map
                </Button>{" "}
              </Grid.Column>
            </Grid>
          )}
        </div>
      </Segment>
    );
  }
}
export default OpenJobExpanded;
