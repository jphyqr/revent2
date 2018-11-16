import React, { Component } from "react";
import MessageListItem from "./MessageListItem";
import InfiniteScroll from "react-infinite-scroller";
import {List, Sticky} from 'semantic-ui-react'

class MessageList extends Component {
  render() {
    const { messaging ,loading, selectMessage, contextRef}= this.props;
    return (
      <Sticky  offset={100}>
        {messaging && messaging.length !== 0 && (
          <List selection verticalAlign='middle'>
          
            {messaging &&
              messaging.map(message => (
                <MessageListItem selectMessage={selectMessage}  key={message.id} message={message} />
              ))}
         </List>
        )}
    </Sticky>
    );
  }
}

export default MessageList;