import React, { Component } from 'react'
import { Menu, Image, Segment, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import {initializePush} from '../../../app/common/util/helpers'
import {storeDeviceToken} from '../../../features/user/userActions'
import firebase from "../../../app/config/firebase";
import { openModal } from "../../modals/modalActions";
import {connect} from 'react-redux'
import {toastr} from 'react-redux-toastr'
import {clearTask} from '../../../features/modals/TaskModal/taskActions'

const actions = {
  storeDeviceToken, openModal, clearTask
}


const messaging = firebase.messaging();
messaging.onMessage(payload => {
  const {notification} = payload
  //could show toast, etc
    console.log('onMessageSignedIn: ', payload)
    toastr.success(notification.title, notification.body);
})



 class SignedInMenu extends Component {


handleCreateCategory = () =>{
  this.props.openModal("CategoryModal")
}

handleNewField = () =>{
  this.props.openModal("NewFieldModal")
}

handleNewTask = async () =>{
  await this.props.clearTask()
  this.props.openModal("TaskModal")
}


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
        <Dropdown.Item onClick={this.handleCreateCategory} text="New Category" icon="plus" />
        <Dropdown.Item onClick={this.handleNewTask} text="New Task" icon="plus" />
        <Dropdown.Item onClick={this.handleNewField} text="New Field" icon="plus" />

        <Dropdown.Item as={Link} to='/settings' text="Settings" icon="settings" />
        <Dropdown.Item onClick={signOut} text="Sign Out" icon="power" />

      </Dropdown.Menu>
    </Dropdown>
  </Menu.Item>
    )
  }
}


  



export default connect(null, actions)(SignedInMenu);
