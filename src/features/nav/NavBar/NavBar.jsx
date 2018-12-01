import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink, Link, withRouter } from "react-router-dom";
import SignedOutMenu from "../Menus/SignedOutMenu";
import SignedInMenu from "../Menus/SignedInMenu";
import BankAccountMenuItem from './BankConnectMenuItem'
import { openModal } from "../../modals/modalActions";
import {getAccount, clearAccount} from '../../modals/ConnectBankAccountModal/BankAccountManager/accountActions'


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

    if(newProps.accountToken!==this.props.accountToken)
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
    const { auth, profile ,currentConnectedAccount} = this.props;
    const authenticated = auth.isLoaded && !auth.isEmpty;

    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={Link} to="/" header>
            <img src="/assets/logo.png" alt="logo" />
            Re-vents
          </Menu.Item>
          {/* <Menu.Item as={NavLink} to="/events" name="Events" /> */}
          <Menu.Item as={NavLink} to="/jobs" name="Jobs" />
          {/* <Menu.Item as={NavLink} to="/test" name="Test" /> */}
          {authenticated && (
            <Menu.Item as={NavLink} to="/people" name="People" />
          )}
          {authenticated && (
            <Menu.Item as={NavLink} to="/messages" name="Messages" />
          )}
          {/* {authenticated && (
            <Menu.Item as={NavLink} to="/newmessages" name="New Messages" />
          )} */}
          

                    {authenticated && (
            <Menu.Item>
              <Button
                as={Link}
                to="/createJob"
                floated="right"
                positive
                inverted
                content="Create Job"
              />
            </Menu.Item>
          )}
            {authenticated? <BankAccountMenuItem
              currentConnectedAccount = {currentConnectedAccount}
              bankConnect={this.handleBankConnect}
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
