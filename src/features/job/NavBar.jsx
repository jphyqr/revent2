import React, { Component } from "react";
import { Grid, Header } from "semantic-ui-react";
class NavBar extends Component {
  render() {
    const { role, handleSelectTab, navShow , compactDisplayMode} = this.props;
   const{ isAdmin, authenticated} = role
    return (
      <div style={{ margin: 15 }}>
        <Grid columns='equal' centered relaxed>
   
        <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="post") ? "orange": "grey"}} onClick={() => handleSelectTab("post")}>
                Post
              </Header>
            </Grid.Column>
         
            <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="map") ? "orange": "grey"}} onClick={() => handleSelectTab("map")}>
                Map
              </Header>
            </Grid.Column>
            {authenticated&&
            <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
           
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="profile") ? "orange": "grey"}}onClick={() => handleSelectTab("profile")}>
                Profile
              </Header>
            </Grid.Column>}
            <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="labour") ? "orange": "grey"}} onClick={() => handleSelectTab("labour")}>
                Labour
              </Header>
            </Grid.Column>
            {isAdmin&&(!compactDisplayMode)&&   <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="market") ? "orange": "grey"}} onClick={() => handleSelectTab("market")}>
                Market
              </Header>
            </Grid.Column>}

            {isAdmin&&(!compactDisplayMode)&&  <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="deals") ? "orange": "grey"}} onClick={() => handleSelectTab("deals")}>
                Deals
              </Header>
            </Grid.Column>}
          {isAdmin&&(!compactDisplayMode)&&  <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="stats") ? "orange": "grey"}} onClick={() => handleSelectTab("stats")}>
                Stats
              </Header>
            </Grid.Column>}
         
          {isAdmin&&(!compactDisplayMode)&&  <Grid.Column
              
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as={compactDisplayMode?"h5":"h3"} style={{color: (navShow==="supporters") ? "orange": "grey"}} onClick={() => handleSelectTab("supporters")}>
                Beta
              </Header>
            </Grid.Column>}
        
        </Grid>
      </div>
    );
  }
}

export default NavBar;
