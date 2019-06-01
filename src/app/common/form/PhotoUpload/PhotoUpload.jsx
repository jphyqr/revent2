import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { uploadPhoto } from "./photoActions";

import { firebaseConnect } from "react-redux-firebase";
import { Button, Header, Icon, Image, Message, Grid, Segment } from "semantic-ui-react";

const actions = {
  uploadPhoto
};
const mapState = state => ({
  loading: state.async.loading,
  auth: state.firebase.auth
});

class PhotoUpload extends Component {
  state = {
    files: [],
    fileName: "",

    image: {}
  };



  uploadImage = async () => {
    try {
     let photoURL = await this.props.uploadPhoto(
        this.state.image,
        this.state.fileName,
        this.props.auth.uid
      );
      this.cancelCrop();

      console.log({photoURL})
      this.props.handlePhotoUploaded(photoURL)
    } catch (error) {
      console.log({ error });
    }
  };

  onDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name
    });
    await this.props.handlePhotoUploaded(
      
      files[0]
    );

    this.setState({
      files: {},
      fileName: {}
    });
  };

  cropImage = () => {
    if (typeof this.refs.cropper.getCroppedCanvas() === "undefined") {
      return;
    }

    this.refs.cropper.getCroppedCanvas().toBlob(blob => {
      let imageUrl = URL.createObjectURL(blob);

      this.setState({
        cropResult: imageUrl,
        image: blob
      });
    }, "image/jpeg");
  };

  render() {
    const { loading, videoOnly } = this.props;

    return (

      <Dropzone
      style={{
        width: "100%",
        marginTop: 10,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: "20px",
        display: "block",
        height: 30,
        backgroundColor: "orange"
      }}
      onDropRejected={console.log('rejected')}
      onDrop={this.onDrop}
      multiple={false}
      accept={videoOnly? "video/*": "image/jpeg,image/png,image/gif"}
    >
      <div style={{ textAlign: "center" }}>
        <Header style={{ paddingTop: 4 }} content={videoOnly?"+Add Video":"+Add Photo"} />
      </div>
    </Dropzone>
     
    
    );
  }
}

export default connect(
  mapState,
  actions
)(

    firebaseConnect(props => [`stripe_verfication_tokens/${props.auth.uid}`])(
      PhotoUpload
    )
  
);
