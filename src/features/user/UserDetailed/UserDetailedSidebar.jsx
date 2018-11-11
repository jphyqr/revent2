import React from "react";
import { Button, Grid, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const UserDetailedSidebar = ({
  isFollowing,
  isCurrentUser,
  followUser,
  unfollowUser,
  profile,
  currentUser
}) => {
  return (
    <Grid.Column width={4}>
      <Segment>
        {isCurrentUser ? (
          <Button
            as={Link}
            to="/settings"
            color="teal"
            fluid
            basic
            content="Edit Profile"
          />
        ) : isFollowing ? (
          <Button
            onClick={() => unfollowUser(currentUser)}
            color="teal"
            fluid
            basic
            content="Unfollow User"
          />
        ) : (
          <Button
            onClick={() => followUser(profile)}
            color="teal"
            fluid
            basic
            content="Follow User"
          />
        )}
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedSidebar;
