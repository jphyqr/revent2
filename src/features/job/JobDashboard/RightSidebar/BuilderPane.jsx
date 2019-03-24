import React, { Component } from "react";
import { Message, Button, Grid, Divider, Icon,Header,Image, Container } from "semantic-ui-react";
import Dropzone from "react-dropzone";
class BuilderPane extends Component {
  state={   files: [],
    fileName: "",
    image: {}} 

  onDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name
    });
    await this.props.uploadBuilderPhoto(
      this.props.builderProfile,
      files[0],
      
    );

    this.setState({
      files:{},
      fileName: {}
    });
  };

  render() {
    const { builderProfile } = this.props;
    const { jobsStarted, jobsCompleted, isABuilder, rating, volumeTotal, builderPhotos } =
      builderProfile || {};
    const { communication, feedback, professionalism, punctuality } =
      rating || {};

    const averageRating =
      (rating &&
        (communication + feedback + professionalism + punctuality) / 4) ||
      0;

    let volumeTotalString = "";

    if (volumeTotal < 1000) {
      volumeTotalString = `$${volumeTotal}`;
    } else if (volumeTotal < 10000) {
      volumeTotalString = `$${parseFloat(volumeTotal / 1000).toFixed(1)}K`;
    } else if (volumeTotal < 1000000) {
      volumeTotalString = `$${parseFloat(volumeTotal / 1000).toFixed(0)}K`;
    }
//DELETE ISABUILDEr
    const fakeIsABuilder=true;

    return (
      <div style={{height:300}}>
      <Grid>
        <Grid.Column width={8}>
        <Message
          style={{ width: "100%" }}
          info
          size="mini"
          attached="top"
          content="You must add a verified credit card."
        />
        <Button
          onClick={()=>this.props.openModal("PaymentModal")}
          content="+ credit card"
          icon="credit card"
          labelPosition="left"
        />
        <Divider />
        {fakeIsABuilder ? (
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
          
              <Message style={{width:"100%"}}>
                <Message.Header>Become a Builder</Message.Header>
                <Message.List>
                  <Message.Item>Add a Credit Card</Message.Item>
                  <Message.Item>Post a Job</Message.Item>
                </Message.List>
              </Message>
           
          )}
     
        <Divider />
        </Grid.Column>

        <Grid.Column width={8}>
        
        <div style={{width:"100%", padding:10, height:340, backgroundColor:"grey"}}>
        
        <Dropzone style={{width:"100%", marginLeft:"auto",  marginRight:"auto", display:"block", height:150,  borderStyle:"dotted"}} onDrop={this.onDrop} multiple={false} acceptedFiles={"image/jpeg,image/png,image/gif"}>
           <div style={{ paddingTop: "10px", textAlign: "center" }}>
             <Icon name="upload" size="huge" />
             <Header content="Drop image here or click to add" />
           </div>
         </Dropzone>
         <Divider/>
         <div style={{height:135,  width:"auto", whiteSpace: "nowrap", padding:5, backgroundColor:"lightgrey", overflowY:"hidden", overflowX:"auto"}}>
         {this.state.files[0] &&
                         <Image
                         
                         style={{  display:"inline-block",  opacity:.3, maxHeight: 115, maxWidth: 115 }}
                         src={this.state.files[0].preview}
                       />}
         {builderPhotos && builderPhotos.map(photo=>(
            <Image
            
            style={{ marginLeft:10, maxHeight: 115, display:"inline-block", maxWidth: 115 }}
            src={photo}
          />
         ))}
         </div>
        </div>
        </Grid.Column>
      </Grid>
     
        </div>
    );
  }
}

export default BuilderPane;
