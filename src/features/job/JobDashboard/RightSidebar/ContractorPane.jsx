import React, { Component } from "react";
import {
  Message,
  Divider,
  Grid,
  Button,
  Icon,
  Header,
  Image
} from "semantic-ui-react";
import Dropzone from "react-dropzone";
import PhotoUpload from "../../../../app/common/form/PhotoUpload/PhotoUpload"
class ContractorPane extends Component {
  state = { files: [], fileName: "", image: {} };

  onDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name
    });
    await this.props.uploadContractorPhoto(
      this.props.contractorProfile,
      files[0]
    );

    this.setState({
      files: {},
      fileName: {}
    });
  };

  render() {
    const { contractorProfile, compactDisplayMode } = this.props;
    const {
      jobsStarted,
      jobsCompleted,
      isAContractor,
      rating,
      volumeTotal,
      contractorPhotos, videoUrl
    } = contractorProfile || {};
    const { clean, craftsmanship, professionalism, punctuality } = rating || {};
const videoOnly = true;
    const averageRating =
      (rating && (clean + craftsmanship + professionalism + punctuality) / 4) ||
      0;

    let volumeTotalString = "";

    if (volumeTotal < 1000) {
      volumeTotalString = `$${volumeTotal}`;
    } else if (volumeTotal < 10000) {
      volumeTotalString = `$${parseFloat(volumeTotal / 1000).toFixed(1)}K`;
    } else if (volumeTotal < 1000000) {
      volumeTotalString = `$${parseFloat(volumeTotal / 1000).toFixed(0)}K`;
    }

    return (
      <div style={{ padding: "20px" }}>
        {compactDisplayMode ? (
          <div>
            <Grid>
              <Grid.Row>
                <Message
                  style={{ width: "100%" }}
                  info
                  size="mini"
                  attached="top"
                  content="You must add a connected account."
                />
              </Grid.Row>
              <Grid.Row>
                <Button
                  onClick={() =>
                    this.props.openModal("ConnectBankAccountModal")
                  }
                  content="+ bank account"
                  disabled
                  icon="stripe card"
                  labelPosition="left"
                />
              </Grid.Row>
            </Grid>
            <Divider />
            {isAContractor ? (
              <Grid>
                <Grid.Row>
                  <Grid.Column width={3}>Rating</Grid.Column>
                  <Grid.Column width={3}>Volume</Grid.Column>
                  <Grid.Column width={3}>Jobs Started</Grid.Column>
                  <Grid.Column width={6}>Jobs Completed</Grid.Column>
                </Grid.Row>

                <Grid.Row
                  style={{ textAlign: "center", paddingTop: 0, marginTop: 0 }}
                >
                  <Grid.Column width={3}>{averageRating}</Grid.Column>
                  <Grid.Column width={3}>{volumeTotalString}</Grid.Column>
                  <Grid.Column width={3}>{jobsStarted}</Grid.Column>
                  <Grid.Column width={6}>{jobsCompleted}</Grid.Column>
                </Grid.Row>
              </Grid>
            ) : (
              <Message style={{ width: "100%" }}>
                <Message.Header>Become a Contractor</Message.Header>
                <Message.List>
                  <Message.Item>Add a Bank Account</Message.Item>
                  <Message.Item>Subscribe and Quote Jobs</Message.Item>
                </Message.List>
              </Message>
            )}
            <Divider />
            <Grid.Row>
              <div style={{ width: "100%", height: "auto" }}>
                <Dropzone
                  style={{
                    width: "50%",
                    marginTop: 10,
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderRadius: "20px",
                    display: "block",
                    height: 30,
                    backgroundColor: "orange"
                  }}
                  onDrop={this.onDrop}
                  multiple={false}
                  acceptedFiles={"image/jpeg,image/png,image/gif"}
                >
                  <div style={{ textAlign: "center" }}>
                    <Header style={{ paddingTop: 4 }} content="+Add Photo" />
                  </div>
                </Dropzone>

                <Divider />

               
                <div
                  style={{
                    height: 130,
                    width: "auto",
                    whiteSpace: "nowrap",
                    padding: 5,
                    backgroundColor: "grey",
                    overflowY: "hidden",
                    overflowX: "auto"
                  }}
                >
                  {this.state.files[0] && (
                    <Image
                      style={{
                        display: "inline-block",
                        opacity: 0.3,
                        maxHeight: 115,
                        maxWidth: 115
                      }}
                      src={this.state.files[0].preview}
                    />
                  )}
                  {contractorPhotos &&
                    contractorPhotos.map(photo => (
                      <Image
                        style={{
                          marginLeft: 10,
                          height: 115,
                          display: "inline-block"
                        }}
                        src={photo}
                      />
                    ))}
                </div>
                <PhotoUpload handlePhotoUploaded={this.props.handleVideoUpload} videoOnly={videoOnly}/>
             
              {videoUrl&&  
              
              <div>
                 <Divider />
                <Header color="teal" as="h3">Introduction Video</Header>
                <video controls
            style={{maxHeight:200, maxWidth:200, padding:0, margin:0}}
            // autoPlay
             id="contractorVideo"
            
             
           >
             <source src={videoUrl} type="video/mp4" />
           </video>
           </div>
           }
              </div>
            </Grid.Row>






          </div>
        ) : (
          <Grid>
            <Grid.Column width={8}>
              <Message
                style={{ width: "100%" }}
                info
                size="mini"
                attached="top"
                content="You must add a connected account."
              />
              <Button
                onClick={() => this.props.openModal("ConnectBankAccountModal")}
                content="+ bank account"
                icon="stripe card"
                labelPosition="left"
              />
              <Divider />

              {isAContractor ? (
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>Rating</Grid.Column>
                    <Grid.Column width={3}>Volume</Grid.Column>
                    <Grid.Column width={3}>Jobs Started</Grid.Column>
                    <Grid.Column width={6}>Jobs Completed</Grid.Column>
                  </Grid.Row>

                  <Grid.Row
                    style={{ textAlign: "center", paddingTop: 0, marginTop: 0 }}
                  >
                    <Grid.Column width={3}>{averageRating}</Grid.Column>
                    <Grid.Column width={3}>{volumeTotalString}</Grid.Column>
                    <Grid.Column width={3}>{jobsStarted}</Grid.Column>
                    <Grid.Column width={6}>{jobsCompleted}</Grid.Column>
                  </Grid.Row>
                </Grid>
              ) : (
                <Message style={{ width: "100%" }}>
                  <Message.Header>Become a Contractor</Message.Header>
                  <Message.List>
                    <Message.Item>Add a Bank Account</Message.Item>
                    <Message.Item>Subscribe and Quote Jobs</Message.Item>
                  </Message.List>
                </Message>
              )}

              <Divider />
            </Grid.Column>
            <Grid.Column width={8}>
              <div
                style={{
                  width: "100%",
                  padding: 10,
                  height: 340,
                  backgroundColor: "grey"
                }}
              >
                <Dropzone
                  style={{
                    width: "100%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block",
                    height: 150,
                    borderStyle: "dotted"
                  }}
                  onDrop={this.onDrop}
                  multiple={false}
                  acceptedFiles={"image/jpeg,image/png,image/gif"}
                >
                  <div style={{ paddingTop: "10px", textAlign: "center" }}>
                    <Icon name="upload" size="huge" />
                    <Header content="Drop image here or click to add" />
                  </div>
                </Dropzone>
                <Divider />
               
                <div
                  style={{
                    height: 135,
                    width: "auto",
                    whiteSpace: "nowrap",
                    padding: 5,
                    backgroundColor: "lightgrey",
                    overflowY: "hidden",
                    overflowX: "auto"
                  }}
                >
                  {this.state.files[0] && (
                    <Image
                      style={{
                        display: "inline-block",
                        opacity: 0.3,
                        maxHeight: 115,
                        maxWidth: 115
                      }}
                      src={this.state.files[0].preview}
                    />
                  )}
                  {contractorPhotos &&
                    contractorPhotos.map(photo => (
                      <Image
                        style={{
                          marginLeft: 10,
                          maxHeight: 115,
                          display: "inline-block",
                          maxWidth: 115
                        }}
                        src={photo}
                      />
                    ))}
                </div>
                <PhotoUpload handlePhotoUploaded={this.props.handleVideoUpload} videoOnly={videoOnly}/>
              
                {videoUrl&&  
              
              <div>
                 <Divider />
                <Header color="teal" as="h3">Introduction Video</Header>
                <video controls
            style={{maxHeight:200, maxWidth:200, padding:0, margin:0}}
            // autoPlay
             id="contractorVideo"
            
             
           >
             <source src={videoUrl} type="video/mp4" />
           </video>
           </div>
           }

              </div>
            </Grid.Column>
          </Grid>
        )}
      </div>
    );
  }
}

export default ContractorPane;
