import React, { Component } from "react";
import { Header, Icon, Divider, Card , Image, Button} from "semantic-ui-react";
import { connect } from "react-redux";
import PhotoUpload from "../../../app/common/form/PhotoUpload/PhotoUpload";
import { uploadTaskPhoto, deletePhoto, setThumbnailPhoto } from "./taskActions";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import {toastr} from 'react-redux-toastr'
const actions = {
   uploadTaskPhoto, deletePhoto, setThumbnailPhoto
};

const mapState = state => ({
  auth: state.firebase.auth,
  task: state.task,
  taskPhotos: state.firestore.ordered.taskPhotos,
  loading: state.async.loading
});

const query = ({ task }) => {
  return [
    {
      collection: "tasks",
      doc: task.key,
      subcollections: [{ collection: "taskPhotos" }],
      storeAs: "taskPhotos"
    }
  ];
};

class TaskMedia extends Component {
  state = { 
    displayURL: "", 
    showDisplayUpload: false 
  
  };
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

  handlePhotoDelete = photo => async () => {
    try {
      this.props.deletePhoto(photo, this.props.task.key);
    } catch (error) {
      toastr.error("Oops", error.message);
    }
  };
  handleSetMainPhoto = photo => async () => {
    try {
      this.props.setThumbnailPhoto(photo, this.props.task.key)
    } catch (error){
      toastr.error('Ooops', error.message)
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.displayPhotoHasUpdated) {
      console.log("displayPhoto Updated", nextProps);
      this.setState({ displayURL: nextProps.displayURL });
      this.props.handleUpdatedDisplayPhoto();
      this.setState({ showDisplayUpload: false });
    }
  };
  render() {
    const { task, taskPhotos , loading} = this.props;
    const { displayURL, showDisplayUpload, displayUploadHovered } = this.state;

    let filteredPhotos;
    if (taskPhotos) {
      filteredPhotos = taskPhotos.filter(photo => {
        return photo.url !== task.displayURL;
      });
    }


    return (
      <div>
<PhotoUpload
            type="displayImage"
            handlePhotoUploaded={this.props.handlePhotoUploaded}
            height="150"
            width="300"
          />


<Divider />
        <Header sub color="teal" content="All Photos" />


        <Card.Group itemsPerRow={5}>
          <Card>
            <Image src={task.displayURL || "/assets/white on orange logo.png"} />
            <Button positive>Thumbnail Photo</Button>
          </Card>

          {taskPhotos &&
            filteredPhotos.map(photo => (
              <Card key={photo.id}>
                <Image src={photo.url} />
                <div className="ui two buttons">
                  <Button  loading={loading} onClick={this.handleSetMainPhoto(photo)} basic color="green">
                    Thumbnail
                  </Button>
                  <Button
                    onClick={this.handlePhotoDelete(photo)}
                    basic
                    icon="trash"
                    color="red"
                  />
                </div>
              </Card>
            ))}
        </Card.Group>



       
          
      
      </div>
    );
  }
}

export default compose(
  connect(
    mapState,
    actions
  ),
  firestoreConnect(props => query(props))
)(TaskMedia);
