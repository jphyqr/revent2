import React, { Component } from "react";
import Dropzone from "react-dropzone";
import { connect } from "react-redux";
import { uploadPhoto, openPhotoAlbum } from "./photoActions";
import { openModal } from "../../../../features/modals/modalActions";
import { firebaseConnect, isLoaded } from "react-redux-firebase";
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

const actions = {
  uploadPhoto,
  openPhotoAlbum,
  openModal
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

  componentDidUpdate(prevProps) {
    console.log({ prevProps });
    const { photos } = this.props || [];
    if (isLoaded(photos) && photos.length > prevProps.photos.length) {
      console.log("photo length longer");
      //    if(photos[0].thumb)
      //    this.setState({showPlaceholder:false, placeholderURL:""})
    }
  }
  componentWillReceiveProps = nextProps => {};

  uploadImage = async () => {
    try {
      let photoURL = await this.props.uploadPhoto(
        this.state.image,
        this.state.fileName,
        this.props.auth.uid
      );
      this.cancelCrop();

      console.log({ photoURL });
      this.props.handlePhotoUploaded(photoURL);
    } catch (error) {
      console.log({ error });
    }
  };

  onDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name,
      placeholderURL: files[0].preview,
      showPlaceholder: true
    });
    await this.props.handlePhotoUploaded(files[0]);

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

  checkIfLoaded = index => {
    if (index === 0) this.setState({ showPlaceholder: false });
  };
  handleOpenAlbum = async (photos, index) => {
    await this.props.openPhotoAlbum(photos, index);
    this.props.openModal("PhotoAlbumModal");
  };

  render() {
    const { loading, photos, videoOnly, photosLoading } = this.props;

    return (
      <div style={{ width: "100%" }}>
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
          onDropRejected={console.log("rejected")}
          onDrop={this.onDrop}
          multiple={false}
          accept={videoOnly ? "video/*" : "image/jpeg,image/png,image/gif"}
        >
          <div style={{ textAlign: "center" }}>
            <Header
              style={{ paddingTop: 4 }}
              content={videoOnly ? "+Add Video" : "+Add Photo"}
            />
          </div>
        </Dropzone>

        <Divider />
        <div
          style={{
            height: 115,
            width: "auto",
            whiteSpace: "nowrap",
            padding: 5,
            backgroundColor: "lightgrey",
            overflowY: "hidden",
            overflowX: "auto",
            verticalAlign: "middle"
          }}
        >
          {/* { !(photos&&photos[0]&&photos[0].thumb)&&( */}
          {this.state.showPlaceholder && (
              <Segment inverted              style={{
                padding:0,
                marginLeft:10,
              //  marginTop:0,
            //    marginBottom:0,
             //   marginRight:0,
                display: "inline-block",
                opacity: 1,
                maxHeight: 115,
                maxWidth: 115,
                verticalAlign:"middle"
              }}>
              <Loader active  />
          
              <Image  style={{   maxWidth: 115, 
                  maxHeight: 115, }} src={this.state.placeholderURL} />
            </Segment>
       
          )}

          {photos &&
            photos.map((photo, index) => (

              <Popup trigger={
              <Image
                onLoad={() => this.checkIfLoaded(index)}
              //  onClick={() => this.handleOpenAlbum(photos, index)}
                style={{
                  marginLeft: 10,
                  marginTop:"auto",
                  marginBottom:"auto",
                  maxHeight: 115,
                  display: "inline-block",
                  maxWidth: 115
                }}
                src={photo.thumb}
              />}  hoverable on='click'>
                <Button.Group>
                  <Button positive onClick={() => this.handleOpenAlbum(photos, index)}>View</Button>
                  <Button onClick={() => this.props.handleDeletePhoto(photo)}>Delete</Button>
                </Button.Group>
              </Popup>
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
    PhotoUpload
  )
);
