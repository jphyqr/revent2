import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { openModal } from "../../../../features/modals/modalActions";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import VideoThumbnail from "./VideoThumbnail";
import {
  Button,
  Loader,
  Dimmer,
  Header,
  Divider,
  Popup,
  Icon,
  Image,
  Message,
  Grid,
  Segment
} from "semantic-ui-react";

const actions = {};
const mapState = state => ({
  loading: state.async.loading,
  auth: state.firebase.auth
});

class VideoUpload extends Component {
  state = {
    files: [],
    fileName: "",

    image: {}
  };

  checkIfLoaded = index => {
    if (index === 0) this.setState({ showPlaceholder: false });
  };

  onDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name,
      showPlaceholder: true,
      placeholderURL: files[0].preview
    });
    await this.props.handleVideoUpload(files[0]);

    this.setState({
      files: {},
      fileName: {}
    });
  };

  handleChangeThumbnail = async (video, file) => {
    await this.props.handleChangeThumbnail(video, file);
  };

  handleUpdateVideoTitle = async (video, title) => {
    await this.props.handleUpdateVideoTitle(video, title);
  };

  render() {
    const { videos, loading, photos, videoLoading ,} = this.props || {};

    return (
      <div style={{ width: "100%" }}>
        <Dropzone
          style={{
            width: "100%",
            marginTop: 10,
            marginLeft: "auto",
            marginRight: "auto",
           
            display: "block",
            height: 30,
            backgroundColor: "orange"
          }}
          onDropRejected={console.log("rejected")}
          onDrop={this.onDrop}
          createImageThumbnails
          multiple={false}
          accept="video/*"
        >
          <div style={{ textAlign: "center" }}>
            <Header style={{ paddingTop: 4 }} content={"+Add Video"} />
          </div>
        </Dropzone>

      
        <div
          style={{
            height: 130,
            width: "auto",
            whiteSpace: "nowrap",
            padding: 5,
            backgroundColor: "lightgrey",
            overflowY: "hidden",
            overflowX: "auto",
            verticalAlign: "middle"
          }}
        >
          {this.state.showPlaceholder && (
            <Segment
              inverted
              style={{
                padding: 0,
                marginLeft: 10,
                //  marginTop:0,
                //    marginBottom:0,
                //   marginRight:0,
                display: "inline-block",
                opacity: 1,
                maxHeight: 115,
                maxWidth: 115,
                verticalAlign: "middle"
              }}
            >
              <Loader active />

            <VideoThumbnail
                showPlaceholder={this.state.showPlaceholder}
                checkIfLoaded={this.checkIfLoaded}
                handleUpdateVideoTitle={this.handleUpdateVideoTitle}
                handleChangeThumbnail={this.handleChangeThumbnail}
                handleDeleteVideo={this.props.handleDeleteVideo}
              />
            </Segment>
          )}

          {videos &&
            videos.map((video, index) => (
              
              <VideoThumbnail
                video={video}
                index={index}
                checkIfLoaded={this.checkIfLoaded}
                handleUpdateVideoTitle={this.handleUpdateVideoTitle}
                handleChangeThumbnail={this.handleChangeThumbnail}
                handleDeleteVideo={this.props.handleDeleteVideo}
              />
    
            ))}
        </div>
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(
  firebaseConnect(props => [`stripe_verfication_tokens/${props.auth.uid}`])(
    VideoUpload
  )
);
