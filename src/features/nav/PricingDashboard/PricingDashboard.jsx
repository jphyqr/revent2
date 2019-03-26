import React, { Component, createRef } from 'react'
import {Header, Grid, Sticky,Ref, Divider,Message,Label,Statistic, Step, Icon} from 'semantic-ui-react'
class PricingDashboard extends Component {
  
  render() {
    return (
        <div >


<Step.Group ordered widths={3}>
    <Step active>
      <Step.Content>
        <Step.Title>ALPHA</Step.Title>
        <Step.Description><label style={{color:"red"}}>FULL</label>  Feb 1 - April 30</Step.Description>
      </Step.Content>
    </Step>

    <Step >
      <Step.Content>
        <Step.Title>BETA</Step.Title>
        <Step.Description>May 1 - June 30</Step.Description>
      </Step.Content>
    </Step>

    <Step >
      <Step.Content>
        <Step.Title>LAUNCH</Step.Title>
        <Step.Description>July 1st</Step.Description>
      </Step.Content>
    </Step>
  </Step.Group>


        <Header
          as="h1"
          textAlign="center"
          style={{
            fontSize: 40,
            color: "white",
            paddingTop: "60px",
            paddingBottom: "30px"
          }}
        >
        
          <label style={{ paddingLeft: "10px", color: "orange" }}>JOIN</label> 
          <label style={{ padding: "10px", color: "orange" }}>BETA</label> 
          BY APRIL 15TH AND RECEIVE
          <label style={{ paddingLeft: "10px", color: "orange" }}>15% OFF</label> 
          <label style={{ padding: "10px", color: "orange" }}>FOR ONE YEAR</label> 
        
        </Header>

        <Grid centered columns={5}>

        <Grid.Column textAlign="centered">
           
           </Grid.Column>
        <Grid.Column textAlign="centered">
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Message style={{ height: 400, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:30, padding:20}}>Free</Message.Header>
                  <Message.List style={{height: 100}}>
                    <Message.Item>For Builders and Labourers</Message.Item>
                    <Message.Item>In-App Payments for Materials, Transportation, Financing</Message.Item>
                    <Message.Item>8% fee on in-app payments</Message.Item>
                    </Message.List>
                    <Divider></Divider>
                    <Message.Content style={{textAlign:"left"}}> <Icon size="large" name='check circle outline'></Icon> Post General Jobs </Message.Content> 
              <Message.Content style={{textAlign:"left"}}> <Icon size="large" name='circle outline'></Icon> Subscribe and Quote Jobs </Message.Content> 
              <Message.Content style={{textAlign:"left"}}> <Icon size="large" name='circle outline'></Icon> Endorse Labourers </Message.Content> 
              <Message.Content style={{textAlign:"left"}}>  <Icon size="large" name='circle outline'></Icon> Post Exclusive Jobs </Message.Content> 
                </Message.Content>
              </Message>
            </div>
          </Grid.Column>




          <Grid.Column textAlign="centered">
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Message style={{ height: 400, width: "100%" }}>
                <Message.Content>
                  <Message.Header  style={{fontSize:30, padding:20}}>Base</Message.Header>
                  <Message.List style={{height: 100}}>
                  <Message.Item>For Contractors</Message.Item>
                    <Message.Item>One Month Free Trial</Message.Item>
                    <Message.Item>$125 / month</Message.Item>
                    <Message.Item>8% fee on in-app payments</Message.Item>
                    </Message.List>
                    <Divider></Divider>
                    <Message.Content style={{textAlign:"left"}}> <Icon size="large" name='check circle outline'></Icon> Post General Jobs </Message.Content> 
              <Message.Content style={{textAlign:"left"}}> <Icon size="large" name='check circle outline'></Icon> Subscribe and Quote Jobs </Message.Content> 
              <Message.Content style={{textAlign:"left"}}> <Icon size="large" name='check circle outline'></Icon> Endorse Labourers </Message.Content> 
              <Message.Content style={{textAlign:"left"}}>  <Icon size="large" name='circle outline'></Icon> Post Exclusive Jobs </Message.Content> 
                </Message.Content>
              </Message>
            </div>
          </Grid.Column>
 
          <Grid.Column textAlign="centered">
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Message style={{ height: 400, width: "100%" }}>
                <Message.Content>
                  <Message.Header  style={{fontSize:30, padding:20}}>Exclusive</Message.Header>
                  <Message.List style={{height: 100}}>
                  <Message.Item>For Specialists</Message.Item>
                    <Message.Item>$250 / month</Message.Item>
                    <Message.Item>8% fee on in-app payments</Message.Item>
                  
                    </Message.List>
                    <Divider></Divider>
                    <Message.Content style={{textAlign:"left"}}> <Icon size="large" name='check circle outline'></Icon> Post General Jobs </Message.Content> 
              <Message.Content style={{textAlign:"left"}}> <Icon size="large" name='check circle outline'></Icon> Subscribe and Quote Jobs </Message.Content> 
              <Message.Content style={{textAlign:"left"}}> <Icon size="large" name='check circle outline'></Icon> Endorse Labourers </Message.Content> 
              <Message.Content style={{textAlign:"left"}}>  <Icon size="large" name='check circle outline'></Icon> Post Exclusive Jobs </Message.Content> 
                </Message.Content>
              </Message>
            </div>
          </Grid.Column>

          <Grid.Column textAlign="centered">
        
          </Grid.Column>

        </Grid>



          <Header
          as="h1"
          textAlign="center"
          style={{
            fontSize: 30,
            color: "white",
            paddingTop: "60px",
            paddingBottom: "30px"
          }}
        >
          THE
          <label style={{ paddingLeft: "10px", color: "orange" }}>CONSTRUCTION </label>{" "}
          
          <label style={{ padding: "10px", color: "orange" }}>MARKETPLACE </label>{" "}
            OF TOMORROW  
            <label style={{ paddingLeft: "10px", color: "orange" }}>BUILT </label>
            <label style={{ padding: "10px", color: "orange" }}>FOR </label>
             AND BUILT IN 
            <label style={{ padding: "10px", color: "orange" }}>REGINA </label>
            

        </Header>
      </div>
    )
  }
}

export default  PricingDashboard