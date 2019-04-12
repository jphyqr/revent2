import React, { Component } from "react";
import { Grid, Header } from "semantic-ui-react";
class NavBar extends Component {
  render() {
    const { handleSelectTab, navShow } = this.props;
    return (
      
         <Grid centered columns={5} style={{  width:"600px", marginLeft:"auto", marginBottom:"2px", marginRight:"auto", display:"block",}}>

            <Grid.Column
             
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3" style={{color: (navShow==="payments") ? "orange": "grey"}} onClick={() => handleSelectTab("payments")}>
                Payments
              </Header>
            </Grid.Column>
            <Grid.Column
             
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3" style={{color: (navShow==="journal") ? "orange": "grey"}}onClick={() => handleSelectTab("journal")}>
                Journal
              </Header>
            </Grid.Column>
            <Grid.Column
             
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3" style={{color: (navShow==="expenses") ? "orange": "grey"}} onClick={() => handleSelectTab("expenses")}>
                Expenses
              </Header>
            </Grid.Column>
            <Grid.Column
             
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3"style={{color: (navShow==="contract") ? "orange": "grey"}} onClick={() => handleSelectTab("contract")}>
                Contract
              </Header>
            </Grid.Column>

            <Grid.Column
             
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3" style={{color: (navShow==="supplies") ? "orange": "grey"}} onClick={() => handleSelectTab("supplies")}>
                Supplies
              </Header>
            </Grid.Column>
       

        </Grid>
    
    
    );
  }
}

export default NavBar;
