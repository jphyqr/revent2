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
import { setRole, clearRole } from "./roleActions";
import { setNotifications } from "../../user/userActions";
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
      },
      {
        collection: "users",
        doc: auth.uid,
        storeAs: "user_profile"
      }
    ];
  } else {
    return [];
  }
};

const mapState = state => {
  return {
    auth: state.firebase.auth,
    hideHowToPost:
    (state.firestore.ordered.user_profile &&
      state.firestore.ordered.user_profile[0] &&
      state.firestore.ordered.user_profile[0].hideHowToPost) ||
    false,
    newContract:
      (state.firestore.ordered.user_profile &&
        state.firestore.ordered.user_profile[0] &&
        state.firestore.ordered.user_profile[0].newContract) ||
      false,
    newQuotes:
      (state.firestore.ordered.user_profile &&
        state.firestore.ordered.user_profile[0] &&
        state.firestore.ordered.user_profile[0].newQuotes) ||
      [],

    newMessage:
      (state.firestore.ordered.user_profile &&
        state.firestore.ordered.user_profile[0] &&
        state.firestore.ordered.user_profile[0].newMessage) ||
      false,
    newNotification:
      (state.firestore.ordered.user_profile &&
        state.firestore.ordered.user_profile[0] &&
        state.firestore.ordered.user_profile[0].newNotification) ||
      false,
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
  clearRole,
  setNotifications
};

const messaging = firebase.messaging();
messaging.onMessage(payload => {
  const { notification } = payload;
  //could show toast, etc
  console.log("onMessageSignedIn: ", payload);
  toastr.success(notification.title, notification.body);
});

class SignedInMenu extends Component {
  state = {
    notifications: {},
    stateContract: false,
    stateMessage: false,
    stateQuotes: {},
    stateNotification: false,
    stateHideHowToPost: false
  };
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
    const {
      newContract,
      newMessage,
      newNotification,
      isAdmin,
      isOnboarder,
      isAlpha,
      verified,
      hideHowToPost
    } = this.props 

    console.log('CDM Quotes', this.props.newQuotes)
    await this.props.storeDeviceToken();
    await this.props.setRole(
      this.props.isAdmin,
      this.props.isOnboarder,
      this.props.isAlpha,
      this.props.verified
    );

    await this.setState({
      stateContract: newContract,
      stateMessage: newMessage,
      stateQuotes: this.props.newQuotes,
      stateNotification: newNotification,
      stateHideHowToPost:hideHowToPost
    });
    await this.props.setNotifications(
      this.state.stateContract,
      this.state.stateMessage,

      this.state.stateQuotes,
      this.state.stateNotification,
      this.state.stateHideHowToPost
    );
  }

  componentWillReceiveProps = async nextProps => {
    const {
      newContract,
     
      newMessage,
      newNotification,
      isAdmin,
      isOnboarder,
      isAlpha, hideHowToPost
    } = nextProps || {};

    if (
      isAdmin !== this.props.isAdmin ||
      isOnboarder !== this.props.isOnboarder ||
      isAlpha !== this.props.isAlpha
    ) {
      console.log("SETTING ROLE");
      await this.props.setRole(
        nextProps.isAdmin,
        nextProps.isOnboarder,
        nextProps.isAlpha,
        this.props.verified
      );
    }

    if (
      !(
        newContract === this.state.stateContract &&
        (this.props.newQuotes&&this.props.newQuotes.length) === this.state.stateQuotes.length &&
        newMessage === this.state.stateMessage &&
        newNotification === this.state.stateNotification
      )
    ) {

      if(newContract!==this.state.stateContract)
        console.log("contracts dont match")
        
      if(this.props.newQuotes&&this.props.newQuotes.length!==this.state.stateQuotes.length)
      console.log("quotes dont match")
      
      if(newMessage!==this.state.stateMessage)
        console.log("message dont match")
        
      if(newNotification!==this.state.stateNotification)
      console.log("notifications dont match")



      console.log("SETTING NOTIFICATIONS");
      console.log("newContract", newContract);
      console.log("stateContract", this.state.stateContract);
      console.log("newQuotes", this.props.newQuotes);
      console.log("stateQuotes", this.state.stateQuotes);
      console.log("newMessage", newMessage);
      console.log("stateMessage", this.state.stateMessage);
      console.log("newNotification", newNotification);
      console.log("stateNotification", this.state.stateNotification);
      await this.setState({
        stateContract: newContract,
        stateQuotes: this.props.newQuotes,
        stateMessage: newMessage,
        stateNotification: newNotification,
        stateHideHowToPost: hideHowToPost
      });

      await this.props.setNotifications(
        this.state.stateContract,
        this.state.stateQuotes,
        this.state.stateMessage,
        this.state.stateNotification,
        this.state.stateHideHowToPost
      );
    }
  };

  render() {
    const {
      signOut,
      profile,
      auth,
      isOnboarder,
      isAdmin,
      isAlpha,
      verified
    } = this.props;

    const { width } = this.state || {};
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
          <Dropdown
            pointing="top right"
            text={hideName ? null : profile.displayName}
          >
            <Dropdown.Menu>
              {isAdmin && (
                <Dropdown.Item
                  onClick={this.handleCreateCategory}
                  text="New Category"
                  icon="plus"
                />
              )}
              {isAdmin && (
                <Dropdown.Item
                  onClick={this.handleNewTask}
                  text="New Task"
                  icon="plus"
                />
              )}
              {isAdmin && (
                <Dropdown.Item
                  onClick={this.handleNewField}
                  text="New Field"
                  icon="plus"
                />
              )}
              {isOnboarder && (
                <Dropdown.Item
                  onClick={this.handleOnboardSettings}
                  text="Onboarding"
                  icon="settings"
                />
              )}

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
