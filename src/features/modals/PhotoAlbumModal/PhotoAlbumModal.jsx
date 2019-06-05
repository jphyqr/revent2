import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { clearAlbum } from "../../../app/common/form/PhotoUpload/photoActions";
import { connect } from "react-redux";
import {Button, Dimmer, Loader} from 'semantic-ui-react'
import {isLoaded, isEmpty} from 'react-redux-firebase'

const actions = {
  closeModal,
  clearAlbum
};

const mapState = state => {
  return {
    album: state.album,
    loading: state.async.loading
  };
};

class VideoModal extends Component {

    state={showIndex:0}



   
  componentDidMount(){
    const {  album,} = this.props || {};
    const { startIndex } = album || {};
      this.setState({showIndex:startIndex})
  }
  handleClose = async () => {
    this.props.closeModal();
    this.props.clearAlbum();
  };

  render() {
    const { closeModal, album,loading } = this.props || {};
    const { startIndex } = album || {};
    const { photos } = album || [];

   if(!isLoaded(album)) return (
        <Dimmer active inverted>
          <Loader content="Loading Album" />
   </Dimmer> ) 

    return (

      <Modal
        size="fullscreen"
        style={{ padding: 0, margin: 0,  }}
      
        open={true}
        onClose={this.handleClose}
      >
    
          <div
            style={{
              
              width: "auto",
              height: "auto",
              position: "relative",
            }}
          >

<Button 
              onClick={()=>this.handleClose()}
              style={{
                position: 'absolute',
                top: -(window.innerHeight/3),
                right: '0%' ,
                zIndex:10, 
              }}
              >X</Button>
              <Button 
              onClick={()=>this.setState({showIndex:(this.state.showIndex+1)%photos.length})}
              style={{
                position: 'absolute',
                top: (window.innerHeight/3),
                right: '0%' ,
                zIndex:10, 
              }}
              >next</Button>
                           
                            <Button 
               onClick={()=>this.setState({showIndex:(this.state.showIndex-1+photos.length)%photos.length})}
              style={{
                  zIndex:10,
                position: 'absolute',
                top: (window.innerHeight/3),
                left: '0%'  
              }}
              >prev</Button>
            <img
              style={{
          //      display: "block",
                margin:0,
                position: 'absolute',
                // marginRight: "auto",
                // marginLeft: "auto",
                top: '50%',
                left: '50%',
                transform: "translate(-50%, -50%)",
           //    transform: this.state.hovered ? "scaleY(1.5)" : this.props.scrollRightClicked ? "translateX(-500%)" : "scaleY(1)" ,
               
                maxWidth: window.innerWidth - 20,
                maxHeight: window.innerHeight - 20
              }}
              src={photos[this.state.showIndex].originalURL}
              alt="logo"
            />
          </div>
      
      </Modal>
    );
  }
}

export default connect(
  mapState,
  actions
)(VideoModal);
