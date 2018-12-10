import React from "react";
import { Menu, Dropdown, Header, Feed, Icon } from "semantic-ui-react";
import NotificationListItem from "./NotificationListItem";
const NotificationList = ({ notifications, loading }) => {
  return (
    <div>
      <Header attached="top" content="Notifications" />
      <Feed size="small">
        {notifications &&
          notifications.map(notification => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
            />
          ))}
      </Feed>
    </div>
  );
};

export default NotificationList;
