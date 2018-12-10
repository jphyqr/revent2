import React, { Component } from 'react'
import { Menu, Dropdown, Header, Feed, Icon } from "semantic-ui-react";
import MessagesListItem from "./MessagesListItem";

//need to make message list smart comp, steal ref set up from
//event dashboard

const RIGHT= 0;
const BOTTOM = 0;
const BORDER = 10;
const WIDTH = 250
const HEIGHT = 300


class MessagesList extends Component {

  state={
    openChats:0,
    right:0
  }

  incrementOpenChats = () => {
    console.log('increment')
    this.setState({openChats : (this.state.openChats + 1)})
  // this.setState({ right: (this.state.openChats)*(WIDTH+BORDER)})
  
  }

  decrementOpenChats = () => {
    console.log('decrement')
    this.setState({openChats : (this.state.openChats - 1)})
  }

  render() {
    const  { messaging, loading, contextRef } =this.props
  const openChats = this.state.openChats
    return (
      <div>
      <Header attached="top" content="Messagings" />
      <Feed size="small"> 
        {messaging &&
          messaging.map(message => (
            <MessagesListItem
            contextRef={contextRef}
              key={message.id}
              message={message}
              incrementOpenChats = {this.incrementOpenChats}
              decrementOpenChats = {this.decrementOpenChats}
              openChats = {openChats}
              right = {RIGHT}
              bottom = {BOTTOM}
              border = {BORDER}
              height = {HEIGHT}
              width = {WIDTH}

            />
          ))}
      </Feed>
      </div>
  
    )
  }

}



export default MessagesList;
