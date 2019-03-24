import React, { Component } from 'react'
import {Message, Button,Divider, Image, Grid,Icon,Header, Checkbox} from 'semantic-ui-react'
import TextInput from '../../../../app/common/form/TextInput'
import {toastr} from 'react-redux-toastr'
import Dropzone from "react-dropzone";
 class LabourPane extends Component {
    state={profile:{},    files: [],
    fileName: "",
    cropResult: null,
    image: {}} 

    componentDidMount(){
        const {profile} = this.props
   
        this.setState({profile:profile})
    }

    componentWillReceiveProps = (nextProps) => {
        if(nextProps.profile!==this.state.profile){
          
      
            this.setState({
                profile:nextProps.profile

            })
        }
    }

    onDrop = async files => {
      console.log({ files });
      this.setState({
        files,
        fileName: files[0].name
      });
      await this.props.uploadLabourPhoto(
        this.props.profile.labourProfile,
        files[0],
        
      );

      this.setState({
        files:{},
        fileName: {}
      });
    };

 toggle = async ()  => {
    let message = ""
    if(this.state.profile.profileListed){
         message = "This will unlist your profile from the labour listings"
    }else {
        message = "This will list your profile in the labour market"
    }
  
    toastr.confirm(message, {
        onOk: async () =>{
          //  if(this.props.labour_profile===null){
            const toggledProfileListed = !this.state.profile.profileListed
           
             await   this.props.createLabourProfile(this.props.profile, toggledProfileListed)
 
          //  }
           // this.props.goBackToStep(this.state.quote, step)
         
        }
        
      });
      

}

  render() {
   // const { profile,createLabourProfile ,skillsHaveBeenUpdated} = this.props;
    const {profile} = this.state
    const {labourProfile, profileListed} = profile
    const { rating, jobsStarted, jobsCompleted, isALabourer, hasTransportation, hasToolsrating, volumeTotal, labourPhotos } =
      labourProfile || {};
    const { clean, craftsmanship, conmmunication, professionalism, punctuality } =
      rating || {};

    const averageRating =
      (rating &&
        (clean + conmmunication + craftsmanship + professionalism + punctuality) / 5) ||
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
      <div style={{height:300}}>
      <Grid>
        <Grid.Column width={8}>
        {this.state.profile.skillsHaveBeenUpdated ? <Message
          style={{ width: "100%" }}
          warning
          size="mini"
          attached="top"
          content="Skills have been updated, re-list profile"
        />: this.state.profile.profileListed ?<Message
          style={{ width: "100%" }}
          success
          size="mini"
          attached="top"
          content="Profile is listed."
        /> :<Message
          style={{ width: "100%" }}
          info
          size="mini"
          attached="top"
          content="Add skills to list service."
        /> } 
        <Button
        disabled={this.state.profile.profileListed}
          onClick={()=>this.props.openModal("LabourProfileModal")}
          content="+ skills"
          icon="home"
          labelPosition="left"
        />
<Checkbox disabled={!this.state.profile.skillsHaveBeenUpdated&&!this.state.profile.profileListed} label="List Profile" toggle  onChange={this.toggle} checked={this.state.profile.profileListed}/>

        <Divider />
        {isALabourer ? (
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
                <Message.Header>Become a Labourer</Message.Header>
                <Message.List>
                  <Message.Item>Add Skills</Message.Item>
                  <Message.Item>List Profile</Message.Item>
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
          {labourPhotos && labourPhotos.map(photo=>(
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
    )
  }
}


export default LabourPane