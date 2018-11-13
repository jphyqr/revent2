import React, { Component } from "react";
import MessageListItem from "./MessageListItem";
import InfiniteScroll from "react-infinite-scroller";
import {List} from 'semantic-ui-react'

class MessageList extends Component {
  render() {
    const { messaging ,loading, selectMessage} = this.props;
    return (
      <div>
        {messaging && messaging.length !== 0 && (
          <List loading={loading} selection verticalAlign='middle'>
          
            {messaging &&
              messaging.map(message => (
                <MessageListItem selectMessage={selectMessage}  key={message.id} message={message} />
              ))}
         </List>
        )}
      </div>
    );
  }
}

export default MessageList;