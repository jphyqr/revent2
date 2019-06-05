import React, { Component } from "react";
import {
  Message,
  Divider,
  Grid,
  Button,
  Icon,
  Header,
  Image
} from "semantic-ui-react";
import Dropzone from "react-dropzone";
import ContractorAgreement from "./ContractorAgreement";
import PhotoUpload from "../../../../app/common/form/PhotoUpload/PhotoUpload";
import VideoUpload from "../../../../app/common/form/VideoUpload/VideoUpload";

import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import {
  uploadContractorPhoto,
  deleteContractorPhoto,
  uploadContractorVideo,
  updateContractorVideoTitle,
  changeContractorVideoThumbnail,
  deleteContractorVideo
} from "../../../user/userActions";

const query = ({ auth }) => {
  return [
    {
      collection: "contractor_profiles",
      doc: auth.uid,
      subcollections: [{ collection: "contractor_photos" }],
      orderBy: ["date", "desc"],
      storeAs: "contractor_photos"
    },
    {
      collection: "contractor_profiles",
      doc: auth.uid,
      subcollections: [{ collection: "contractor_videos" }],
      orderBy: ["date", "desc"],
      storeAs: "contractor_videos"
    }
  ];
};

const actions = {
  deleteContractorVideo,
  uploadContractorPhoto,
  deleteContractorPhoto,
  uploadContractorVideo,updateContractorVideoTitle,changeContractorVideoThumbnail
};

const mapState = state => ({
  contractorProfile:
    (state.firestore.ordered.contractor_profile &&
      state.firestore.ordered.contractor_profile[0]) ||
    {},
  contractorPhotos: state.firestore.ordered.contractor_photos || [],
  contractorVideos: state.firestore.ordered.contractor_videos || [],
  
  auth: state.firebase.auth
});
class ContractorPane extends Component {
  state = { files: [], fileName: "", image: {} };

  onDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name
    });
    await this.props.uploadContractorPhoto(
      this.props.contractorProfile,
      files[0]
    );

    this.setState({
      files: {},
      fileName: {}
    });
  };


  handleDeleteVideo = async video=>{
    const message = "Are you sure you want to delete this video?";
    toastr.confirm(message, {
      onOk: async () => {
        await this.props.deleteContractorVideo(video.id)
      }
    });
   
  }
  handlePhotoUploaded = async file => {
    await this.props.uploadContractorPhoto(file);
  };

  handleChangeThumbnail = async (video, file) => {
    await this.props.changeContractorVideoThumbnail(video, file);
  }

  handleUpdateVideoTitle = async (video, title) =>{
    await this.props.updateContractorVideoTitle(video, title);
  }

  handleVideoUpload = async url => {
    this.setState({videoLoading:true})
    console.log("photo uploaded url", url);
    let videoUrl = await this.props.uploadContractorVideo(
 
      url
    );
    this.setState({ videoUrl: videoUrl });
    this.setState({videoLoading:false})
  };

  handleDeletePhoto = async photo => {
    const message = "Are you sure you want to delete this photo?";
    toastr.confirm(message, {
      onOk: async () => {
        await this.props.deleteContractorPhoto(photo.id);
      }
    });
  };

  render() {
    const {
      contractorProfile,
      compactDisplayMode,
      isContractor,
      contractorPhotos,
      contractorVideos
    } = this.props;
    const { jobsStarted, jobsCompleted, rating, volumeTotal } =
      contractorProfile || {};
    const { clean, craftsmanship, professionalism, punctuality } = rating || {};
    const videoOnly = true;
    const averageRating =
      (rating && (clean + craftsmanship + professionalism + punctuality) / 4) ||
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
        <div>
          {!this.props.isContractor ? (
            <ContractorAgreement
              submitContract={this.props.handleCreateContractorProfile}
            />
          ) : (
            <div>
              <Grid>
                <Grid.Row>
                  <Message
                    style={{ width: "100%" }}
                    info
                    size="mini"
                    attached="top"
                    content="You must add a connected account."
                  />
                </Grid.Row>
                <Grid.Row>
                  <Button
                    onClick={() =>
                      this.props.openModal("ConnectBankAccountModal")
                    }
                    content="+ bank account"
                    disabled
                    icon="stripe card"
                    labelPosition="left"
                  />
                </Grid.Row>
              </Grid>
              <Divider />
              {isContractor ? (
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
                  <Message.Header>Become a Contractor</Message.Header>
                  <Message.List>
                    <Message.Item>Add a Bank Account</Message.Item>
                    <Message.Item>Subscribe and Quote Jobs</Message.Item>
                  </Message.List>
                </Message>
              )}
              <Divider />
              <Grid.Row>
                <div style={{ width: "100%", height: "auto" }}>
                  <PhotoUpload
                    handlePhotoUploaded={this.handlePhotoUploaded}
                    photos={this.props.contractorPhotos}
                    photosLoading={false}
                    handleDeletePhoto={this.handleDeletePhoto}
                  />

                  <VideoUpload 
                  handleVideoUpload={this.handleVideoUpload}
                  handleUpdateVideoTitle= {this.handleUpdateVideoTitle}
                   videos={contractorVideos}
                   handleChangeThumbnail={this.handleChangeThumbnail}
                   handleDeleteVideo={this.handleDeleteVideo}
                   videoLoading={this.state.videoLoading}
                  />

               
                </div>
              </Grid.Row>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(ContractorPane));
