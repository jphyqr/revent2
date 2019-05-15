import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react';
import { closeModal } from '../modalActions'
import { connect } from 'react-redux'

const actions = {
  closeModal, 
}

const mapState = state => {
    return{
        video: state.video
    }
}


 class VideoModal extends Component {
   
  render() {
    const {closeModal, video} = this.props || {}
    const {videoId} = video || {}
    return (

        
        <Modal size='fullscreen' style={{padding:0, margin:0,}}  closeIcon open={true} onClose={closeModal}>
        
        
            <Modal.Description style={{padding:0, margin:0}}>
                <div style={{ width:"100%"}}>
            <video controls
             style={{width:"100%", padding:0, margin:0}}
              autoPlay
              //preload={photoURL}
              id="myVideo"
             
              
            >
              <source src={videoId} type="video/mp4" />
            </video>
            </div>
            </Modal.Description>
      
        </Modal>
      );
  }
}



export default connect(mapState, actions)(VideoModal);
