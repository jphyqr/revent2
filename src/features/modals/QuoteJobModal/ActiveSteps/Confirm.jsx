import React, { Component } from "react";
import { Button ,Divider, Header} from "semantic-ui-react";
import PhotoUpload from '../../../../app/common/form/PhotoUpload/PhotoUpload'
class Confirm extends Component {
  state = { previewVideo: false, quoteVideoUrl: "" };
  render() {
    const { contractorIntroVideo, submitted } = this.props;
    const { preview } = this.state;
    const { videoUrl } = contractorIntroVideo || {};
    return (
      <div>
        {videoUrl && (
          <div >
           <Button.Group fluid><Button  primary>
              Include Intro Video
            </Button>
            <Button
              
              
              onClick={() => this.setState({ preview: true })}
            >
              Preview
            </Button></Button.Group>
            {preview && (
              <video
                controls
                style={{ maxHeight: 300, maxWidth: 300, padding: 0, margin: 0 }}
                // autoPlay
                id="contractorVideo"
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            )}
            <Divider>Or</Divider>
           
          </div>
        )}
 <Header>Upload Custom Video</Header>

 <PhotoUpload videoOnly handlePhotoUploaded={this.props.handleVideoUpload}></PhotoUpload>

        {submitted ? (
          "Quote Submitted!"
        ) : (
          <Button onClick={() => this.props.handleSubmitQuote()}>
            Submit Quote!
          </Button>
        )}
      </div>
    );
  }
}

export default Confirm;
