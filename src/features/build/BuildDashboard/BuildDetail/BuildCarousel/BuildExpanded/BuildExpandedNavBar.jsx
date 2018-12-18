import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
class BuildExpandedNavBar extends Component {
  state = { hoveredTab: "" };
  render() {
    const { selectedTab, handleSelectTab } = this.props;
    const tabs = [
      { key: "overview", value: "Overview" },
      { key: "contractors", value: "Contractors" },
      { key: "supplies", value: "Supplies" },
      { key: "tips", value: "Tips" }
    ];
    return (
      <div style={{ minWidth: "400", overflowY: "hidden" }}>
        {tabs &&
          tabs.map(tab => (
            <p
           
            
              onMouseEnter={() => this.setState({ hoveredTab: tab.key })}
              onMouseLeave={() => this.setState({ hoveredTab: "" })}
              onClick={() => handleSelectTab(tab.key)}
              style={{
                cursor:"pointer",
                opacity: this.state.hoveredTab === tab.key ? 1 : 0.8,
                marginLeft: "12px",
                display: "inline-block",
                fontSize: 20,
                color: selectedTab === tab.key ? "red" : "lightGrey"
              }}
            >
              {tab.value}
            </p>
          ))}
      </div>
    );
  }
}

export default BuildExpandedNavBar;
