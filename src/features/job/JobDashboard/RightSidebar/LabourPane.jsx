import React, { Component } from "react";
import {
  Message,
  Button,
  Divider,
  Image,
  Grid,
  Icon,
  Header,
  Checkbox
} from "semantic-ui-react";
import TextInput from "../../../../app/common/form/TextInput";
import { toastr } from "react-redux-toastr";
import Dropzone from "react-dropzone";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";
import PhotoUpload from '../../../../app/common/form/PhotoUpload/PhotoUpload'
const query = ({ auth }) => {


    return [
      {
        collection: "labour_profiles",
        doc: auth.uid,
        storeAs: "labour_profile"
      },

      {
        collection: "labour_profiles",
        doc: auth.uid,
        subcollections: [{ collection: "labour_photos" }],
        orderBy: ["date", "desc"],
        limit:5,
        storeAs: "labour_photos"
      }
    ];
 
};

const mapState = state => ({
  auth: state.firebase.auth,
  labourProfile: (state.firestore.ordered.labour_profile&&state.firestore.ordered.labour_profile[0]) || {},
  labourPhotos: state.firestore.ordered.labour_photos || [],
  photosLoading: !isLoaded(state.firestore.ordered.labour_photos)
});
class LabourPane extends Component {
  state = { profile: {}, photos:[], files: [], fileName: "", cropResult: null, image: {} };

  componentDidMount() {
    const { labourProfile, labourPhotos } = this.props;

    this.setState({ profile: labourProfile, photos: labourPhotos, photosLoading:this.props.photosLoading });
  }


componentDidUpdate(prevProps){
  if(prevProps.photosLoading!==this.props.photosLoading)
  {
    console.log('CDU photosLoaded Changed')
    this.setState({photosLoading:this.props.photosLoading})
  }
}

  componentWillReceiveProps = nextProps => {
    if (nextProps.labourProfile !== this.state.profile||nextProps.labourPhotos !== this.state.photos) {
      this.setState({
        profile: nextProps.labourProfile,
        photos: nextProps.labourPhotos
      });
    }
  };

  handleDeletePhoto= async photo =>{
    const message = "Are you sure you want to delete this photo?";
    toastr.confirm(message, {
      onOk: async () => {
       await this.props.deleteLabourPhoto(photo.id)
      }
    });
  }
  

handlePhotoUploaded = async (file) =>{
  await this.props.uploadLabourPhoto(file)
}

  onDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name
    });
    await this.props.uploadLabourPhoto(
      this.props.profile.labourProfile,
      files[0]
    );

    this.setState({
      files: {},
      fileName: {}
    });
  };

  toggle = async () => {
    let message = "";
    if (this.state.profile.profileListed) {
      message = "This will unlist your profile from the labour listings";
    } else {
      message = "This will list your profile in the labour market";
    }

    toastr.confirm(message, {
      onOk: async () => {
        //  if(this.props.labour_profile===null){
        const toggledProfileListed = !this.state.profile.profileListed;

        await this.props.createLabourProfile(
          this.props.profile,
          toggledProfileListed
        );

        //  }
        // this.props.goBackToStep(this.state.quote, step)
      }
    });
  };

  render() {
    // const { profile,createLabourProfile ,skillsHaveBeenUpdated} = this.props;
    const { profile , photos, photosLoading} = this.state;
    const { compactDisplayMode } = this.props;
    const { labourProfile, profileListed, isALabourer } = profile;
    const {
      rating,
      jobsStarted,
      jobsCompleted,
      hasTransportation,
      hasToolsrating,
      volumeTotal,
      labourPhotos
    } = labourProfile || {};
    const {
      clean,
      craftsmanship,
      conmmunication,
      professionalism,
      punctuality
    } = rating || {};

    const averageRating =
      (rating &&
        (clean +
          conmmunication +
          craftsmanship +
          professionalism +
          punctuality) /
          5) ||
      0;

    let volumeTotalString = "";


    if (volumeTotal < 1000) {
      volumeTotalString = `$${volumeTotal}`;
    } else if (volumeTotal < 10000) {
      volumeTotalString = `$${parseFloat(volumeTotal / 1000).toFixed(1)}K`;
    } else if (volumeTotal < 1000000) {
      volumeTotalString = `$${parseFloat(volumeTotal / 1000).toFixed(0)}K`;
    }

    return (
      <div style={{ padding: "20px" }}>
        {compactDisplayMode ? (
          <Grid>
            <Grid.Row>
              {this.state.profile.skillsHaveBeenUpdated ? (
                <Message
                  style={{ width: "100%" }}
                  warning
                  size="mini"
                  attached="top"
                  content="Skills have been updated, re-list profile"
                />
              ) : this.state.profile.profileListed ? (
                <Message
                  style={{ width: "100%" }}
                  success
                  size="mini"
                  attached="top"
                  content="Profile is listed."
                />
              ) : (
                <Message
                  style={{ width: "100%" }}
                  info
                  size="mini"
                  attached="top"
                  content="Add skills to list service."
                />
              )}
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={8}>
                <Button
                  disabled={this.state.profile.profileListed}
                  onClick={() => this.props.openModal("LabourProfileModal")}
                  content="+ skills"
                  icon="home"
                  labelPosition="left"
                />
              </Grid.Column>
              <Grid.Column width={8}>
                <Checkbox
                  disabled={
                    !this.state.profile.skillsHaveBeenUpdated &&
                    !this.state.profile.profileListed
                  }
                  label="List Profile"
                  toggle
                  onChange={this.toggle}
                  checked={this.state.profile.profileListed}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              {isALabourer ? (
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>Rating</Grid.Column>
                    <Grid.Column width={3}>Volume</Grid.Column>
                    <Grid.Column width={3}>Jobs Started</Grid.Column>
                    <Grid.Column width={6}>Jobs Completed</Grid.Column>
                  </Grid.Row>

                  <Grid.Row
                    style={{ textAlign: "center", paddingTop: 0, marginTop: 0 }}
                  >
                    <Grid.Column width={3}>{averageRating}</Grid.Column>
                    <Grid.Column width={3}>{volumeTotalString}</Grid.Column>
                    <Grid.Column width={3}>{jobsStarted}</Grid.Column>
                    <Grid.Column width={6}>{jobsCompleted}</Grid.Column>
                  </Grid.Row>
                </Grid>
              ) : (
                <Message style={{ width: "100%" }}>
                  <Message.Header>Become a Labourer</Message.Header>
                  <Message.List>
                    <Message.Item>Add Skills</Message.Item>
                    <Message.Item>List Profile</Message.Item>
                  </Message.List>
                </Message>
              )}
            </Grid.Row>

            <Grid.Row>
              <PhotoUpload handlePhotoUploaded={this.handlePhotoUploaded} photos={photos} photosLoading={photosLoading} handleDeletePhoto={this.handleDeletePhoto}/>
              {/* <div style={{ width: "100%", height: "auto" }}>
                <Dropzone
                  style={{
                    width: "50%",
                    marginTop: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: "20px",
                    display: "block",
                    height: 30,
                    backgroundColor: "orange"
                  }}
                  onDrop={this.onDrop}
                  multiple={false}
                  acceptedFiles={"image/jpeg,image/png,image/gif"}
                >
                  <div style={{ textAlign: "center" }}>
                    <Header style={{ paddingTop: 4 }} content="+Add Photo" />
                  </div>
                </Dropzone>
                <Divider />
                <div
                  style={{
                    height: 130,
                    width: "auto",
                    whiteSpace: "nowrap",
                    padding: 5,
                    backgroundColor: "grey",
                    overflowY: "hidden",
                    overflowX: "auto"
                  }}
                >
                  {this.state.files[0] && (
                    <Image
                      style={{
                        display: "inline-block",
                        opacity: 0.3,
                        maxHeight: 115,
                        maxWidth: 115
                      }}
                      src={this.state.files[0].preview}
                    />
                  )}
                  {labourPhotos &&
                    labourPhotos.map(photo => (
                      <Image
                        style={{
                          marginLeft: 10,
                          height: 115,
                          display: "inline-block"
                        }}
                        src={photo}
                      />
                    ))}
                </div>
              </div> */}
            </Grid.Row>
          </Grid>
        ) : (
          <Grid>
            <Grid.Column width={8}>
              {this.state.profile.skillsHaveBeenUpdated ? (
                <Message
                  style={{ width: "100%" }}
                  warning
                  size="mini"
                  attached="top"
                  content="Skills have been updated, re-list profile"
                />
              ) : this.state.profile.profileListed ? (
                <Message
                  style={{ width: "100%" }}
                  success
                  size="mini"
                  attached="top"
                  content="Profile is listed."
                />
              ) : (
                <Message
                  style={{ width: "100%" }}
                  info
                  size="mini"
                  attached="top"
                  content="Add skills to list service."
                />
              )}
              <Button
                disabled={this.state.profile.profileListed}
                onClick={() => this.props.openModal("LabourProfileModal")}
                content="+ skills"
                icon="home"
                labelPosition="left"
              />
              <Checkbox
                disabled={
                  !this.state.profile.skillsHaveBeenUpdated &&
                  !this.state.profile.profileListed
                }
                label="List Profile"
                toggle
                onChange={this.toggle}
                checked={this.state.profile.profileListed}
              />

              <Divider />
              {isALabourer ? (
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>Rating</Grid.Column>
                    <Grid.Column width={3}>Volume</Grid.Column>
                    <Grid.Column width={3}>Jobs Started</Grid.Column>
                    <Grid.Column width={6}>Jobs Completed</Grid.Column>
                  </Grid.Row>

                  <Grid.Row
                    style={{ textAlign: "center", paddingTop: 0, marginTop: 0 }}
                  >
                    <Grid.Column width={3}>{averageRating}</Grid.Column>
                    <Grid.Column width={3}>{volumeTotalString}</Grid.Column>
                    <Grid.Column width={3}>{jobsStarted}</Grid.Column>
                    <Grid.Column width={6}>{jobsCompleted}</Grid.Column>
                  </Grid.Row>
                </Grid>
              ) : (
                <Message style={{ width: "100%" }}>
                  <Message.Header>Become a Labourer</Message.Header>
                  <Message.List>
                    <Message.Item>Add Skills</Message.Item>
                    <Message.Item>List Profile</Message.Item>
                  </Message.List>
                </Message>
              )}

              <Divider />
            </Grid.Column>
            <Grid.Column width={8}>
            <PhotoUpload handlePhotoUploaded={this.handlePhotoUploaded} photos={photos} photosLoading={photosLoading} handleDeletePhoto={this.handleDeletePhoto}/>
              {/* <div
                style={{
                  width: "100%",
                  padding: 10,
                  height: 340,
                  backgroundColor: "grey"
                }}
              >
                <Dropzone
                  style={{
                    width: "100%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block",
                    height: 150,
                    borderStyle: "dotted"
                  }}
                  onDrop={this.onDrop}
                  multiple={false}
                  acceptedFiles={"image/jpeg,image/png,image/gif"}
                >
                  <div style={{ paddingTop: "10px", textAlign: "center" }}>
                    <Icon name="upload" size="huge" />
                    <Header
                      content={
                        compactDisplayMode
                          ? "Upload Image"
                          : "Drop image here or click to add"
                      }
                    />
                  </div>
                </Dropzone>
                <Divider />
                <div
                  style={{
                    height: 135,
                    width: "auto",
                    whiteSpace: "nowrap",
                    padding: 5,
                    backgroundColor: "lightgrey",
                    overflowY: "hidden",
                    overflowX: "auto"
                  }}
                >
                  {this.state.files[0] && (
                    <Image
                      style={{
                        display: "inline-block",
                        opacity: 0.3,
                        maxHeight: 115,
                        maxWidth: 115
                      }}
                      src={this.state.files[0].preview}
                    />
                  )}
                  {photos &&
                    photos.map(photo => (
                      <Image
                        style={{
                          marginLeft: 10,
                          maxHeight: 115,
                          display: "inline-block",
                          maxWidth: 115
                        }}
                        src={photo.thumb}
                      />
                    ))}
                </div>
              </div> */}
            </Grid.Column>
          </Grid>
        )}
      </div>
    );
  }
}


export default connect(
  mapState,
  null
)(firestoreConnect(props => query(props))(LabourPane));
