import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
import scrollToComponent from "react-scroll-to-component";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import moment from "moment";
import OwnerProfile from "../../job/JobDashboard/OwnerProfile";
import format from "date-fns/format";
import TextInput from "../../../app/common/form/TextInput";
import { toastr, remove } from "react-redux-toastr";
import { hireContractor } from "../../modals/QuoteJobModal/quoteActions";
import SignatureCanvas from "react-signature-canvas";
import {
  Modal,
  Transition,
  Header,
  Button,
  Image,
  Divider,
  Statistic,
  Grid,
  Icon,
  Message,
  Label,
  Responsive,
  Input
} from "semantic-ui-react";
import { objectToArray } from "../../../app/common/util/helpers";
const query = ({ auth, match }) => {
  const authenticated = auth.isLoaded && !auth.isEmpty;
  const jobId = match.params.id && match.params.id.split("_")[0];
  if (authenticated) {
    return [
      {
        collection: "job_quotes",
        doc: match.params.id,
        storeAs: "quote"
      },
      {
        collection: "jobs",
        doc: jobId,
        storeAs: "job"
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
  job: state.firestore.ordered.job && state.firestore.ordered.job[0],
  authenticated: state.firebase.auth.isLoaded && !state.firebase.auth.isEmpty,
  ownerOfQuoteUid:
    (state.firestore.ordered.quote &&
      state.firestore.ordered.quote[0] &&
      state.firestore.ordered.quote[0].ownerData &&
      state.firestore.ordered.quote[0].ownerData.ownerUid) ||
    {}
});

const actions = { hireContractor };

class QuoteDetailedPage extends Component {
  state = {
    showDetails: false,
    hireLoader: false,
    trimmedDataURL: null,
    firstName: "",
    lastName: ""
  };
  sigPad = {};
  clear = () => {
    this.sigPad.clear();
    this.setState({contractSigned:false})
  };

handleOnEnd = () =>{
  console.log('end')
}

  trim = (e) => {
    this.setState({
      trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL("image/png"),
      showContract: false,
      showSign: false
    });

  //  this.scrollToMyRef(e, 0)
  };
  handleOnUpdate = (e, { width }) => this.setState({ width });
  scrollToMyRef = (eChild, offset) => {
    console.log('scroll to', eChild.currentTarget)
    scrollToComponent(eChild.currentTarget, {
      offset:-70,
      align: "top",
      duration: 600
    });
  };


toggleShowSign = (e) => {

this.setState({showSign:(!this.state.showSign)})

this.scrollToMyRef(e, 0)


}

  handleHire = async () => {
 
        this.setState({ hireLoader: true });
        await this.props.hireContractor(this.props.selectedQuote, this.state.trimmedDataURL, this.state.firstName, this.state.lastName);
        this.setState({ hireLoader: false });

  };

  render() {
    const { showDetails, hireLoader, width, trimmedDataURL } = this.state;
    const {
      selectedQuote,
      ownerOfQuoteUid,
      auth,
      authenticated,
      loading,
      requesting,
      job
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

    const { phases } = job || {};

    const { showSign, showContract } = this.state || false;

    const lineItemsArray = objectToArray(lineItems) || [];

    let payments = [];

    for (var i = 0; i < (lineItemsArray && lineItemsArray.length); i++) {
      const item = lineItemsArray[i];
      const id = item.id;

      let deposit = Number(item[`${id}_deposit`]);
      let due = Number(item[`${id}_due`]);
      let taxType = item[`${id}_tax`];

      //  let subTotal = due+deposit
      let taxRate;

      switch (taxType) {
        case "gst5pst5":
          taxRate = 0.1;
          break;
        case "gst5":
          taxRate = 0.05;
          break;
        case "pst5":
          taxRate = 0.05;
          break;
        case "noTax":
          taxRate = 0.0;
          break;
        default:
          taxRate = 0.0;
      }

      if (deposit > 0) {
        let depositTax = deposit * taxRate;
        let depositPayment = depositTax + deposit;
        payments.push({ id: id, type: "deposit", amount: depositPayment });
      }

      if (due > 0) {
        let dueTax = due * taxRate;
        let duePayment = dueTax + deposit;
        payments.push({ id: id, type: "due", amount: duePayment });
      }
    }
    console.log({ payments });

    let paidInApp = false;
    if (paymentType === "connectedAccount" || paymentType === "creditCard") {
      paidInApp = true;
    }
    const { startDate, startHour, completionDate } = schedule || {};

    const CUSTOM_TABLET_CUTOFF = 800;
    const compactDisplayMode = width >= CUSTOM_TABLET_CUTOFF ? false : true;

    if (!isLoaded(selectedQuote) || isEmpty(selectedQuote) || requesting)
      return <LoadingComponent inverted={true} />;

    return (
      <div style={{ paddingTop: 30, margin: 10 }}>
        {authenticated ? (
          auth.uid === ownerOfQuoteUid ? (
            <div>
              <Responsive fireOnMount onUpdate={this.handleOnUpdate} />
              {true ? (
                <Grid style={{padding:0, margin:0}}>

                <Grid.Column width={compactDisplayMode?0:5}>





                </Grid.Column>


                <Grid.Column style={{ padding:0, margin:0}} width={compactDisplayMode?16:6}>
                <div style={{width:"auto", display:"block", marginLeft:"auto", marginRight:"auto",}}>
                  {paidInApp ? (
                    <Message warning>
                      <Message.Header>
                        This Contractor is Paid Through Yaybour
                      </Message.Header>
                      <p>
                        You need a verified credit card or a connected account
                        in order to pay.
                      </p>
                    </Message>
                  ) : (
                    <Message warning>
                      <Message.Header>
                        This Contractor is Paid Off the App
                      </Message.Header>
                      <p>Yaybour is not responsible for ensuring payments</p>
                    </Message>
                  )}

                  <Divider />
                  <div style={{width:"100%",}}>

   
     
                <OwnerProfile
                
                    selectedQuote={selectedQuote}
                    ownerUid={quoterUid}
                    compactDisplayMode={compactDisplayMode}
                    profileType="contractor"
                  />



                </div>
                 
                  <Divider />
                  <Grid style={{  }}>
                    {contract ? (
                      <Label
                        color="green"
                        size="huge"
                        style={{ textAlign: "center", width: "100%" }}
                      >
                        <Icon name="check" />
                        Contractor Hired
                      </Label>
                    ) : (
                      <div style={{ width: "100%" }}>
                        <Button.Group
                          style={{ width: "100%", paddingBottom: 10 }}
                        >
                          {" "}
                          <Button
                            loading={hireLoader}
                            onClick={
                               (e) => this.toggleShowSign(e)
                            }
                            positive={!this.state.trimmedDataURL}
                            size="small"
                          >
                            {this.state.trimmedDataURL
                              ? "Signed "
                              : "Contract  "}
                            {this.state.showSign && <Icon name="arrow up" />}
                            {!this.state.showSign && <Icon name="arrow down" />}
                          </Button>
                          <Button
                            loading={hireLoader}
                            disabled={!this.state.contractSigned}
                            onClick={() => this.handleHire()}
                            positive={this.state.trimmedDataURL}
                            size="small"
                          >
                            Hire
                          </Button>
                        </Button.Group>

                        <Transition.Group animation="slide down" duration={300}>
                          {this.state.showContract && (
                            <div
                              style={{
                                height: 500,
                                backgroundColor: "white",
                                width: "100%",
                                overflowX: "hidden",
                                overflowY: "auto"
                              }}
                            />
                          )}
                        </Transition.Group>

                        <Transition.Group animation="slide down" duration={300}>
                          {this.state.showSign && (
                            <div
                              style={{
                                height: 500,
                                backgroundColor: "lightgrey",
                                width: "100%"
                              }}
                            >
                              <div
                                style={{
                                  height: 300,
                                  backgroundColor: "white",
                                  width: "100%",
                                  overflowX: "hidden",
                                  overflowY: "auto",
                                  padding: 10
                                }}
                              >
                                <Header as="h3">Phase Payments </Header>

                                <p> You agree to pay the contractor the following payments</p>


                                {payments &&
                                  payments.map((payment, index) => (
                                    <p>
                                      {`${index + 1}: ${payment.id} (${
                                        payment.type
                                      }) - $${payment.amount}`}{" "}
                                    </p>



                                  ))}

                                <Header as="h3">Phase Descriptions </Header>

                                {phases &&
                                  phases.map((phase,index) => (
                                    <div>
                                    <Header as="h4" style={{textDecoration:"underline", margin:3}}>{`${index+1}: ${phase.phaseName}`}</Header>
                                    {phase.sectionsIncluded&&phase.sectionsIncluded.length>0 ? 
                                      
                                      phase.sectionsIncluded.map(section=>(
<div>
                                        <Header as = "h5" style={{ backgroundColor:"green", color:"white", margin:3}}>{section.sectionName}</Header>
                                        {section.clausesIncluded&&section.clausesIncluded.map((clause,index) =>(
                                          <div>
                                          <p style={{marginLeft:10}}>{`${index+1}. ${clause.clause}`}</p>
                                          </div>
                                        ))}
                                          
</div>
                                      ))
                                     
                                      
                                      
                                      : "No Description"}
                                    </div>
                                  ))}

<Header as="h3">Measurements and Change Orders</Header>

<p> The aggreed price may be based on third-party or home owner measurements. If measurements of the job are inaccurate, the Contractor 
  can request to update the contract and price </p>


                        <Header as="h3">Insurance and Liability</Header>

                         <p> Yaybour is not responsible for ensuring that the contractor has the proper insurance coverage or workers compensation for any job </p>
                         <p> Yaybour is not a general contractor, sub-contractor, or supplier.</p>
                         <p> Yaybour is not responsible for settling payment disputes, incomplete work, or any other disputes.</p>

                              </div>

                              <div name="form">
                                {format(
                                  moment(Date.now()).toDate(),
                                  "dddd, MMMM, Do, YYYY"
                                )}

                                <Grid style={{ margin: 0, padding: 0 }}>
                                  <Grid.Column width={7}>
                                    <Input
                                      style={{ display: "inline-block", width:100}}
                                      value={this.state.firstName}
                                      size="mini"
                                      onChange={e =>
                                        this.setState({
                                          firstName: e.target.value
                                        })
                                      }
                                      placeholder="First Name"
                                    />
                                  </Grid.Column>

                                  <Grid.Column width={7}>
                                    <Input
                                      size="mini"
                                      style={{ display: "inline-block" , width:100}}
                                      value={this.state.lastName}
                                      onChange={e =>
                                        this.setState({
                                          lastName: e.target.value
                                        })
                                      }
                                      placeholder="Last Name"
                                    />
                                  </Grid.Column>
                                </Grid>

                                <div
                                onClick={()=>console.log('clicked')}
                                  style={{
                                    height: 75,
                                    width: 200,
                                    border: "3px dotted green",
                                    marginLeft: 10,
                                    marginRight: 10
                                  }}
                                >
                                  {this.state.trimmedDataURL ? (
                                    <Image
                                      style={{ height: 75, width: 330 }}
                                      src={this.state.trimmedDataURL}
                                    />
                                  ) : (
                                    <div  style={{width:200, height:75, display:"relative"}}>
                                    <div   style={{position:"absolute", zIndex:50}}>
                                    <SignatureCanvas
                                      penColor="green"
                                      onEnd={()=>this.setState({contractSigned: true})}
                                      canvasProps={{
                                        width: 200,
                                        height: 75,
                                        
                                        className: "sigCanvas"
                                      }}
                                      ref={ref => {
                                        this.sigPad = ref;
                                      }}
                                    />
                                    </div>
                                    <div style={{position:"absolute", textAlign:"center", paddingTop:25, paddingLeft:10, opacity:0.5, height:"75", width:"200", fontSize:30, color:"grey"}}>
                                     SIGN HERE
                                    </div>
                                    </div>
                                  )}
                                </div>

                                <div style={{ margin: 5 }}>
                                  <Button.Group style={{ width: "100%" }}>
                                    {!this.state.trimmedDataURL && (
                                      <Button onClick={this.clear}>
                                        Clear
                                      </Button>
                                    )}
                                    {this.state.trimmedDataURL ? (
                                      <Button
                                        primary
                                        disabled={
                                          this.state.firstName === "" ||
                                          this.state.lastName === ""
                                        }
                                        onClick={() =>
                                          this.setState({ showSign: false })
                                        }
                                      >
                                        Hide
                                      </Button>
                                    ) : (
                                      <Button
                                        primary
                                        disabled={
                                          this.state.firstName === "" ||
                                          this.state.lastName === "" || (!this.state.contractSigned)
                                        }
                                        onClick={e=>this.trim(e)}
                                      >
                                        Sign Contract
                                      </Button>
                                    )}
                                  </Button.Group>
                                </div>
                              </div>
                            </div>
                          )}
                        </Transition.Group>
                      </div>
                    )}
                    <Divider />

                    <Grid.Row>
                      <Grid.Column  centered>
                      {" "}
                      <Statistic style={{ marginBottom: "40px", width:"100%", textAlign: "center" }} color="green">
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
                              size="tiny"
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
                      <Grid.Column style={{ textAlign: "center" }} width={8}>
                        <Header as="h2">Start Date</Header>
                      </Grid.Column>
                      <Grid.Column style={{ textAlign: "center" }} width={8}>
                        <Header as="h2">Finish Date</Header>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column style={{ textAlign: "center" }} width={8}>
                        <Statistic
                          label={startHour}
                          value={format(
                            moment(startDate * 1000).toDate(),
                            "ddd MMM D"
                          )}
                          text
                        />
                      </Grid.Column>
                      <Grid.Column style={{ textAlign: "center" }} width={8}>
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
                  <p style={{paddingBottom:200}}>{notes}</p>
                </div>
                  
</Grid.Column>



<Grid.Column width={compactDisplayMode?0:5}>

                  
</Grid.Column>


                </Grid>

                
              ) : (
                <div>
                  {paidInApp ? (
                    <Message warning>
                      <Message.Header>
                        This Contractor is Paid Through Yaybour
                      </Message.Header>
                      <p>
                        You need a verified credit card or a connected account
                        in order to pay.
                      </p>
                    </Message>
                  ) : (
                    <Message warning>
                      <Message.Header>
                        This Contractor is Paid Off the App
                      </Message.Header>
                      <p>Yaybour is not responsible for ensuring payments</p>
                    </Message>
                  )}
                  <Header as="h3">Quoted By</Header>
                  <OwnerProfile
                    selectedQuote={selectedQuote}
                    ownerUid={quoterUid}
                    compactDisplayMode={compactDisplayMode}
                    profileType="contractor"
                  />
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
