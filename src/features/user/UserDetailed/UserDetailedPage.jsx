import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import { firestoreConnect, isEmpty } from "react-redux-firebase";
import { compose } from "redux";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedDescription from "./UserDetailedDescription";
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedSidebar from "./UserDetailedSidebar";
import UserDetailedEvents from "./UserDetailedEvents";
import { userDetailedQuery } from "../userQueries";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {getUserEvents, followUser, unfollowUser} from '../userActions';

const mapState = (state, ownProps) => {
  let userUid = null;
  let profile = {};
  if (ownProps.match.params.id === state.auth.uid) {
    profile = state.firebase.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }
  return {
    profile,
    userUid,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    following: state.firestore.ordered.following,
    requesting: state.firestore.status.requesting,
    events: state.events,
    eventsLoading: state.async.loading
  };
};

const actions = {
  getUserEvents, followUser, unfollowUser
};

class UserDetailedPage extends Component {
  async componentDidMount() {
    let events = await this.props.getUserEvents(this.props.userUid);
    console.log(events);
  }

changeTab = (e, data) => {
  this.props.getUserEvents(this.props.userUid, data.activeIndex)
}


  render() {
    const { following, profile, photos, auth, match, requesting, events, eventsLoading, followUser, unfollowUser } = this.props;
    const isFollowing = !isEmpty(following);
    const currentUser = match.params.id
    const isCurrentUser = auth.uid === currentUser;
    const loading = Object.values(requesting).some(a => a === true);

    if (loading) return <LoadingComponent inverted={true} />;
    return (
      <Grid>
        <UserDetailedHeader profile={profile} />
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar currentUser={currentUser} isFollowing ={isFollowing} followUser={followUser} unfollowUser ={unfollowUser} profile={profile} isCurrentUser={isCurrentUser} />
        {photos && photos.length > 0 && <UserDetailedPhotos photos={photos} />}
        <UserDetailedEvents changeTab={this.changeTab} events={events} eventsLoading={eventsLoading} />
      </Grid>
    );
  }
}

export default compose(
  connect(
    mapState,
    actions
  ),
  firestoreConnect((auth, userUid, match) => userDetailedQuery(auth, userUid, match))
)(UserDetailedPage);
