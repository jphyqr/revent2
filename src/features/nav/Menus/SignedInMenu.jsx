import React, { Component } from "react";
import { Menu, Responsive, Image, Segment, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { initializePush } from "../../../app/common/util/helpers";
import { storeDeviceToken } from "../../../features/user/userActions";
import firebase from "../../../app/config/firebase";
import { openModal } from "../../modals/modalActions";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { clearTask } from "../../../features/modals/TaskModal/taskActions";
import {setRole, clearRole} from './roleActions'
const query = ({ auth }) => {
  const authenticated = auth.isLoaded && !auth.isEmpty;
  if (authenticated) {
    return [
      {
        collection: "admin_users",
        doc: auth.uid,
        storeAs: "admin_user_profile"
      },
      {
        collection: "onboarder_users",
        doc: auth.uid,
        storeAs: "onboarder_user_profile"
      },
      {
        collection: "join_alpha",
        doc: auth.uid,
        storeAs: "alpha_profile"
      }
    ];
  } else {
    return [];
  }
};

const mapState = state => {
  return {
    auth: state.firebase.auth,
    verified: state.firebase.auth.emailVerified,
    isAdmin:
      (state.firestore.ordered.admin_user_profile &&
        state.firestore.ordered.admin_user_profile[0] &&
        state.firestore.ordered.admin_user_profile[0].isAdmin) ||
      false,

      isOnboarder:
      (state.firestore.ordered.onboarder_user_profile &&
        state.firestore.ordered.onboarder_user_profile[0] &&
        state.firestore.ordered.onboarder_user_profile[0].isOnboarder) ||
      false,

      isAlpha:
      (state.firestore.ordered.alpha_profile &&
        state.firestore.ordered.alpha_profile[0] &&
        state.firestore.ordered.alpha_profile[0].isAlpha) ||
      false
  };
};

const actions = {
  storeDeviceToken,
  openModal,
  clearTask,
  setRole,
  clearRole
};

const messaging = firebase.messaging();
messaging.onMessage(payload => {
  const { notification } = payload;
  //could show toast, etc
  console.log("onMessageSignedIn: ", payload);
  toastr.success(notification.title, notification.body);
});

class SignedInMenu extends Component {
  handleCreateCategory = () => {
    this.props.openModal("CategoryModal");
  };

  handleOnUpdate = (e, { width }) => this.setState({ width });


  handleNewField = () => {
    this.props.openModal("NewFieldModal");
  };


  handleOnboardSettings = () => {
    this.props.openModal("OnboardingModal");
  };



  handleNewTask = async () => {
    await this.props.clearTask();
    this.props.openModal("TaskModal");
  };

  async componentDidMount() {
    console.log("cdp auth");
   await this.props.storeDeviceToken();
   await this.props.setRole(this.props.isAdmin, this.props.isOnboarder, this.props.isAlpha, this.props.verified)
  
  }

   async componentWillReceiveProps(nextProps) {
    await this.props.setRole(nextProps.isAdmin, nextProps.isOnboarder, nextProps.isAlpha, this.props.verified)
  }

  render() {
    const { signOut, profile, auth, isOnboarder, isAdmin, isAlpha , verified} = this.props;

    const {width} = this.state ||{}
    const NAME_CUT_OFF = 400;
    const hideName = width >= NAME_CUT_OFF ? false : true; 
    return (
      <Responsive fireOnMount onUpdate={this.handleOnUpdate}>
      <Menu.Item position="right">
        <Image
          avatar
          size="mini"
          spaced="right"
          src={profile.photoURL || "/assets/user.png"}
        />
        <Dropdown pointing="top right" text={hideName? null : profile.displayName}>
          <Dropdown.Menu>
          
         {isAdmin &&  <Dropdown.Item
              onClick={this.handleCreateCategory}
              text="New Category"
              icon="plus"
            />}
          {isAdmin && <Dropdown.Item
              onClick={this.handleNewTask}
              text="New Task"
              icon="plus"
            />}
        {isAdmin&&   <Dropdown.Item
              onClick={this.handleNewField}
              text="New Field"
              icon="plus"
            />}
                    {isOnboarder&&   <Dropdown.Item
              onClick={this.handleOnboardSettings}
              text="Onboarding"
              icon="settings"
            />}

            <Dropdown.Item
              as={Link}
              to="/settings"
              text="Settings"
              icon="settings"
            />
            <Dropdown.Item onClick={signOut} text="Sign Out" icon="power" />
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
      </Responsive>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(SignedInMenu));
