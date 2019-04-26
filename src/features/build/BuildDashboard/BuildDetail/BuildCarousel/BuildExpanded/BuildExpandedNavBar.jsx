import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
class BuildExpandedNavBar extends Component {
  state = { hoveredTab: "" };
  render() {
    const { selectedTab, handleSelectTab , compactDisplayMode} = this.props;
    const tabs = [
      { key: "overview", value: "Overview" },
      { key: "contractors", value: "Contractors" },
      { key: "supplies", value: "Supplies" },
      { key: "tips", value: "Tips" }
    ];
    return (
   
       <div style={{width:"100%"}}>
       <Grid centered columns={4}>
        {tabs &&
          tabs.map(tab => (
            <Grid.Column
           
            
              onMouseEnter={() => this.setState({ hoveredTab: tab.key })}
              onMouseLeave={() => this.setState({ hoveredTab: "" })}
              onClick={() => handleSelectTab(tab.key)}
              style={{
                cursor:"pointer",
                opacity: this.state.hoveredTab === tab.key ? 1 : 0.8,
                marginLeft: 0,// compactDisplayMode? "0px": "12px",
               //display: "inline-block",
                marginBottom: 10,
                fontSize: compactDisplayMode? 12:20,
                textAlign:"center",
                color: selectedTab === tab.key ? "orange" : "lightGrey"
              }}
            >
              {tab.value}
              </Grid.Column>
          ))}
</Grid>
</div>
     
    );
  }
}

export default BuildExpandedNavBar;
