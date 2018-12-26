import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink, Link, withRouter } from "react-router-dom";
import SignedOutMenu from "../Menus/SignedOutMenu";
import SignedInMenu from "../Menus/SignedInMenu";
import BankAccountMenuItem from './BankConnectMenuItem'
import NotifcationsMenuItem from './Notifications/NotificationsMenuItem'
import { openModal } from "../../modals/modalActions";
import {getAccount, clearAccount} from '../../modals/ConnectBankAccountModal/BankAccountManager/accountActions'
import MessagesMenuItem from './Messages/MessagesMenuItem'

const actions = {
  openModal, clearAccount, getAccount
};

const mapState = state => {

  let authuid = state.firebase.auth.uid;
return{
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  accountToken:
  authuid &&
  state.firebase.ordered.stripe_connected_account &&
  state.firebase.ordered.stripe_connected_account[authuid] &&
  state.firebase.ordered.stripe_connected_account[authuid][0],
  currentAccount: state.account
}};

class NavBar extends Component {

  async componentWillReceiveProps(newProps) {

    if(newProps.accountToken&&newProps.accountToken!==this.props.accountToken)
    {let connectedAccount = this.props.getAccount(newProps.accountToken.value).then(account=>{
      console.log('new props', account)

    })

    
    }

  }

  handleSignIn = () => {
    this.forceUpdate();
    this.props.openModal("LoginModal");
  };

  handleRegister = () => {
    this.props.openModal("RegisterModal");
  };


  handleCreateJob = () =>{
    this.props.openModal("CreateJobModal")
  }


  handleCreateCategory = () =>{
    this.props.openModal("CategoryModal")
  }

  handleCreateTask = () =>{
    this.props.openModal("TaskModal")
  }

  handleBankConnect = () => {
    this.props.openModal("ConnectBankAccountModal");
  };

  handleSignOut = async ()  => {
  //  this.props.clearAccount();
this.props.clearAccount()
  //  const { firebase, match } = this.props;
    //await firebase.unsetListener(`stripe_connected_account/${match.params.id}`);

    this.props.firebase.logout();

    this.props.history.push("/");
  };

  render() {
    const { auth, profile } = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;

    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={Link} to="/" header>
            <img src="/assets/logo.png" alt="logo" />
            Re-vents
          </Menu.Item>
        {/* <Menu.Item as={NavLink} to="/events" name="Events" /> */}
          {/* <Menu.Item as={NavLink} to="/jobs" name="Jobs" /> */}
          <Menu.Item as={NavLink} to="/test" name="Test" />
          <Menu.Item as={NavLink} to="/testAnimations" name="Animation Test" />
          {/* {authenticated && (
            <Menu.Item as={NavLink} to="/people" name="People" />
          )} */}
          {authenticated && (
            <Menu.Item as={NavLink} to="/messages" name="Messages" />
          )}
                    {authenticated && (
            <Menu.Item as={NavLink} to="/build" name="Build" />
          )}
          {/* {authenticated && (
            <Menu.Item as={NavLink} to="/newmessages" name="New Messages" />
          )} */}
          

{authenticated && (
  <Menu.Item>
    <Button
      onClick={this.handleCreateTask}
      floated="right"
      positive
      inverted
      content="Create Task"
    />
  </Menu.Item>
)}


{authenticated && (
            <Menu.Item>
              <Button
                onClick={this.handleCreateCategory}
                floated="right"
                positive
                inverted
                content="Create Category"
              />
            </Menu.Item>
          )}


            {authenticated? <BankAccountMenuItem
              bankConnect={this.handleBankConnect}
            />: null}  
                        {authenticated? <NotifcationsMenuItem
             
            />: null}  
                           {authenticated? <MessagesMenuItem
             
             />: null}          
          {authenticated ? (
            
            <SignedInMenu
              auth={auth}
              profile={profile}
              signOut={this.handleSignOut}
            />
          ) : (
            <SignedOutMenu
              register={this.handleRegister}
              signIn={this.handleSignIn}
            />
          )}
        </Container>
      </Menu>
    );
  }
}

export default withRouter(
  
    connect(
      mapState,
      actions
    )(firebaseConnect(props => [`stripe_connected_account/${props.auth.uid}`])((NavBar)))
  
);



// export default compose(
//   connect(
//     mapState,
//     actions
//   ),
//   firebaseConnect(props => [`stripe_connected_account/${props.auth.uid}`])
// )(ConnectBankAccountModal);
