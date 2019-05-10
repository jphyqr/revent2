import React, { Component } from "react";
import { connect } from "react-redux";
import { newChat } from "../../user/userActions";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase"; //even though we using firestore this gives our binding
import {
  Card,
  Image,
  Icon,
  Button,
  Dimmer,
  Loader,
  Grid,
  Label,
  Header,
  Transition
} from "semantic-ui-react";

const actions = { newChat };

const query = ({ ownerUid }) => {
  return [
    {
      collection: "users",
      doc: ownerUid,
      storeAs: "profile"
    }
  ];
};
const mapState = state => ({
  profile: state.firestore.ordered.profile && state.firestore.ordered.profile[0]
});

class OwnerProfile extends Component {
  state = {
    profile: {},
    showRatingDetail: false,
    profileLoading: false
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ profileLoading: true });
    if (nextProps.profile != this.state.profile) {
      this.setState({ profile: nextProps.profile });
    }
    this.setState({ profileLoading: false });
  };

  handleNewChat = async () => {
    this.setState({ messageButtonLoading: true });
    await this.props.newChat(this.props.selectedQuote);
    this.setState({ messageButtonLoading: false });
  };
  render() {
    console.log(this.props.ownerUid);
    console.log(this.props.profile);
    const { profile, compactDisplayMode, profileType } = this.props || {};
    const { showRatingDetail } = this.state || false;
    let specificProfile = {};
    let specificPhotos;
    let specificRating;

    let specificAverageRating = 0;
    switch (profileType) {
      case "contractor":
        specificProfile = (profile && profile.contractorProfile) || {};
        specificPhotos =
          (specificProfile && specificProfile.contractorPhotos) || [];
        specificRating = (specificProfile && specificProfile.rating) || [];
        specificAverageRating =
          (specificRating &&
            (specificRating.clean +
              specificRating.communication +
              specificRating.craftsmanship +
              specificRating.professionalism +
              specificRating.punctuality) /
              5) ||
          0;
        break;

      case "owner":
        specificProfile = (profile && profile.builderProfile) || {};
        specificPhotos =
          (specificProfile && specificProfile.builderPhotos) || [];
        specificRating = (specificProfile && specificProfile.rating) || [];
        specificAverageRating =
          (specificRating &&
            (specificRating.communication +
              specificRating.feedback +
              specificRating.professionalism +
              specificRating.punctuality) /
              4) ||
          0;
        break;
      case "labour":
        specificProfile = (profile && profile.labourProfile) || {};
        specificPhotos =
          (specificProfile && specificProfile.labourPhotos) || [];
        specificRating = (specificProfile && specificProfile.rating) || [];
        specificAverageRating =
          (specificRating &&
            (specificRating.clean +
              specificRating.communication +
              specificRating.craftsmanship +
              specificRating.professionalism +
              specificRating.punctuality) /
              5) ||
          0;
      default:
        specificProfile = {};
        specificPhotos = [];
        specificRating = {};
    }

    const totalVolume = (specificProfile && specificProfile.volumeTotal) || 0;
    const jobsCompleted =
      (specificProfile && specificProfile.jobsCompleted) || 0;
    const jobsStarted = (specificProfile && specificProfile.jobsStarted) || 0;
    let totalVolumeString = "";

    if (totalVolume < 1000) {
      totalVolumeString = `$${totalVolume}`;
    } else if (totalVolume < 10000) {
      totalVolumeString = `$${parseFloat(totalVolume / 1000).toFixed(1)}K`;
    } else if (totalVolume < 1000000) {
      totalVolumeString = `$${parseFloat(totalVolume / 1000).toFixed(0)}K`;
    }

    //    const {displayName, isContractor, photoURL, rating, verificationLevel, volume, createdAt} = profile
    return (
      <div style={{width:"100%", }}>
      <Card style={{display:"block",  marginRight:"auto", marginLeft:"auto",}}>
        <Card.Content>
          <Card.Header>
            <Grid>
              <Grid.Column width={4}>
                {!isLoaded(this.props.profile) ? (
                  <Dimmer active inverted>
                    <Loader size="mini">Loading</Loader>
                  </Dimmer>
                ) : (
                  <Image
                    size="small"
                    circular
                    style={{ marginRight: 10 }}
                    src={(profile && profile.photoURL) || "/assets/user.png"}
                  />
                )}
              </Grid.Column>
              <Grid.Column width={9}>
                {profile && profile.displayName}
              </Grid.Column>
              <Grid.Column width={2}>
                <Button
                  loading={this.state.messageButtonLoading}
                  onClick={this.handleNewChat}
                  icon="mail"
                  secondary
                />
              </Grid.Column>
            </Grid>
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          {specificPhotos && specificPhotos.length > 0 ? (
            <div
              style={{
                height: 120,
                width: "auto",
                whiteSpace: "nowrap",
                padding: 5,
                backgroundColor: "lightgrey",
                overflowY: "hidden",
                overflowX: "auto"
              }}
            >
              {specificPhotos &&
                specificPhotos.map(photo => (
                  <Image
                    style={{
                      marginLeft: 10,
                      maxHeight: 115,
                      display: "inline-block",
                      maxWidth: 115
                    }}
                    src={photo}
                  />
                ))}
            </div>
          ) : (
            <Label>No Photos</Label>
          )}
        </Card.Content>
        <Card.Content extra>
          <Grid>
            <Grid.Row style={{margin:0, padding:0}}>
              <Grid.Column  style={{textAlign:"center"}} width={5}>Rating</Grid.Column>
              <Grid.Column  style={{textAlign:"center"}} width={6}>Jobs(Done)</Grid.Column>
              <Grid.Column  style={{textAlign:"center"}} width={3}>Volume</Grid.Column>
            </Grid.Row>
            <Grid.Column
              onClick={
                showRatingDetail
                  ? this.setState({ showRatingDetail: false })
                  : () => this.setState({ showRatingDetail: true })
              }
              style={{ fontSize: "18px", color: "gold",textAlign:"center" }}
              width={5}
            >
              {specificAverageRating}{" "}
              <Icon name={showRatingDetail ? "arrow up" : "arrow down"} />
            </Grid.Column>
            <Grid.Column style={{ fontSize: "18px", color: "grey",textAlign:"center" }} width={6}>
              {`${jobsStarted} (${jobsCompleted}) `}
            </Grid.Column>

            <Grid.Column style={{ fontSize: "18px", color: "green",textAlign:"center" }} width={3}>
              {`${totalVolumeString}`}
            </Grid.Column>
          </Grid>

          <Transition.Group animation="slide down" duration={300}>
            {showRatingDetail && (
              <Grid style={{  }}>
                <Grid.Row style={{paddingBottom:0}}>
                  <Grid.Column style={{textAlign:"center"}} width={3}>
                    <Header as="h6">Clean</Header>
                  </Grid.Column>
                  <Grid.Column style={{textAlign:"center"}}width={3}>
                    <Header as="h6">Comms</Header>
                  </Grid.Column>
                  <Grid.Column style={{textAlign:"center"}}width={3}>
                    <Header as="h6">Craft</Header>
                  </Grid.Column>
                  <Grid.Column style={{textAlign:"center"}}width={4}>
                    <Header as="h6">On Time</Header>
                  </Grid.Column>
                  <Grid.Column style={{textAlign:"center"}}width={3}>
                    <Header as="h6">Prof</Header>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column style={{textAlign:"center"}}style={{textAlign:"center"}} width={3}>
                    <Header as="h6">{specificRating.clean}</Header>
                  </Grid.Column>
                  <Grid.Column style={{textAlign:"center"}}width={3}>
                    <Header as="h6">{specificRating.communication}</Header>
                  </Grid.Column>
                  <Grid.Column style={{textAlign:"center"}}width={3}>
                    <Header as="h6">{specificRating.craftsmanship}</Header>
                  </Grid.Column>
                  <Grid.Column style={{textAlign:"center"}}width={4}>
                    <Header as="h6">{specificRating.punctuality}</Header>
                  </Grid.Column>
                  <Grid.Column style={{textAlign:"center"}}width={3}>
                    <Header as="h6">{specificRating.professionalism}</Header>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </Transition.Group>
        </Card.Content>
        <Card.Content extra />
      </Card>
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(OwnerProfile));
