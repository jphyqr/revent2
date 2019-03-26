import React, { Component } from "react";
import {
  Header,
  Grid,
  Reveal,
  Icon,
  Message,
  Card,
  Image
} from "semantic-ui-react";
class AboutDashboard extends Component {
  render() {
    return (
      <div>
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
        
          <label style={{ padding: "10px", color: "orange" }}>SAVE</label> 
          TIME MONEY AND STRESS
          <label style={{ paddingLeft: "10px", color: "orange" }}>ON</label> 
          <label style={{ padding: "10px", color: "orange" }}>ANY</label> 
          <label style={{ padding: "10px", color: "orange" }}>RENOVATION</label> 
        
        </Header>

        <Grid centered columns={5}>
          <Grid.Column textAlign="centered">
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Message style={{ height: 170, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:20, padding:10}} >SAVE TIME</Message.Header>
                  <Message.List>
                    <Message.Item>Custom Job Posting Modules</Message.Item>
                    <Message.Item>Direct Messaging</Message.Item>
                  </Message.List>
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
              <Message style={{ height: 170, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:20, padding:10}}>SAVE MONEY</Message.Header>
                  <Message.List>
                    <Message.Item>Real Time Dispatch</Message.Item>
                    <Message.Item>Online Quoting</Message.Item>
                  </Message.List>
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
              <Message style={{ height: 170, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:20, padding:10}}>PEACE OF MIND</Message.Header>
                  <Message.List>
                    <Message.Item>
                      In App Payments with Escrow and Recourse
                    </Message.Item>
                    <Message.Item>Automated construction contacts</Message.Item>
                    <Message.Item>
                      Direct messaging to keep your number private
                    </Message.Item>
                  </Message.List>
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
              <Message style={{ height: 170, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:20, padding:10}}>FIND THE RIGHT PERSON</Message.Header>
                  <Message.List>
                    <Message.Item>Peer Rated Profiles</Message.Item>
                    <Message.Item>App tracked volume stats</Message.Item>
                    <Message.Item>Verification documents</Message.Item>
                    <Message.Item>Endorsed Skills</Message.Item>
                  </Message.List>
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
              <Message style={{ height: 170, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:20, padding:10}}>SAVE EFFORT</Message.Header>
                  <Message.List>
                    <Message.Item>Supply package creation</Message.Item>
                    <Message.Item>Material drop off</Message.Item>
                    <Message.Item>Tool Rental / Used Marketplace</Message.Item>
                    <Message.Item>
                      Financing, Legal, Design, Engineering, Permit help
                    </Message.Item>
                  </Message.List>
                </Message.Content>
              </Message>
            </div>
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
          <label style={{ paddinRight: "10px", color: "orange" }}>VALUE </label>{" "}
          ADDED FOR
          <label style={{ padding: "10px", color: "orange" }}>ANY</label>
          ROLE IN CONSTRUCTION
        </Header>

        <Grid centered columns={8}>
          <Grid.Column >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
          
              <Message style={{ height: 150, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:15, padding:8}} >HOME OWNERS</Message.Header>
                    Get the right person on your project today.
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
          
              <Message style={{ height: 150, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:15, padding:8}}>BUILDERS/GC</Message.Header>
                  Strong leads.  Manage your projects
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
          
              <Message style={{ height: 150, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:15, padding:8}}>SUB CONTRACTORS</Message.Header>
                  Dispatched leads for your subscribed jobs
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
          
              <Message style={{ height: 150, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:15, padding:8}}>SUPPLIERS</Message.Header>
                  Inbound orders direct to your store
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
          
              <Message style={{ height: 150, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:15, padding:8}}>TRANSPORTERS</Message.Header>
                  Make money delivering construction materials
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
          
              <Message style={{ height: 150, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:15, padding:8}}>LABOURERS</Message.Header>
                  Find your next job.  Manage your portfolio
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
          
              <Message style={{ height: 150, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:15, padding:8}}>AGENTS</Message.Header>
                  List services or Advertise 
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
          
              <Message style={{ height: 150, width: "100%" }}>
                <Message.Content>
                  <Message.Header style={{fontSize:15, padding:8}}>LENDERS</Message.Header>
                  Finance construction projects
                </Message.Content>
              </Message>
              </div>
              </Grid.Column>

         
          </Grid>

          <Header
          as="h1"
          textAlign="center"
          style={{
            fontSize: 20,
            color: "orange",
            paddingTop: "60px",
            paddingBottom: "30px"
          }}
        >
       The construction marketplace of tomorrow: built for, and built in Regina, Saskatchewan.
            

        </Header>
      </div>
    );
  }
}

export default AboutDashboard;
