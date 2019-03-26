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
import JoinBetaMenu from '../Menus/JoinBetaMenu'
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

state={
  join:false
}

  async componentWillReceiveProps(newProps) {
    //if you are authenticated assume we want to go to 
    //the app.  But from the app should be able to click on 
    //join beta just for now for demo.
    //on the join page itd oesnt matter if you are logged in or not
    //so lets just have a button in the nav bar at all time
    //too go to the join beta.  In future we should add logic to remove
    //the join beta if authenticated.
    



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


  backToApp = () => {
    this.setState({join:false})
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
    const {join} = this.state
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={Link} to="/" header>
            <img src="/assets/white on orange logo.png" alt="logo" />
            yAYbour
          </Menu.Item>
   
          <Menu.Item style={{width:"30%"}}position="right"> 
          
      <Search
          fluid
          style={{marginTop:"auto", width:"auto", marginBottom:"auto"}}
          //  loading={isLoading}
          //  onResultSelect={this.handleResultSelect}
         //   onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
         //   results={results}
        //    value={value}
          //  {...this.props}
          />
         </Menu.Item>
        <Menu.Item as={Link} to="/about" header  >
           ABOUT
          </Menu.Item>
        <Menu.Item as={Link} to="/pricing" header  >
           PRICING
          </Menu.Item>
        <Menu.Item    onClick={()=>this.props.openModal("JoinBetaModal")}>
        <Button  basic inverted content="JOIN BETA" />
          </Menu.Item>
       
            {/* {authenticated? <BankAccountMenuItem
              bankConnect={this.handleBankConnect}
            />: null}   */}
                        {authenticated&&(!join)? <NotifcationsMenuItem
             
            />: null}  
                           {authenticated&&(!join)? <MessagesMenuItem
             
             />: null}          
          {join? <JoinBetaMenu backToApp={this.backToApp}/> : authenticated ? (
            
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
