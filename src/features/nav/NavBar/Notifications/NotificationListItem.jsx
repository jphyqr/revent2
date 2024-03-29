import React, { Component } from "react";
import { Feed, Icon } from "semantic-ui-react";
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import {Link} from 'react-router-dom';


class NotificationListItem extends Component {

renderSummary = (notification) => {
    switch (notification.type) {
      case 'quoteSubmitted':

      return (
        <div>
        Quote Submitted 
        <Feed.Extra text >{notification.quotedBy}</Feed.Extra> {' '}
    </div>
    );
        case 'hiredForJob' :

        return (
          <div>
          Hired For Job 
          <Feed.Extra text >{notification.owner}</Feed.Extra> {' '}
      </div>
      );
        case 'stripeSuccess':
            return (
                <div>
                    <Feed.Extra text >{notification.description}</Feed.Extra> {' '}
                </div>
            );
        case 'stripeFail':
            return (
                <div>
                Stripe Fail {' '}
                <Feed.Extra text >{notification.description}</Feed.Extra> {' '}
            </div>
            );
        case 'newJob':
        return (
            <div>
            New Job {' '}
            <Feed.Extra text >{notification.title}</Feed.Extra> {' '}
        </div>
        );
        default:
            return;
    }
};







  render() {
    const {notification} = this.props;
    return (
      <Feed.Event>
        <Feed.Label>
          <img src={notification.photoURL ||'/assets/user.png' }  alt=''/>
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary>
          {this.renderSummary(notification)}
          </Feed.Summary>
          <Feed.Meta >
          <Feed.Date>{distanceInWordsToNow(notification.timestamp.toDate())} ago</Feed.Date>
                   

          </Feed.Meta>
        </Feed.Content>
      </Feed.Event>
    );
  }
}

export default NotificationListItem;
