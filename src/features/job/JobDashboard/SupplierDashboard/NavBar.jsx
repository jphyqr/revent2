import React, { Component } from "react";
import { Grid, Header } from "semantic-ui-react";
class NavBar extends Component {
  render() {
    const { role, handleSelectTab, navShow , compactDisplayMode} = this.props ||{};
   const{ isAdmin,  authenticated} = role ||{}
    return (
      <div style={{ margin: 15 }}>
        <Grid columns='equal' centered relaxed>
   
        {authenticated&&   <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="profile") ? "orange": "grey"}} onClick={() => handleSelectTab("profile")}>
                Profile
              </Header>
            </Grid.Column>}
         
            <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="markets") ? "orange": "grey"}} onClick={() => handleSelectTab("markets")}>
                Markets
              </Header>
            </Grid.Column>
            {authenticated&&
            <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
           
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="listings") ? "orange": "grey"}}onClick={() => handleSelectTab("listings")}>
                My Listings
              </Header>
            </Grid.Column>}
           
        
        </Grid>
      </div>
    );
  }
}

export default NavBar;
