import React, { Component } from "react";
import {
  Grid,
  Label,
  Header,
  Button,
  Dimmer,
  Loader,
  Icon,
  Responsive
} from "semantic-ui-react";
import { connect } from "react-redux";
import GoogleMapReact from "google-map-react";
import { claimRequest } from "../../modals/OnboardingModal/onboardingActions";
import {
  firestoreConnect,
  firebaseConnect,
  isEmpty,
  isLoaded
} from "react-redux-firebase";
import { openModal } from "../../modals/modalActions";

import LoadingComponent from '../../../app/layout/LoadingComponent'

const Marker = () => <Icon name="marker" size="big" color="red" />;

const query = ({ auth, match }) => {
  return [
    {
      collection: "request_for_onboarding",
      doc: match.params.id,
      storeAs: "request"
    }
  ];
};

const mapState = state => ({
  loading: state.async.loading,
  auth: state.firebase.auth,
  role: state.role,
  request:
    (state.firestore.ordered.request && state.firestore.ordered.request[0]) ||
    {},
  authenticated: state.firebase.auth.isLoaded && !state.firebase.auth.isEmpty
});

const actions = {
  openModal,
  claimRequest
};
class ClaimOnboarding extends Component {
  state = { request: {} };

  componentDidMount() {
    this.setState({ request: this.props.request });
  }

  handleOnUpdate = (e, { width }) => this.setState({ width });

  componentWillReceiveProps = nextProps => {
    if (nextProps.request !== this.state.request) {
      this.setState({ request: nextProps.request });
    }
  };

  render() {
    //8
    const {  auth, requesting, loading , role} = this.props || {};
    const {isOnboarder} = role || {}
    const {request,width} = this.state

    const CUSTOM_TABLET_CUTOFF = 800;
    const compactDisplayMode = width >= CUSTOM_TABLET_CUTOFF ? false : true;
    const {
      city,
      day,
      description,
      hour,
      id,
      phone,
      venue,
      venueLatLng,
      claimed,
      claimedByUID,
      onboarderProfile
    } = request || {};
    const { first_name, last_name } = onboarderProfile || {};
    let am_pm = "";
    if (hour >= 12) {
      am_pm = "PM";
    } else {
      am_pm = "AM";
    }

    let startHour = hour;
    let endHour = hour + 1;
    if (startHour > 12) startHour = startHour - 12;

    if (endHour > 12) endHour = endHour - 12;

    const center = [
      venueLatLng && venueLatLng.lat,
      venueLatLng && venueLatLng.lng
    ];
    const zoom = 11;



    if (!isLoaded(this.props.request)||isEmpty(this.props.request) || requesting || loading)
    return (
   
        <LoadingComponent inverted={true} />
     
    );
    return (
        <Responsive fireOnMount onUpdate={this.handleOnUpdate}>
      <div  style={{height:"800px", width:"100%", backgroundColor:"lightgrey", margin:0, paddingTop: compactDisplayMode? 0 : 20}}>
        <Grid style={{margin:0, padding:0,backgroundColor:"lightgrey"}}>

   
        <Grid.Column width={compactDisplayMode?0:4}>

</Grid.Column>
  

            <Grid.Column  style={{padding:0, margin:10}}width={compactDisplayMode?16:8}>
            <Header as="h2">New Request</Header>
        <p style={{fontSize:14}}>{description}</p>
        
       <div style={{ width:"100%", marginBottom:20}}><Label  size="big" color="red" >  <Icon name='calendar' />{day}</Label>
          <Label  size="big"   >
          <Icon name='clock' />
          {`${startHour} to ${endHour} ${am_pm}`}
           </Label>
           </div> 
        <div style={{ height: "300px", width: "100%",}}>
       
          <GoogleMapReact
          
            bootstrapURLKeys={{
              key: "AIzaSyBeJlBUVhFnJrXS5flaYydbj5AmbuGCNBQ"
            }}
            defaultCenter={center}
            defaultZoom={zoom}
          >

            <Marker
              lat={venueLatLng && venueLatLng.lat}
              lng={venueLatLng && venueLatLng.lng}
            />
          </GoogleMapReact>

          <div style={{marginTop:20}}>
          {claimed ? (
            claimedByUID === auth.uid ? (
              <Label size="large" color="green" content={`YOU HAVE CLAIMED JOB`} />
            ) : (
              <Label size="large" color="red" content={`CLAIMED BY ${first_name} ${last_name}`} />
            )
          ) : (
           isOnboarder&&<Button
              onClick={() => {
                this.props.claimRequest(id);
              }}
              primary
              size="large"
            >
              Claim Job Now
            </Button>
          )}

          {claimedByUID && claimedByUID === auth.uid && (
             <Header as="h1" style={{borderRadius:"10px", padding:10,width:"100%", textAlign:"center", backgroundColor:"red", color:"white"}}><a style={{color:"white"}} href={`tel:[${phone}]`}><Icon name="phone"/>Call now</a></Header>
          
          )}

</div>
        </div> 
                </Grid.Column>
            
        <Grid.Column  width={compactDisplayMode?0:4}> </Grid.Column>

</Grid>
      </div>
      </Responsive>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(ClaimOnboarding));
