import React, { Component } from "react";
import { Feed, Icon, Button, Popup, Segment, Header, Portal } from "semantic-ui-react";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { selectLastMessage } from "../../../user/userActions";
import {openMessage} from '../../../popup/popupActions'

const actions = {
  selectLastMessage,
  openMessage
};



class MessagesListItem extends Component {
  state = { 
      open: false
    };

  toggle = () => this.setState({ open: !this.state.open });

  handleRef = node => this.setState({ node });

  handleOpen = () => {
    this.setState({ open: true 
    
    
    })
    this.props.incrementOpenChats()
    
  }

  handleClose = () => {
    this.setState({ open: false })
    this.props.decrementOpenChats()
  }

  renderMessage = message => {
      const {right, bottom, height, width,openChats, border} = this.props
      const constOpenChats = openChats
    //  const newRight = constOpenChats*(width+border)
    
    return (

        <Portal
        closeOnTriggerClick = {false}
        closeOnDocumentClick = {false}
        openOnTriggerClick
        open={this.state.open}
        trigger={
            <Feed.Extra text>{message.displayName}</Feed.Extra>
      
            }
        onOpen={this.handleOpen}
      >
        <Segment style={{width: width, height:height, right: right, position: 'fixed', bottom: bottom, zIndex: 1000 }}>
          <Header>{message.displayName}</Header>
          <Button onClick={this.handleClose}>Close</Button>
          <p>Portals have tons of great callback functions to hook into.</p>
          <p>To close, simply click the close button or click away</p>
        </Segment>
      </Portal>





    );
  };

  render() {
    const { right,bottom,height,message, openMessage, incrementOpenChats, decrementOpenChats, openChats } = this.props;
    const { node, open } = this.state;
    return (
    <Feed.Event>
        <Feed.Content
          onClick={()=>openMessage(message)}
          
        >

        <Feed.Summary>{message.displayName}</Feed.Summary>
          {/* <Feed.Summary>{this.renderMessage(message)}</Feed.Summary> */}
          <Feed.Meta >

        {/* <Popup context={node} content='Hello' position='top center' open={open} /> */}
          </Feed.Meta>
   
          
        </Feed.Content>
      </Feed.Event>
       
   
    );
  }
}

export default connect(
  null,
  actions
)(MessagesListItem);
