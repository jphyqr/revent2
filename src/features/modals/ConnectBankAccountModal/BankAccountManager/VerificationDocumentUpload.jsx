import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { uploadGovernmentID } from "./accountActions";
import { CardElement, injectStripe } from "react-stripe-elements";
import Cropper from "react-cropper";
import { firebaseConnect } from "react-redux-firebase";
import { Button, Header, Icon, Image, Message, Grid, Segment } from "semantic-ui-react";

const actions = {
  uploadGovernmentID
};
const mapState = state => ({
  loading: state.async.loading,
  auth: state.firebase.auth
});

class VerificationDocumentUpload extends Component {
  state = {
    files: [],
    fileName: "",
    cropResult: null,
    image: {}
  };

  cancelCrop = () => {
    this.setState({
      files: [],
      image: {}
    });
  };

  uploadImage = async () => {
    try {
      await this.props.uploadGovernmentID(
        this.state.image,
        this.state.fileName,
        this.props.auth.uid,
        this.props.accountToken
      );
      this.cancelCrop();
    } catch (error) {
      console.log({ error });
    }
  };

  onDrop = files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name
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
    const { loading } = this.props;

    return (
    <Segment>

              <Message info>
          <Message.Header>Government Photo ID Required</Message.Header>
          <p> 
          Please upload an image of your drivers license, passport or other government issued photo identification.
                  </p>
        </Message>
       

        <Grid>
          <Grid.Row />
          <Grid.Column width={4}>
            <Header color="teal" sub content="Step 1 - Add Photo" />
            <Dropzone onDrop={this.onDrop} multiple={false}>
            <div style={{ paddingTop: "30px", textAlign: "center" }}>
              <Icon name="upload" size="huge" />
              <Header content="Drop image here or click to add" />
            </div>
          </Dropzone>
          </Grid.Column>
   

          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header sub color="teal" content="Step 2 - Resize image" />
            {this.state.files[0] && (
              <Cropper
                style={{ height: 200, width: "100%" }}
                ref="cropper"
                src={this.state.files[0].preview}
                aspectRatio={1}
                viewMode={0}
                dragMode="move"
                guides={false}
                scalable={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
                crop={this.cropImage}
              />
            )}
          </Grid.Column>
          <Grid.Column width={1} />
          <Grid.Column width={4}>
            <Header sub color="teal" content="Step 3 - Preview and Upload" />
            {this.state.files[0] && (
              <div>
                <Image
                  style={{ minHeight: "200px", minWidth: "200px" }}
                  src={this.state.cropResult}
                />

                <Button
                  loading={loading}
                  onClick={this.uploadImage}
                  style={{ width: "100px" }}
                  positive
                  icon="check"
                />
              </div>
            )}
          </Grid.Column>
        </Grid>
        </Segment>
    );
  }
}

export default connect(
  mapState,
  actions
)(
  injectStripe(
    firebaseConnect(props => [`stripe_verfication_tokens/${props.auth.uid}`])(
      VerificationDocumentUpload
    )
  )
);
