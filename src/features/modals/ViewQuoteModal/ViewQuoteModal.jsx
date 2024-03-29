import React, { Component } from "react";
import {
  Modal,
  Transition,
  Header,
  Button,
  Statistic,
  Grid,
  Icon,
  Message,
  Label,
  Responsive
} from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";

import { toastr } from "react-redux-toastr";

import { clearQuote, hireContractor } from "../QuoteJobModal/quoteActions";

import { isEmpty, isLoaded } from "react-redux-firebase";
import moment from "moment";
import format from "date-fns/format";
import { objectToArray } from "../../../app/common/util/helpers";

const actions = {
  closeModal,
  clearQuote,
  hireContractor
};

const mapState = state => {
  return {
    quote: state.quote,
    loading: state.async.loading,
    currentAccount: state.account
  };
};

class ViewQuoteModal extends Component {
  state = { showDetails: false, hireLoader: false };

  handleOnUpdate = (e, { width }) => this.setState({ width });
  handleHire = async () => {
    const message = "Are you sure you want to Hire";
    toastr.confirm(message, {
      onOk: () => {
        this.setState({ hireLoader: true });
        this.props.hireContractor(this.props.quote);
        this.setState({ hireLoader: false });
      }
    });
  };

  handleClose = async () => {
    await this.props.clearQuote();
    this.props.closeModal();
  };

  render() {
    const { showDetails, hireLoader, width } = this.state;
    const { quote, loading, currentAccount } = this.props;
    const CUSTOM_TABLET_CUTOFF = 800;
    const compactDisplayMode = width >= CUSTOM_TABLET_CUTOFF ? false : true;
    const {
      bidType,
      created,
      inDraft,
      jobId,
      lineItems,
      notes,
      paymentType,
      quoteDate,
      quoteId,
      quotedBy,
      quotedByPhotoURL,
      schedule,
      total,
      contract
    } = quote || {};

    let paidInApp = false;
    if (paymentType === "connectedAccount" || paymentType === "creditCard") {
      paidInApp = true;
    }

    const { startDate, startHour, completionDate } = schedule || {};

    const lineItemsArray = objectToArray(lineItems) || [];
    console.log("LINE ITEMS ARRAY", lineItemsArray);
    return (
      <Responsive fireOnMount onUpdate={this.handleOnUpdate}>
        <Modal closeIcon="close" open={true} onClose={this.handleClose}>
          <Modal.Header>{`Quote from ${quotedBy}`}</Modal.Header>
          <Modal.Content scrolling>
            <div
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                height: "1200px"
              }}
            >
              {compactDisplayMode ? (
                <div>
                          {paidInApp ? 
                    <Message warning>
                      <Message.Header>
                        This Contractor is Paid Through Yaybour
                      </Message.Header>
                      <p>
                        You need a verified credit card or a connected account
                        in order to pay.
                      </p>
                    </Message>:
                    <Message warning>
                    <Message.Header>
                      This Contractor is Paid Off the App
                    </Message.Header>
                    <p>
                      Yaybour is not responsible for ensuring payments
                    </p>
                  </Message>

                  }

                  <Grid style={{margin:10}}> 
                   
                  {contract ? (
                          <Label color="green" size="huge" style={{textAlign:"center", width:"100%"}}><Icon name="check"></Icon>Contractor Hired</Label>
                        ) : (
                          <Button
                            loading={loading}
                            onClick={() => this.handleHire()}
                            positive
                            size="massive"
                          >
                            Hire Contractor
                          </Button>
                        )}
                  

                    <Grid.Row>
                    
                        {" "}
                        <Statistic
                          style={{ marginBottom: "40px" }}
                          color="green"
                        >
                          <Statistic.Value>
                            <Icon name="dollar" />
                            {total}
                          </Statistic.Value>
                          <Statistic.Label>
                            {showDetails ? (
                              <Button
                                style={{ width: "100%" }}
                                onClick={() =>
                                  this.setState({ showDetails: false })
                                }
                              >
                                Hide Details
                              </Button>
                            ) : (
                              <Button
                                style={{ width: "100%" }}
                                onClick={() =>
                                  this.setState({ showDetails: true })
                                }
                              >
                                Show Details
                              </Button>
                            )}
                          </Statistic.Label>
                        </Statistic>
                  

                    </Grid.Row>
                  </Grid>

                  <Transition.Group animation="slide down" duration={300}>
                    {showDetails && (
                      <Grid style={{ marginBottom: "30px" }}>
                        <Grid.Row>
                          <Grid.Column width={3}>
                            <Header as="h6">Line Item</Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header as="h6">Deposit</Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header as="h6">Due</Header>
                          </Grid.Column>
                          <Grid.Column width={3}>
                            <Header as="h6">Sub-Total</Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header as="h6">Taxes</Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header as="h6">Total</Header>
                          </Grid.Column>
                        </Grid.Row>

                        {lineItemsArray &&
                          lineItemsArray.map(item => (
                            <Grid.Row>
                              <Grid.Column width={3}>
                                <Header as="h6">{item.id || "No Name"}</Header>
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Header as="h6">
                                  {item[`${item.id}_deposit`] || "No deposit"}
                                </Header>
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Header as="h6">
                                  {item[`${item.id}_due`] || "No Due"}
                                </Header>
                              </Grid.Column>
                              <Grid.Column width={3}>
                                <Header as="h6">
                                  {item.subtotal || "No Total"}
                                </Header>
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Header as="h6">
                                  {item.calculatedTax || "No Tax"}
                                </Header>
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Header as="h6">
                                  {item.total || "No Tax"}
                                </Header>
                              </Grid.Column>
                            </Grid.Row>
                          ))}
                      </Grid>
                    )}
                  </Transition.Group>

                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <Header as="h2">Start Date</Header>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Header as="h2">Finish Date</Header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={8}>
                        <Statistic
                          label={startHour}
                          value={format(
                            moment(startDate * 1000).toDate(),
                            "ddd MMM D"
                          )}
                          text
                        />
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <Statistic
                          label="Estimated"
                          value={format(
                            moment(
                              completionDate && completionDate.seconds * 1000
                            ).toDate(),
                            "ddd MMM D"
                          )}
                          text
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <Header as="h2">Notes</Header>
                  <p>{notes}</p>
                </div>
              ) : (
                <div>
                    {paidInApp ? 
                    <Message warning>
                      <Message.Header>
                        This Contractor is Paid Through Yaybour
                      </Message.Header>
                      <p>
                        You need a verified credit card or a connected account
                        in order to pay.
                      </p>
                    </Message>:
                    <Message warning>
                    <Message.Header>
                      This Contractor is Paid Off the App
                    </Message.Header>
                    <p>
                      Yaybour is not responsible for ensuring payments
                    </p>
                  </Message>

                  }

                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={4}>
                        {" "}
                        <Header as="h2">Total</Header>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        {" "}
                        <Header as="h2"> </Header>
                      </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                      <Grid.Column width={4}>
                        {" "}
                        <Statistic
                          style={{ marginBottom: "40px" }}
                          color="green"
                        >
                          <Statistic.Value>
                            <Icon name="dollar" />
                            {total}
                          </Statistic.Value>
                          <Statistic.Label>
                            {showDetails ? (
                              <Button
                                style={{ width: "100%" }}
                                onClick={() =>
                                  this.setState({ showDetails: false })
                                }
                              >
                                Hide Details
                              </Button>
                            ) : (
                              <Button
                                style={{ width: "100%" }}
                                onClick={() =>
                                  this.setState({ showDetails: true })
                                }
                              >
                                Show Details
                              </Button>
                            )}
                          </Statistic.Label>
                        </Statistic>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        {" "}
                        {contract ? (
                          <Label>Contractor Hired</Label>
                        ) : (
                          <Button
                            loading={loading}
                            onClick={() => this.handleHire()}
                            positive
                            size="massive"
                          >
                            Hire Contractor
                          </Button>
                        )}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <Transition.Group animation="slide down" duration={300}>
                    {showDetails && (
                      <Grid style={{ marginBottom: "30px" }}>
                        <Grid.Row>
                          <Grid.Column width={2}>
                            <Header as="h4">Line Item</Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header as="h4">Deposit</Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header as="h4">Due</Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header as="h4">Sub-Total</Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header as="h4">Taxes</Header>
                          </Grid.Column>
                          <Grid.Column width={2}>
                            <Header as="h4">Total</Header>
                          </Grid.Column>
                        </Grid.Row>

                        {lineItemsArray &&
                          lineItemsArray.map(item => (
                            <Grid.Row>
                              <Grid.Column width={2}>
                                <Header as="h6">{item.id || "No Name"}</Header>
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Header as="h6">
                                  {item[`${item.id}_deposit`] || "No deposit"}
                                </Header>
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Header as="h6">
                                  {item[`${item.id}_due`] || "No Due"}
                                </Header>
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Header as="h6">
                                  {item.subtotal || "No Total"}
                                </Header>
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Header as="h6">
                                  {item.calculatedTax || "No Tax"}
                                </Header>
                              </Grid.Column>
                              <Grid.Column width={2}>
                                <Header as="h6">
                                  {item.total || "No Tax"}
                                </Header>
                              </Grid.Column>
                            </Grid.Row>
                          ))}
                      </Grid>
                    )}
                  </Transition.Group>

                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={4}>
                        <Header as="h2">Start Date</Header>
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Header as="h2">Finish Date</Header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={4}>
                        <Statistic
                          label={startHour}
                          value={format(
                            moment(startDate * 1000).toDate(),
                            "ddd MMM D"
                          )}
                          text
                        />
                      </Grid.Column>
                      <Grid.Column width={4}>
                        <Statistic
                          label="Estimated"
                          value={format(
                            moment(
                              completionDate && completionDate.seconds * 1000
                            ).toDate(),
                            "ddd MMM D"
                          )}
                          text
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  <Header as="h2">Notes</Header>
                  <p>{notes}</p>
                </div>
              )}
            </div>
          </Modal.Content>
        </Modal>
      </Responsive>
    );
  }
}

export default connect(
  mapState,
  actions
)(ViewQuoteModal);
