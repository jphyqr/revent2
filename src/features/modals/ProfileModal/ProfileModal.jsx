import React, { Component } from "react";
import {
  Modal,
  Transition,
  Header,
  Button,
  Statistic,
  Form,
  Grid,
  Divider,
  Card,
  Segment,
  Image,
  Icon,
  Message
} from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { toastr } from "react-redux-toastr";
import Dropzone from "react-dropzone";
import Cropper from "react-cropper";
import { compose } from "redux";
import { Field, reduxForm } from "redux-form";
//import { clearQuote, hireContractor } from "../QuoteJobModal/quoteActions";
import {
  uploadProfileImage,
  deletePhoto,
  setMainPhoto,
  updateProfile
} from "../../user/userActions";
import { isEmpty, isLoaded } from "react-redux-firebase";
import moment from "moment";
import format from "date-fns/format";
import { objectToArray } from "../../../app/common/util/helpers";
import TextInput from "../../../app/common/form/TextInput";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { isFirstDayOfMonth } from "date-fns";

const actions = {
  closeModal,
  uploadProfileImage,
  deletePhoto,
  setMainPhoto,
  updateProfile
};

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "photos" }],
      storeAs: "photos"
    }
  ];
};

const mapState = state => {
  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    initialValues: state.firebase.profile || {},
    photos: state.firestore.ordered.photos
  };
};

class ProfileModal extends Component {
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

  handlePhotoDelete = photo => async () => {
    try {
      this.props.deletePhoto(photo);
    } catch (error) {
      toastr.error("Oops", error.message);
    }
  };

  handleSetMainPhoto = photo => async () => {
    try {
      this.props.setMainPhoto(photo);
    } catch (error) {
      toastr.error("Ooops", error.message);
    }
  };

  uploadImage = async () => {
    try {
      await this.props.uploadProfileImage(
        this.state.image,
        this.state.fileName,
        "user_images"
      );
      this.cancelCrop();
      toastr.success("Success!", "Photo has been uploaded");
    } catch (error) {
      toastr.error("Oops", error.message);
    }
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

  onDrop = files => {
    this.setState({
      files,
      fileName: files[0].name
    });
  };

  render() {
    const {
      photos,
      profile,
      loading,
      updateProfile,
      pristine,
      submitting
    } = this.props;
    let filteredPhotos;
    if (photos) {
      filteredPhotos = photos.filter(photo => {
        return photo.url !== profile.photoURL;
      });
    }

    return (
      <Modal closeIcon="close" open={true} onClose={this.props.closeModal}>
        <Modal.Header>Profile Modal</Modal.Header>
        <Modal.Content scrolling>
          <div
            style={{ overflowY: "auto", overflowX: "hidden", height: "1200px" }}
          >
            <Segment>
              <Form onSubmit={this.props.handleSubmit(updateProfile)}>
                <Form.Group inline>
                  <Field
                    width={8}
                    name="displayName"
                    type="text"
                    component={TextInput}
                    placeholder="Known As"
                  />
                  <Field
                    name="city"
                    placeholder="Home Town"
                    options={{ types: ["(cities)"] }}
                    label="Female"
                    component={PlaceInput}
                    width={8}
                  />
                </Form.Group>

                <Form.Group inline>
                  <Field
                    width={8}
                    name="companyName"
                    type="text"
                    component={TextInput}
                    placeholder="Company Name"
                  />
                  <Field
                    width={8}
                    name="companyUrl"
                    type="text"
                    component={TextInput}
                    placeholder="Company Website URL"
                  />
                </Form.Group>

                <Form.Group inline>
                  <Field
                    width={8}
                    name="facebookUrl"
                    type="text"
                    component={TextInput}
                    placeholder="Facebook URL"
                  />
                  <Field
                    width={8}
                    name="instagramUrl"
                    type="text"
                    component={TextInput}
                    placeholder="Instagram URL"
                  />
                </Form.Group>

                <Divider />
                <Button
                  disabled={pristine || submitting}
                  size="large"
                  positive
                  content="Update Profile"
                />
              </Form>

              <Header dividing size="large" content="Your Photos" />
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
                  <Header
                    sub
                    color="teal"
                    content="Step 3 - Preview and Upload"
                  />
                  {this.state.files[0] && (
                    <div>
                      <Image
                        style={{ minHeight: "200px", minWidth: "200px" }}
                        src={this.state.cropResult}
                      />
                      <Button.Group>
                        <Button
                          loading={loading}
                          onClick={this.uploadImage}
                          style={{ width: "100px" }}
                          positive
                          icon="check"
                        />
                        <Button
                          disabled={loading}
                          onClick={this.cancelCrop}
                          style={{ width: "100px" }}
                          icon="close"
                        />
                      </Button.Group>
                    </div>
                  )}
                </Grid.Column>
              </Grid>

              <Divider />
              <Header sub color="teal" content="All Photos" />

              <Card.Group itemsPerRow={5}>
                <Card>
                  <Image src={profile.photoURL || "/assets/user.png"} />
                  <Button positive>Main Photo</Button>
                </Card>

                {photos &&
                  filteredPhotos.map(photo => (
                    <Card key={photo.id}>
                      <Image src={photo.url} />
                      <div className="ui two buttons">
                        <Button
                          loading={loading}
                          onClick={this.handleSetMainPhoto(photo)}
                          basic
                          color="green"
                        >
                          Main
                        </Button>
                        <Button
                          onClick={this.handlePhotoDelete(photo)}
                          basic
                          icon="trash"
                          color="red"
                        />
                      </div>
                    </Card>
                  ))}
              </Card.Group>
            </Segment>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default compose(
  connect(
    mapState,
    actions
  ),
  firestoreConnect(auth => query(auth)),
  reduxForm({
    form: "userProfile",
    enableReinitialize: true,
    destroyOnUnmount: false
  })
)(ProfileModal);
