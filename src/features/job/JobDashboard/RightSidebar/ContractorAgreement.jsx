import React, { Component } from 'react'
import SignatureCanvas from "react-signature-canvas";
import scrollToComponent from "react-scroll-to-component";
import LoadingComponent from "../../../../app/layout/LoadingComponent";
import format from "date-fns/format";
import moment from "moment";

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
    Input,
    Dimmer,
    Loader
  } from "semantic-ui-react";
 class ContractorAgreement extends Component {
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

      trim = (e) => {
        this.setState({
          trimmedDataURL: this.sigPad.getTrimmedCanvas().toDataURL("image/png"),
          showContract: false,
          showSign: false
        });}

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
            
            //this.scrollToMyRef(e, 0)
            
            
            }

            submitContract = async ()=>{
                this.setState({contractLoader:true})
               await this.props.submitContract(this.state.firstName, this.state.lastName, this.state.trimmedDataURL, Date.now())
               this.setState({contractLoader:false})
            }


    render() {
        const hireLoader = false

        if(this.state.contractLoader)return(
            <Dimmer active>
                <Loader/>
            </Dimmer>
        )

        return (
            <div style={{ width: "100%" }}>

{!(this.state.showSign||this.state.showContract||this.state.contractSigned)&&<Message warning>
                      <Message.Header>
                        Become a Contractor
                      </Message.Header>
                      <p>Sign our Contractor Agreement to list your profile</p>
                    </Message>}
                    {this.state.contractSigned&&<Message positive>
                      <Message.Header>
                        Start Contracting
                      </Message.Header>
                      <p>Create your contracting profile now</p>
                    </Message>}

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
                onClick={() => this.submitContract()}
                positive={this.state.trimmedDataURL}
                size="small"
              >
                Create Profile
              </Button>
            </Button.Group>

            <Transition.Group animation="slide down" duration={300}>
              {this.state.showContract && (
                <div
                  style={{
                    height: "auto",
                    backgroundColor: "yellow",
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
                    height: "auto",
                    backgroundColor: "lightgrey",
                    width: "100%"
                  }}
                >
                  <div
                    style={{
                      height: "auto",
                      backgroundColor: "white",
                      width: "100%",
                      overflowX: "hidden",
                      overflowY: "auto",
                      padding: 10
                    }}
                  >




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
        )
    }
}

export default ContractorAgreement