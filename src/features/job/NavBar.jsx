import React, { Component } from "react";
import { Grid, Header } from "semantic-ui-react";
class NavBar extends Component {
  render() {
    const { handleSelectTab, navShow } = this.props;
    return (
      <div style={{ margin: 15 }}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2} />
            <Grid.Column
              width={2}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3" style={{color: (navShow==="map") ? "orange": "grey"}} onClick={() => handleSelectTab("map")}>
                Map
              </Header>
            </Grid.Column>
            <Grid.Column
              width={2}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3" style={{color: (navShow==="profile") ? "orange": "grey"}}onClick={() => handleSelectTab("profile")}>
                Profile
              </Header>
            </Grid.Column>
            <Grid.Column
              width={2}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3" style={{color: (navShow==="labour") ? "orange": "grey"}} onClick={() => handleSelectTab("labour")}>
                Labour
              </Header>
            </Grid.Column>
            <Grid.Column
              width={2}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3"style={{color: (navShow==="market") ? "orange": "grey"}} onClick={() => handleSelectTab("market")}>
                Market
              </Header>
            </Grid.Column>

            <Grid.Column
              width={2}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3" style={{color: (navShow==="deals") ? "orange": "grey"}} onClick={() => handleSelectTab("deals")}>
                Deals
              </Header>
            </Grid.Column>
            <Grid.Column
              width={2}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <Header as="h3"style={{color: (navShow==="stats") ? "orange": "grey"}} onClick={() => handleSelectTab("stats")}>
                Stats
              </Header>
            </Grid.Column>
            <Grid.Column width={2} />
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default NavBar;
