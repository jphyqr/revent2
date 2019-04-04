import React, { Component, createRef } from 'react'
import {Header, Popup, Grid, Sticky,Ref, Divider,Message, Image, Label,Statistic, Step, Icon} from 'semantic-ui-react'
class PricingDashboard extends Component {
  
  render() {
    return (
        <div >


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
          <label style={{ paddingLeft: "10px", color: "orange" }}>15% OFF MONTHLY FEE</label> 
          <label style={{ padding: "10px", color: "orange" }}>FOR ONE YEAR</label> 
        
        </Header>
        {(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
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
                  <Popup trigger={ <Message.Item>8% fee on in-app payments</Message.Item>} content={<Image src="/assets/pricebreakdown.png" size="massive" />} inverted />
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
                    <Popup trigger={ <Message.Item>125$/month</Message.Item>} content={  <div style={{ backgroundColor:"orange", height:100, width: 500}}><Statistic>
    <Statistic.Value>2 HOURS/MONTH</Statistic.Value>
    <Statistic.Label>of time saved will recover cost.</Statistic.Label>
    
  </Statistic>

  </div>}  />
                    <Popup trigger={ <Message.Item>8% fee on in-app payments</Message.Item>} content={<Image src="/assets/pricebreakdown.png" size="massive" />} inverted />
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
                    <Popup trigger={ <Message.Item>8% fee on in-app payments</Message.Item>} content={<Image src="/assets/pricebreakdown.png" size="massive" />} inverted />
                  
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

  :
  <Message info header='Working on it!' content="We are working with industry leaders to develop a value based pricing model.  E-mail admin@yaybour.com any ideas you may have." />
            }

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