import React, { Component } from "react";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { Menu, Container, Search, Button } from "semantic-ui-react";
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
            <img src="/assets/white on orange logo.png" alt="logo" />
            yAYbour
          </Menu.Item>
   
          <Menu.Item style={{width:"70%"}}position="right">
          
          <Search
          fluid
          style={{marginTop:"auto", width:"100%", marginBottom:"auto"}}
          //  loading={isLoading}
          //  onResultSelect={this.handleResultSelect}
         //   onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
         //   results={results}
        //    value={value}
          //  {...this.props}
          />
         </Menu.Item>
         <Menu.Item as={Link} to="/" header>
           JOIN BETA
          </Menu.Item>
            {/* {authenticated? <BankAccountMenuItem
              bankConnect={this.handleBankConnect}
            />: null}   */}
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
