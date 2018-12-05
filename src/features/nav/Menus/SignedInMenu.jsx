import React, { Component } from 'react'
import { Menu, Image, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import {initializePush} from '../../../app/common/util/helpers'
import {storeDeviceToken} from '../../../features/user/userActions'
import firebase from "../../../app/config/firebase";
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
const actions = {
  storeDeviceToken
}


const messaging = firebase.messaging();
messaging.onMessage(payload => {
  const {notification} = payload
  //could show toast, etc
    console.log('onMessageSignedIn: ', payload)
    toastr.success(notification.title, notification.body);
})



 class SignedInMenu extends Component {

componentDidMount(){
  console.log('cdp auth')
  this.props.storeDeviceToken()
}

  render() {

    const {signOut, profile, auth} = this.props
    return (
     
    <Menu.Item position="right">
     
     
   
    <Image avatar  size="mini" spaced="right" src={profile.photoURL || "/assets/user.png"} />
    <Dropdown pointing="top left" text={profile.displayName}>
      <Dropdown.Menu>
        <Dropdown.Item text="Create Event" icon="plus" />
        <Dropdown.Item text="My Events" icon="calendar" />
        <Dropdown.Item text="My Network" icon="users" />
        <Dropdown.Item as ={Link} to={`/profile/${auth.uid}`}text="My Profile" icon="user" />
        <Dropdown.Item as={Link} to='/settings' text="Settings" icon="settings" />
        <Dropdown.Item onClick={signOut} text="Sign Out" icon="power" />
      </Dropdown.Menu>
    </Dropdown>
  </Menu.Item>
    )
  }
}


  



export default connect(null, actions)(SignedInMenu);
