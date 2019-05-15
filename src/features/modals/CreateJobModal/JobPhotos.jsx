import React, { Component } from "react";
import ExamplePhotoSlider from "../../../app/common/form/PhotoUpload/ExamplePhotoSlider";
import { Form, Header, Grid, Image, Label, Button , Message} from "semantic-ui-react";
import PhotoUpload from "../../../app/common/form/PhotoUpload/PhotoUpload";
class JobPhotos extends Component {
  state = {
    showUploadPhoto: false
  };
  render() {
    const { showUploadPhoto } = this.state;
    const { draft } = this.props;
    const {value: draftValue} = draft
    const { fields } = draftValue;

    let examplePhotosCombined = [];
    if (fields && fields.length > 0) {
      for (var i = 0; i < fields.length; i++) {
        const examplePhotos = fields[i].examplePhotos;
        if (examplePhotos && examplePhotos.length > 0) {
          for (var j = 0; j < examplePhotos.length; j++) {
            examplePhotosCombined.push(examplePhotos[j]);
          }
        }
      }
    }

    return (
      <div>

        {examplePhotosCombined&&examplePhotosCombined.length>0 ?
        
        
        <Grid>
        <Grid.Row>
          <Grid.Column width={3}><Header>Photos Requested</Header></Grid.Column>
          <Grid.Column width={13}>
            {examplePhotosCombined && (
              <ExamplePhotoSlider
                photos={examplePhotosCombined}
                label="Recommended"
              />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      : 
        
        <Message info>No job photos are required.  Upload photos if necessary</Message>
        
        
        
        }

        {showUploadPhoto ? (
        <div> <Button  onClick={() => this.setState({ showUploadPhoto: false })}>Cancel Upload</Button>
          <PhotoUpload
            type="jobPhoto"
            handlePhotoUploaded={this.props.handlePhotoUploaded}
          /></div>
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column width={3}>
              <Header>Photos Uploaded </Header>  
                <Button
                  onClick={() => this.setState({ showUploadPhoto: true })}
                >
                  Upload Photo
                </Button>
              </Grid.Column>
              <Grid.Column width={13}>
                {draftValue.jobPhotos  && (
                  <ExamplePhotoSlider
                    photos={draftValue.jobPhotos}
                    label="My Job"
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}

        <Button primary floated="right" style = {{marginTop:150, marginBottom:5}} onClick={()=>this.props.updateJobPhotosPage(draft)}>Next</Button>
      </div>
    );
  }
}

export default JobPhotos;
