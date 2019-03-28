import React, { Component } from 'react'
import {Tab,Button,Grid} from 'semantic-ui-react'
import NewPane from './NewPane'
import UsedPane from './UsedPane'
import RentalPane from './RentalPane'
import MyActivity from './MyActivity/MyActivity'
 class MarketDashboard extends Component {


    renderPanes = () => {
        // const { profile } = this.state;
        // const { openModal,uploadProfileImage, labour_profile, createLabourProfile } = this.props;
        // const { builderProfile, contractorProfile } = profile || {};
        return [
          {
            menuItem: "New",
            render: () => (
              <Tab.Pane attached style={{ height: "100%" }}>
                <NewPane

                />
              </Tab.Pane>
            )
          },
          //{ menuItem: <MessageMenuItem/>, render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
          {
            menuItem: "Used",
            render: () => (
              <Tab.Pane attached style={{ height: "100%" }}>
                <UsedPane

                />
              </Tab.Pane>
            )
          },
          {
            menuItem: "Rental",
            render: () => (
              <Tab.Pane attached style={{ height: "100%" }}>
                <RentalPane

                />
              </Tab.Pane>
            )
          }
        ];
      };
    



  render() {
    return (
        <Grid>
        <Grid.Column width={4}>
        <MyActivity/>
        
        </Grid.Column> 
        <Grid.Column width={12} >       
          <Tab
          attached
            style={{  width: "100%", height: "100%", padding:20 }}
            menu={{ secondary: true }}
            panes={this.renderPanes()}
          /></Grid.Column>
      </Grid>
    )
  }
}


export default MarketDashboard