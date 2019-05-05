import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import moment from "moment";
import OwnerProfile from '../../job/JobDashboard/OwnerProfile'
import format from "date-fns/format";
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
import { objectToArray } from "../../../app/common/util/helpers";
const query = ({ auth, match }) => {
  const authenticated = auth.isLoaded && !auth.isEmpty;
  if (authenticated) {
    return [
      {
        collection: "job_quotes",
        doc: match.params.id,
        storeAs: "quote"
      }
    ];
  } else {
    return [];
  }
};
const mapState = state => ({
  loading: state.async.loading,
  auth: state.firebase.auth,
  selectedQuote:
    (state.firestore.ordered.quote && state.firestore.ordered.quote[0]) || {},

  authenticated: state.firebase.auth.isLoaded && !state.firebase.auth.isEmpty,
  ownerOfQuoteUid:
    (state.firestore.ordered.quote &&
      state.firestore.ordered.quote[0] &&
      state.firestore.ordered.quote[0].ownerData &&
      state.firestore.ordered.quote[0].ownerData.ownerUid) ||
    {}
});

const actions = {};

class QuoteDetailedPage extends Component {
  state = { showDetails: false, hireLoader: false };

  handleOnUpdate = (e, { width }) => this.setState({ width });

  render() {
    const { showDetails, hireLoader, width } = this.state;
    const {
      selectedQuote,
      ownerOfQuoteUid,
      auth,
      authenticated,
      loading,
      requesting
    } = this.props || {};

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
      quoterUid,
      quotedByPhotoURL,
      schedule,
      total,
      contract
    } = selectedQuote || {};

    let paidInApp = false;
    if (paymentType === "connectedAccount" || paymentType === "creditCard") {
      paidInApp = true;
    }
    const { startDate, startHour, completionDate } = schedule || {};
    const lineItemsArray = objectToArray(lineItems) || [];

    const CUSTOM_TABLET_CUTOFF = 800;
    const compactDisplayMode = width >= CUSTOM_TABLET_CUTOFF ? false : true;

    if (!isLoaded(selectedQuote) || isEmpty(selectedQuote) || requesting)
      return <LoadingComponent inverted={true} />;

    return (
      <div style={{ paddingTop: 30 , margin:10}}>
        {authenticated ? (
          auth.uid === ownerOfQuoteUid ? (
            <div>
              <Responsive fireOnMount onUpdate={this.handleOnUpdate} />
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
                
                <Header as="h3">Quoted By</Header>
                <OwnerProfile
                  
                  ownerUid={quoterUid}
                  compactDisplayMode={compactDisplayMode}
                  profileType="contractor"
                />
                  <Grid style={{ margin: 10 }}>
                    {contract ? (
                      <Label
                        color="green"
                        size="huge"
                        style={{ textAlign: "center", width: "100%" }}
                      >
                        <Icon name="check" />Contractor Hired
                      </Label>
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
                      <Statistic style={{ marginBottom: "40px" }} color="green">
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
          ) : (
            "You are not the owner of this job"
          )
        ) : (
          "Login to view Quote"
        )}
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(QuoteDetailedPage));
