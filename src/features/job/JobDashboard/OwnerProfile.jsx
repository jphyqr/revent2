import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase"; //even though we using firestore this gives our binding
import {
  Card,
  Image,
  Icon,
  Button,
  Dimmer,Loader,
  Grid
} from "semantic-ui-react";

const query = ({ ownerUid }) => {
  return [
    {
      collection: "users",
      doc: ownerUid,
      storeAs: "owner_profile"
    }
  ];
};
const mapState = state => ({
  ownerProfile:
    state.firestore.ordered.owner_profile &&
    state.firestore.ordered.owner_profile[0]
});

class OwnerProfile extends Component {


 state={
   ownerProfile: {},
   profileLoading:false
 }

  componentWillReceiveProps = (nextProps) =>{
    this.setState({profileLoading:true})
   if(nextProps.ownerProfile != this.state.ownerProfile){
     this.setState({ownerProfile:nextProps.ownerProfile})
   }
   this.setState({profileLoading:false})
  }
  

  render() {
    console.log(this.props.ownerUid);
    console.log(this.props.ownerProfile);
    const { ownerProfile } = this.props;
    const rating = (ownerProfile && ownerProfile.rating) || 0;
    const averageRating =
      (rating &&
        (rating.clean +
          rating.craftsmanship +
          rating.professionalism +
          rating.punctuality) /
          4) ||
      0;

    const totalVolume =
      (ownerProfile &&
        ownerProfile.volume &&
        ownerProfile.volume.totalVolume) ||
      0;
    const numberOfJobs =
      (ownerProfile &&
        ownerProfile.volume &&
        ownerProfile.volume.numberOfJobs) ||
      0;
    let totalVolumeString = "";

    if (totalVolume < 1000) {
      totalVolumeString = `$${totalVolume}`;
    } else if (totalVolume < 10000) {
      totalVolumeString = `$${parseFloat(totalVolume / 1000).toFixed(1)}K`;
    } else if (totalVolume < 1000000) {
      totalVolumeString = `$${parseFloat(totalVolume / 1000).toFixed(0)}K`;
    }

    //    const {displayName, isContractor, photoURL, rating, verificationLevel, volume, createdAt} = ownerProfile
    return (
      <Card>
        {(!isLoaded(this.props.ownerProfile)) ? (
           <Dimmer active inverted>
           <Loader size='mini'>Loading</Loader>
         </Dimmer>
        ) : (
          <Image
          display={{ height: "100px" }}
          src={(ownerProfile && ownerProfile.photoURL) || "/assets/user.png"}
        />
        
        
        )}

        <Card.Content>
          <Card.Header>{ownerProfile && ownerProfile.displayName}</Card.Header>
          <Card.Meta>
            <span className="date">Joined in 2015</span>
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Grid>
            <Grid.Column style={{ fontSize: "18px", color: "gold" }} width={4}>
              {averageRating}
            </Grid.Column>
            <Grid.Column style={{ fontSize: "18px", color: "grey" }} width={4}>
              {`${numberOfJobs} `}
            </Grid.Column>
            <Grid.Column style={{ fontSize: "18px", color: "green" }} width={4}>
              {`${totalVolumeString}`}
            </Grid.Column>
            <Grid.Column width={4}>
              <Icon size="large" name="mail" />
            </Grid.Column>
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}

export default connect(
  mapState,
  null
)(firestoreConnect(props => query(props))(OwnerProfile));
