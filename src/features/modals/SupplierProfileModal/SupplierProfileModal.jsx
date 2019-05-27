/*global google*/

import React, { Component } from "react";
import {
  Modal,
  Transition,
  Header,
  Button,
  Statistic,
  Dropdown,
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
import Script from "react-load-script";
import { firestoreConnect } from "react-redux-firebase";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { toastr } from "react-redux-toastr";
import Dropzone from "react-dropzone";
import Cropper from "react-cropper";
import { compose } from "redux";
import { Field, reduxForm } from "redux-form";
import PhotoUpload from "../../../app/common/form/PhotoUpload/PhotoUpload";
//import { clearQuote, hireContractor } from "../QuoteJobModal/quoteActions";
import {
  uploadProfileImage,
  deletePhoto,
  setMainPhoto,
  updateSupplierProfile,
  updateSupplierPhoto
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
  updateSupplierProfile,
  updateSupplierPhoto
};

const query = ({ auth }) => {
  return [
    {
      collection: "supplier_users",
      doc: auth.uid,

      storeAs: "supplier_profile"
    }
  ];
};

const mapState = state => {
  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    isles: state.firestore.ordered.isles,
    profile: state.firebase.profile,
    supplierProfile:
      (state.firestore.ordered.supplier_profile &&
        state.firestore.ordered.supplier_profile[0]) ||
      {},
    initialValues:
      (state.firestore.ordered.supplier_profile &&
        state.firestore.ordered.supplier_profile[0]) ||
      {}
  };
};

class SupplierProfileModal extends Component {
  state = {
    files: [],
    fileName: "",
    cropResult: null,
    image: {},
    selectedIsles: [],
    cityLatLng: {},
    venueLatLng: {},
    selectedCity: "",
    scriptLoaded: false,
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

  handleRenderList = isles => {
    let item;
    let list = [];
    isles &&
      isles.map(isle =>
        list.push({
          key: isle.id,
          text: isle.name,
          value: isle.id
        })
      );

    return list;
  };

  handleSetMainPhoto = photo => async () => {
    try {
      this.props.setMainPhoto(photo);
    } catch (error) {
      toastr.error("Ooops", error.message);
    }
  };

  handleScriptLoaded = () => this.setState({ scriptLoaded: true });


  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`isles`);


  }

  async componentDidMount() {
    const { firestore } = this.props || {};
    await firestore.setListener(`isles`);

    if (this.props.initialValues) {
        this.handleVenueSelect(this.props.initialValues.venue);
        this.setState({selectedIsles: this.props.supplierProfile.selectedIsles || []})
      }
  }


  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("city", selectedCity);
      });
  };

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        this.props.change("venue", selectedVenue);
      });
  };

   renderLabel = label => ({
    color: 'blue',
    content: `Customized label - ${label.text}`,
    icon: 'check',
  })

  handlePhotoUploaded = async file => {
    await this.props.updateSupplierPhoto(file);
    //this.setState({ exampleURL: exampleURL });
    //this.setState({ examplePhotoHasUpdated: true });
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

  handleChange = (e, { value }) => {
      console.log({value})
    this.setState({ selectedIsles: value });
  };


  handleSubmit = async values => {


        values.venueLatLng = this.state.venueLatLng;
        values.selectedIsles  = this.state.selectedIsles
        await this.props.updateSupplierProfile(values);
    


  
    
  };



  render() {
    const {
      photos,
      profile,
      loading,
      updateSupplierProfile,
      pristine,
      submitting,
      supplierProfile,
      isles
    } = this.props;
    const list = this.handleRenderList(isles);
    const { storePhotoUrl } = supplierProfile || {};
    let filteredPhotos;
    if (photos) {
      filteredPhotos = photos.filter(photo => {
        return photo.url !== profile.photoURL;
      });
    }

    return (
      <Modal closeIcon="close" open={true} onClose={this.props.closeModal}>
        <Script
          url="https://maps.googleapis.com/maps/api/js?key=AIzaSyCQc2wDlRKjT6P-SV4vl_lq-YyFFnbqujw&libraries=places"
          onLoad={this.handleScriptLoaded}
        />
        <Modal.Header>Supplier Profile Modal</Modal.Header>
        <Modal.Content scrolling>
          <div
            style={{ overflowY: "auto", overflowX: "hidden", height: "1200px" }}
          >
            <Segment>
            <Form
                  style={{ margin: "10px" }}
                  onSubmit={this.props.handleSubmit(this.handleSubmit)}
                >
                <Form.Group inline>
                  <Field
                    width={8}
                    name="storeName"
                    type="text"
                    component={TextInput}
                    placeholder="Store Name"
                  />
                </Form.Group>

                <Form.Group inline>
                  <Field
                    width={8}
                    name="storeUrl"
                    type="text"
                    component={TextInput}
                    placeholder="Store Website URL"
                  />
                              <Field
                    width={8}
                    name="storePhoneNumber"
                    type="text"
                    component={TextInput}
                    placeholder="Store Phone Number"
                  />
                </Form.Group>

                <Field
                  name="city"
                  type="text"
                  value={this.state.selectedCity}
                  component={PlaceInput}
                  options={{ types: ["(cities)"] }}
                  placeholder="Job city"
                  onSelect={this.handleCitySelect}
                />
                {this.state.scriptLoaded && (
                  <Field
                    name="venue"
                    type="text"
                    component={PlaceInput}
                    options={{
                      location: new google.maps.LatLng(this.state.cityLatLng),
                      radius: 1000,
                      types: ["address"]
                    }}
                    placeholder="Street Address"
                    onSelect={this.handleVenueSelect}
                  />
                )}

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

<Dropdown
              placeholder="Select Isle"
              fluid
              multiple
              selection
              options={list}
              onChange={this.handleChange}
              value={this.state.selectedIsles}
              renderLabel={this.renderLabel}
            />

              </Form>

              <Divider />
              <Header sub color="teal" content="Store Photo" />
              <PhotoUpload handlePhotoUploaded={this.handlePhotoUploaded} />
              {storePhotoUrl && (
                <Image size="small" src={storePhotoUrl || "/assets/user.png"} />
              )}
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
    form: "supplierProfile",
    enableReinitialize: true,
    destroyOnUnmount: false
  })
)(SupplierProfileModal);
