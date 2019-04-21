import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Card,
  Image,
  Icon,
  Header,
  Tab,
  Divider,
  Button,
  Grid,
  Message
} from "semantic-ui-react";
import { firestoreConnect, isEmpty, isLoaded } from "react-redux-firebase";
import { openModal } from "../../../modals/modalActions";
import BuilderPane from "./BuilderPane";
import ContractorPane from "./ContractorPane";
import LabourPane from "./LabourPane";
import ProfilePane from "./ProfilePane"
import { createLabourProfile , uploadLabourPhoto, uploadContractorPhoto, uploadBuilderPhoto} from "../../../user/userActions";

const query = ({ auth }) => {
  if (auth !== null) {
    return [
      {
        collection: "users",
        doc: auth.uid,

        storeAs: "profile"
      },
      {
        collection: "users",
        doc: auth.uid,
        subcollections: [{ collection: "bank_account_status" }],
        storeAs: "bank_account_status"
      },
      {
        collection: "labour_profiles",
        doc: auth.uid,

        storeAs: "labour_profile"
      }
    ];
  }
};

const actions = {
  openModal,
  createLabourProfile,uploadLabourPhoto, uploadContractorPhoto, uploadBuilderPhoto
};
const mapState = state => {
  let authuid = state.firebase.auth.uid || {};
  let sources =
    (!isEmpty(state.firebase.ordered.stripe_customers) &&
      isLoaded(state.firebase.ordered.stripe_customers) &&
      state.firebase.ordered.stripe_customers[authuid].sources) ||
    {};

  return {
    auth: state.firebase.auth,
    bank_account_status:
      (state.firestore.ordered.bank_account_status &&
        state.firestore.ordered.bank_account_status[0]) ||
      {},
    profile:
      (state.firestore.ordered.profile && state.firestore.ordered.profile[0]) ||
      {},
    sources,
    labour_profile:
      (isLoaded(state.firestore.ordered.labourProfile) &&
        state.firestore.ordered.labourProfile) ||
      null
  };
};

class Profile extends Component {
  state = {
    profile: {}
  };

  componentDidMount() {
    this.setState({ profile: this.props.profile });
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.profile !== this.state.profile) {
      this.setState({ profile: nextProps.profile });
      this.forceUpdate();
    }
  };
  renderPanes = () => {
    const { profile } = this.state;
    const { openModal,uploadProfileImage, labour_profile, createLabourProfile, compactDisplayMode } = this.props;
    const { builderProfile, contractorProfile } = profile || {};
    return [
      {
        menuItem: "Profile",
        render: () => (
          <Tab.Pane attached style={{ height: "100%" }}>
            <ProfilePane
              profile={profile}
              openModal={openModal}
              compactDisplayMode
              
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: "Builder",
        render: () => (
          <Tab.Pane attached style={{ height: "100%" }}>
            <BuilderPane
              builderProfile={builderProfile}
              openModal={openModal}
              uploadProfileImage={uploadProfileImage}
              uploadBuilderPhoto={this.props.uploadBuilderPhoto}
              compactDisplayMode
            />
          </Tab.Pane>
        )
      },
      //{ menuItem: <MessageMenuItem/>, render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
      {
        menuItem: "Contractor",
        render: () => (
          <Tab.Pane attached style={{ height: "100%" }}>
            <ContractorPane
              contractorProfile={contractorProfile}
              openModal={openModal}
              uploadProfileImage={uploadProfileImage}
              uploadContractorPhoto={this.props.uploadContractorPhoto}
              compactDisplayMode
            />
          </Tab.Pane>
        )
      },
      {
        menuItem: "Labour",
        render: () => (
          <Tab.Pane attached style={{ height: "100%", paddingTop:0 }}>
            <LabourPane
              createLabourProfile={createLabourProfile}
              profile={profile}
              openModal={openModal}
              labour_profile={labour_profile}
              uploadLabourPhoto={this.props.uploadLabourPhoto}
              compactDisplayMode={compactDisplayMode}
            />
          </Tab.Pane>
        )
      }
    ];
  };

  render() {
    const { bank_account_status, credit_cards, compactDisplayMode } = this.props || {};
    const { profile } = this.state;
    const {
      city,
      displayName,
      photoURL,
      companyName,
      companyUrl,
      facebookUrl,
      instagramUrl,
      builderProfile,
      contractorProfile,
      labourProfile,

      profileHasBeenClosed,
      hasValidConnectedAccount,
      hasValidCreditCard
    } = profile;
    const { verified: connectedAccountIsVerified } = bank_account_status || {};

    return (
      <div
        style={{
          width: "100%",
          maxHeight: compactDisplayMode?"300px": "500px",
          backgroundColor: "lightgrey",
          overflowX:"hidden", overflowY:"auto"
          
          // position: "relative"
        }}
      >
        <Grid>

          <Grid.Column width={16} >       
            <Tab
            attached
              style={{  width: "100%", height: "100%", margin:0, padding:compactDisplayMode?0:20 }}
              menu={{ secondary: true, margin:0, padding:0}}
              panes={this.renderPanes()}
            /></Grid.Column>
        </Grid>
        {/* <Grid>
          <Grid.Row>
            <Grid.Column width={4}>
              <img
                onClick={() => this.props.openModal("ProfileModal")}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: "50%",
                  border: "3px solid grey",
                  transition: "0.15s all ease"
                  //  position: "absolute",
                  //   top: 0,
                  //   left: 0
                }}
                src={photoURL || "/assets/user.png"}
              />
            </Grid.Column>
            <Grid.Column width={12}>
              <Grid.Row>
                <label
                  style={{
                    //     position: "absolute",
                    fontSize: 18,
                    color: "grey",
                    //    top: 5,
                    //     left: 100,
                    textOverflow: "ellipsis"
                  }}
                >
                  {displayName}
                </label>
              </Grid.Row>
              {companyUrl && (
                <Grid.Row>
                  (
                  <label
                    style={{
                      //  position: "absolute",
                      fontSize: 14,
                      color: "grey",
                      //    top: 27,
                      //   left: 102,
                      textOverflow: "ellipsis"
                    }}
                  >
                    <a href={companyUrl}> {companyName || "Add Company"}</a>
                  </label>
                  )
                </Grid.Row>
              )}

              <Grid.Row>
                <Button.Group>
                  {" "}
                  <Button
                    size="mini"
                    color="facebook"
                    icon="facebook"
                    onClick={() => window.location.assign(facebookUrl)}
                    disabled={!facebookUrl}
                    style={
                      {
                        //   position: "absolute",
                        //      top: 53,
                        //     left: 102
                      }
                    }
                    size="big"
                  />
                  <Button
                    size="mini"
                    color="instagram"
                    icon="instagram"
                    onClick={() => window.location.assign(instagramUrl)}
                    disabled={!instagramUrl}
                    style={
                      {
                        //   position: "absolute",
                        //     top: 53,
                        //     left: 160
                      }
                    }
                    size="big"
                  />
                  <Button
                    size="mini"
                    color="orange"
                    icon="chrome"
                    onClick={() => window.location.assign(companyUrl)}
                    disabled={!instagramUrl}
                    style={
                      {
                        //   position: "absolute",
                        //     top: 53,
                        //     left: 160
                      }
                    }
                    size="big"
                  />
                </Button.Group>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Tab
            attached
              style={{  width: "100%", height: "100%", padding:20 }}
              menu={{ secondary: true }}
              panes={this.renderPanes()}
            />
          </Grid.Row>
        </Grid> */}
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(Profile));
