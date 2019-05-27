import React, { Component } from "react";
import ExamplePhotoSlider from "../../../app/common/form/PhotoUpload/ExamplePhotoSlider";
import {
  Form,
  Header,
  Grid,
  Image,
  Label,
  Button,
  Message
} from "semantic-ui-react";
import PhotoUpload from "../../../app/common/form/PhotoUpload/PhotoUpload";
class JobPhotos extends Component {
  state = {
    showUploadPhoto: false
  };
  render() {
    const { showUploadPhoto } = this.state;
    const { draft } = this.props;
    const { value: draftValue } = draft;
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
      <div style={{ margin: 10 }}>
        {examplePhotosCombined && examplePhotosCombined.length > 0 ? (
          <div>
            <Header style={{ width: "100%", textAlign: "center" }}>
              Photos Requested
            </Header>

            {examplePhotosCombined && (
              <ExamplePhotoSlider
                photos={examplePhotosCombined}
                label="Recommended"
              />
            )}
          </div>
        ) : (
          <Message info>
            No job photos are required. Upload photos if necessary
          </Message>
        )}

        <div style={{ padding: 10 }}>
          <Grid>
            <Grid.Column width={8}>
              <PhotoUpload
                type="jobPhoto"
                handlePhotoUploaded={this.props.handlePhotoUploaded}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Button
                primary
                floated="right"
                style={{ marginBottom: 5 }}
                onClick={() => this.props.updateJobPhotosPage(draft)}
              >
                Next
              </Button>
            </Grid.Column>
          </Grid>
        </div>

        <div>
          <Header style={{ width: "100%", textAlign: "center" }}>
            {" "}
            Photos Uploaded{" "}
          </Header>

          {draftValue.jobPhotos && (
            <ExamplePhotoSlider photos={draftValue.jobPhotos} label="My Job" />
          )}
        </div>
      </div>
    );
  }
}

export default JobPhotos;
