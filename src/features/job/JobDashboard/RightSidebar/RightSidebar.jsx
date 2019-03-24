import React, { Component } from 'react'
import {Tab, Image, Segment} from 'semantic-ui-react'
import MessageMenuItem from '../../../nav/NavBar/Messages/MessagesMenuItem'
import Profile from './Profile'
// const panes = [
//     { menuItem: { key: 'profile', icon: 'users' }, render: () => <Tab.Pane style ={{height:"100%", backgroundColor:"lightgrey"}}attached={false}></Tab.Pane> },
//     { menuItem: <MessageMenuItem/>, render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
//     { menuItem: { key: 'notifications', icon: 'alarm' }, render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> },
//     { menuItem: { key: 'settings', icon: 'settings' }, render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> },
//   ]

class RightSidebar extends Component {
  render() {



    return (

      <Segment attached="bottom" style={{padding:0, marginTop: 53}}>
<div style={{ height: '498px', width: '100%' }}>
       {this.props.authenticated&&  <Profile/>}
       </div>
      </Segment>
    )
  }
}



export default RightSidebar