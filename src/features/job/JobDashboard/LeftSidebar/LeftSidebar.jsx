import React, { Component } from "react";
import { Tab, Image } from "semantic-ui-react";
import LabourList from "./LabourList/LabourList";
const panes = [
  {
    menuItem: "Deals",
    render: () => (
 
      <Tab.Pane attached={false}>
        <div style={{overflowY:" auto", overflowX:" hidden", maxHeight:475}}>
        <Image fluid src="/assets/promotion.png" />
        </div>
      </Tab.Pane>
   
    )
  },
  {
    menuItem: "Used",
    render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>
  },
  {
    menuItem: "Labour",
    render: () => (
      <Tab.Pane attached={false}>
        <div style={{overflowY:" auto", overflowX:" hidden", maxHeight:475}}>
        <LabourList />
        </div>
      </Tab.Pane>
    )
  }
];

class LeftSidebar extends Component {
  render() {
    return (
      <div>
        <Tab menu={{ secondary: true }} panes={panes} />
      </div>
    );
  }
}

export default LeftSidebar;
