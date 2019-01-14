import React, { Component } from "react";
import { Header, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import PhotoUpload from "../../../app/common/form/PhotoUpload/PhotoUpload";
import { updateTaskPhoto } from "./taskActions";
const actions = {
  updateTaskPhoto
};
class TaskMedia extends Component {
  state = { displayURL: "", showDisplayUpload: false };
  // handlePhotoUploaded = async (url) =>{
  //     console.log('photo uploaded url', url)
  //     let displayURL = await this.props.updateTaskPhoto(this.props.task.key, url);
  //     this.setState({displayURL: displayURL})
  //     this.forceUpdate()
  //   }

  componentDidMount() {
    this.setState({
      displayURL: this.props.displayURL
    });
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.displayPhotoHasUpdated) {
      console.log("displayPhoto Updated", nextProps);
      this.setState({ displayURL: nextProps.displayURL });
      this.props.handleUpdatedDisplayPhoto();
      this.setState({showDisplayUpload:false})
    }
  };
  render() {
    const { task } = this.props;
    const { displayURL, showDisplayUpload, displayUploadHovered } = this.state;

    return (
      <div>
        <Header sub color="teal" content="Thumbnail Display Photo (150x300)" />
        <div
          onMouseEnter={() => this.setState({ displayUploadHovered: true })}
          onMouseLeave={() => this.setState({ displayUploadHovered: false })}
          onClick={() => this.setState({ showDisplayUpload: true })}
          style={{ width: 300, height: 150, backgroundColor: "black", position:'relative' }}
         
        >
          <img
            style={{
                opacity: displayUploadHovered ? 1 : 0.6,
              height: 150, //this.state.hovered ? 200 : 150,
              width: 300 //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
            }}
            src={displayURL}
          />

          <div
            style={{
              //     backgroundColor: "black",
              color: "white",
              fontSize: 18,
              position: "absolute",
              bottom: 50,
              textAlign: "center",
              width: "100%",

              opacity: displayUploadHovered ? 0.8 : 0,
              height: "auto"
            }}
          >
            <Icon color="white" size="huge" name="arrow down" />
          </div>
        </div>
        {showDisplayUpload && (
          <PhotoUpload
            type="displayImage"
            handlePhotoUploaded={this.props.handlePhotoUploaded}
            height="150"
            width="300"
          />
        )}
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(TaskMedia);
