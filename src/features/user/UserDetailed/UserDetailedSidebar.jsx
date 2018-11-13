import React, { Component } from "react";
import { Button, Grid, Segment, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { openModal } from "../../modals/modalActions";

const actions = {
  openModal
};

class UserDetailedSidebar extends Component {
  render() {
    const {
      isFollowing,
      isCurrentUser,
      followUser,
      unfollowUser,
      profile,
      currentUser,
      openModal
    } = this.props;
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
            <div>
              <Button
                onClick={() => unfollowUser(currentUser)}
                color="teal"
                fluid
                basic
                content="Unfollow User"
              />

              <Button
                onClick={() => openModal("MessageModal", { data: profile })}
                color="teal"
                content="Message User"
              />
            </div>
          ) : (
            <div>
              <Button
                onClick={() => followUser(profile)}
                color="teal"
                fluid
                basic
                content="Follow User"
              />

              <Button
                onClick={() => openModal("MessageModal", { data: profile })}
                color="teal"
                content="Message Modal"
              />
            </div>
          )}
        </Segment>
      </Grid.Column>
    );
  }
}

export default connect(null, actions)(UserDetailedSidebar);
