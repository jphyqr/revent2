import React, { Component } from "react";
import {
  Modal,
  Header,
  Button,
  Form,
  Grid,
  Divider,
  Image,
  Icon,
  Message
} from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Field, reduxForm } from "redux-form";
import Checkbox from "../../../app/common/form/Checkbox";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import { updateSkills } from "../../user/userActions";
const actions = {
  closeModal,
  updateSkills
};

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
   //   subcollections: [{ collection: "updatedSkills" }],
      storeAs: "profile"
    }
  ];
};

const mapState = state => {
  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    initialValues: (state.firestore.ordered.profile&&state.firestore.ordered.profile[0]&&state.firestore.ordered.profile[0].updatedSkills) ||{}
  };
};

class LabourProfileModal extends Component {
  render() {
    const { closeModal, updateSkills, handleSubmit, pristine} = this.props;
    return (
      <Modal closeIcon="close" open={true} onClose={closeModal}>
        <Modal.Header>Labour Profile</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Form
              style={{ overflowY: "auto", overflowX: "hidden" }}
              onSubmit={this.props.handleSubmit(updateSkills)}
            >
            
            <Header as="h4">Overview</Header>
            Hourly Rate <Field
                  name="rate"
                  type="text"
                  label="Hourly Rate"
                  component={TextInput}
                  
                />
                     Coverletter <Field
                  name="coverletter"
                  type="text"
                  label="Cover Letter"
                  component={TextArea}
                  
                />

              <Header as="h4">Availability</Header>
              <Form.Group inline>
              <Field
                  name="hasValidLicense"
                  type="checkbox"
                  label="Valid Drivers License"
                  component={Checkbox}
                />
                <Field
                  name="hasTransportation"
                  type="checkbox"
                  label="Has Transportation"
                  component={Checkbox}
                />

                <Field
                  name="hasBasicTools"
                  type="checkbox"
                  label="Has Basic Tools"
                  component={Checkbox}
                />
              </Form.Group>
              <Grid>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <Header as="h4">Experience </Header>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Header as="h4">Apprentice </Header>
                  </Grid.Column>
                  <Grid.Column width={4}>
                    <Header as="h4">Other </Header>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={4}>
                    <Field
                      name="woodForms"
                      type="checkbox"
                      label="Wood Forms"
                      component={Checkbox}
                    />
                    <Field
                      name="concretePouring"
                      type="checkbox"
                      label="Concrete Pouring"
                      component={Checkbox}
                    />

                    <Field
                      name="woodFraming"
                      type="checkbox"
                      label="Wood Framing"
                      component={Checkbox}
                    />

                    <Field
                      name="steelFraming"
                      type="checkbox"
                      label="Steel Framing"
                      component={Checkbox}
                    />

                    <Field
                      name="drywallInstall"
                      type="checkbox"
                      label="Drywall Install"
                      component={Checkbox}
                    />
                    <Field
                      name="battInsulation"
                      type="checkbox"
                      label="Batt Insulation"
                      component={Checkbox}
                    />
                    <Field
                      name="vapourBarrier"
                      type="checkbox"
                      label="Vapour Barrier"
                      component={Checkbox}
                    />
                    <Field
                      name="shingles"
                      type="checkbox"
                      label="Shingles"
                      component={Checkbox}
                    />
                    <Field
                      name="eaves"
                      type="checkbox"
                      label="Eaves"
                      component={Checkbox}
                    />
                    <Field
                      name="windows"
                      type="checkbox"
                      label="Windows"
                      component={Checkbox}
                    />
                    <Field
                      name="doors"
                      type="checkbox"
                      label="Doors"
                      component={Checkbox}
                    />
                    <Field
                      name="vinylSiding"
                      type="checkbox"
                      label="Vinyl Siding"
                      component={Checkbox}
                    />

<Field
                      name="brick"
                      type="checkbox"
                      label="Brick"
                      component={Checkbox}
                    />
                    <Field
                      name="hardyBoard"
                      type="checkbox"
                      label="Hardy Board"
                      component={Checkbox}
                    />
                                        <Field
                      name="stucco"
                      type="checkbox"
                      label="Stucco"
                      component={Checkbox}
                    />
                                                            <Field
                      name="tile"
                      type="checkbox"
                      label="Tile"
                      component={Checkbox}
                    />
                                                            <Field
                      name="paint"
                      type="checkbox"
                      label="Paint"
                      component={Checkbox}
                    />
                                                                                <Field
                      name="tape"
                      type="checkbox"
                      label="Mud and Tape"
                      component={Checkbox}
                    />
                                                                                <Field
                      name="sanding"
                      type="checkbox"
                      label="Sanding"
                      component={Checkbox}
                    />
                                                                                                  <Field
                      name="laminate"
                      type="checkbox"
                      label="Laminate"
                      component={Checkbox}
                    />
                                                                                                                   <Field
                      name="vinyl"
                      type="checkbox"
                      label="Vinyl Planks"
                      component={Checkbox}
                    />
                                                                                                                   <Field
                      name="hardwood"
                      type="checkbox"
                      label="Hardwood"
                      component={Checkbox}
                    />
                                                                                                                                       <Field
                      name="trim"
                      type="checkbox"
                      label="Trim"
                      component={Checkbox}
                    />
                                                                                                                                       <Field
                      name="cabinates"
                      type="checkbox"
                      label="Cabinates"
                      component={Checkbox}
                    />
                                                                                                                                       <Field
                      name="counterTop"
                      type="checkbox"
                      label="counterTop"
                      component={Checkbox}
                    />
                  </Grid.Column>
                  <Grid.Column width={4} >
                  <Field
                      name="bricklayer"
                      type="checkbox"
                      label="Bricklayer"
                      component={Checkbox}
                    />
                                        <Field
                      name="cabinetmaker"
                      type="checkbox"
                      label="Cabinetmaker"
                      component={Checkbox}
                    />
                                        <Field
                      name="carpenter"
                      type="checkbox"
                      label="Carpenter"
                      component={Checkbox}
                    />
                                      <Field
                      name="gasfitter"
                      type="checkbox"
                      label="Gasfitter"
                      component={Checkbox}
                    />
                                                          <Field
                      name="glazier"
                      type="checkbox"
                      label="Glazier"
                      component={Checkbox}
                    />
                                                                              <Field
                      name="insulator"
                      type="checkbox"
                      label="Insulator"
                      component={Checkbox}
                    />
                                                                              <Field
                      name="painterAndDecorator"
                      type="checkbox"
                      label="Painter and Decorator"
                      component={Checkbox}
                    />
                                                                              <Field
                      name="plumber"
                      type="checkbox"
                      label="Plumber"
                      component={Checkbox}
                    />
                                                                                                  <Field
                      name="electritian"
                      type="checkbox"
                      label="Electritian"
                      component={Checkbox}
                    />
                                                                                            <Field
                      name="roofer"
                      type="checkbox"
                      label="Roofer"
                      component={Checkbox}
                    />
                                                                                                                <Field
                      name="sheetMetalWorker"
                      type="checkbox"
                      label="Sheet Metal Worker"
                      component={Checkbox}
                    />
                                                                                                                <Field
                      name="tilesetter"
                      type="checkbox"
                      label="Tilesetter"
                      component={Checkbox}
                    />


                  </Grid.Column>
                  <Grid.Column width={4} >


                                                          <Field
                      name="projectManager"
                      type="checkbox"
                      label="Project Management"
                      component={Checkbox}
                    />
                                                          <Field
                      name="cleanup"
                      type="checkbox"
                      label="Site Cleanup"
                      component={Checkbox}
                    />
                                                                              <Field
                      name="skidsteer"
                      type="checkbox"
                      label="Skidsteer"
                      component={Checkbox}
                    />
                                                                              <Field
                      name="zoomboom"
                      type="checkbox"
                      label="Zoomboom"
                      component={Checkbox}
                    />
                                                                              <Field
                      name="forklift"
                      type="checkbox"
                      label="Forklift"
                      component={Checkbox}
                    />
                                                                                           <Field
                      name="h2s"
                      type="checkbox"
                      label="H2S Alive"
                      component={Checkbox}
                    />
                                                                                                               <Field
                      name="confinedSpace"
                      type="checkbox"
                      label="Confined Space"
                      component={Checkbox}
                    />
                                                                                                               <Field
                      name="leadershipSafetyExcellence"
                      type="checkbox"
                      label="Leadership for Safety Excellence"
                      component={Checkbox}
                    />
                                                                                                                                   <Field
                      name="firstAid"
                      type="checkbox"
                      label="First Aid"
                      component={Checkbox}
                    />
  
                  
                  </Grid.Column>
                </Grid.Row>
              </Grid>

              <Button positive type="submit">
                Save
              </Button>
            </Form>
          </Modal.Description>
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
    form: "skillsForm",
    enableReinitialize: true,
    destroyOnUnmount: false
  })
)(LabourProfileModal);
