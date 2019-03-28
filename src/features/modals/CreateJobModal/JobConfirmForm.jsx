import React, { Component } from 'react'
import {Button, Grid, Label, Message, Icon, Checkbox} from 'semantic-ui-react'
import ExamplePhotoSlider from "../../../app/common/form/PhotoUpload/ExamplePhotoSlider";
import GoogleMapReact from 'google-map-react';
import moment from 'moment'
import format from 'date-fns/format'
import {objectToArray} from '../../../app/common/util/helpers'  
import {toastr} from 'react-redux-toastr'

class JobConfirmForm extends Component {
 
   state={
     zoom:11
   }


handlePostJob = async () =>{


  console.log('handlePostJob')

  toastr.confirm("Dispatch job to local contractors?", {
    onOk: async ()  =>
      { 
       await this.props.dispatchJob(this.props.draft.key)
        this.props.handleJobPosted()
      }
      
  });


 
     


  }



handleMapChange = (e) => {
console.log('handlkeMapChange', e)
this.setState({zoom:e.zoom})
}
  render() {

    const {draft} = this.props
    const {value: draftValue} = draft
    const Marker = () => <Icon name="bullseye"   size="big" color="red" />;
    const Marker2 = () => <Icon name="marker"   size="big" color="red" />;
    const LeftLine = () => <div style={{height:'40px', width: '2px', backgroundColor: "blue"}}/>
   
    const {city, jobPhotos, description,  subscribers, timesSelected, title,   venueLatLng, customFields} = draftValue
    const {lat, lng} = venueLatLng
    const customFieldsArray = objectToArray(customFields)
    const subscriberArray = objectToArray(subscribers)

    const center = [lat, lng];

    const randomLat = Math.random()*((lat+0.002)-(lat-0.002))+(lat-0.002)

    const randomLng = Math.random()*((lng+0.002)-(lng-0.002))+(lng-0.002)


    return (
      <div>
       <div style={{height:400, overflowY:"auto", overflowX:"hidden", width:'auto', margin:20}}>
          <Grid>
          <Grid.Row>
        <Grid.Column style={{fontSize:'18px'}}>Title: {title}</Grid.Column>
      
          </Grid.Row>
          <Grid.Row>
      
        <Grid.Column style={{fontSize:'14px'}}>{description}</Grid.Column>
      
          </Grid.Row>
          <Grid.Row>
        <Grid.Column width={8}>{format(moment(Date.now()).toDate(), "dddd, MMMM, Do")}</Grid.Column>
        <Grid.Column width={8}>{city}</Grid.Column>
          </Grid.Row>
<Grid.Row>
<div style={{ position:'relative', height: '200px', width: '200px',  }}>
{this.state.zoom >14 ?null:<Label   style={{zIndex:'5', position:'absolute', top:'30%', left:'20%',opacity:'0.6'}}basic color='red' >Location is not exact</Label>  }
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBeJlBUVhFnJrXS5flaYydbj5AmbuGCNBQ' }}
          defaultCenter={center}
          defaultZoom={this.state.zoom}
          onChange={(e)=>this.handleMapChange(e)}
          
        >
       
        {this.state.zoom >14 ? null:  <Marker lat={randomLat} lng={randomLng} />} 
        </GoogleMapReact>
      </div>
</Grid.Row>

<Grid.Row>
      
      <Grid.Column style={{fontSize:'16px'}}>Job Details</Grid.Column>
    
        </Grid.Row>
        <Grid.Row>

          
        </Grid.Row>
        {customFieldsArray&&customFieldsArray.map(field=>(
         <Grid.Row>
      
         <Grid.Column style={{fontSize:'14px'}}>{field.id} : {field}</Grid.Column>
       
           </Grid.Row> 
        ))}


<Grid.Row >
              {jobPhotos && (
                <ExamplePhotoSlider
                  photos={jobPhotos}
                  label="Job Photos"
                />
              )}
            </Grid.Row>
            <Grid.Column style={{fontSize:'16px'}}>Appointment Times</Grid.Column>
            <Grid.Row >
              {timesSelected && timesSelected.map((day, dayIndex)=>(

                day.timeSlots.map((hour, hourIndex)=>(
                  hour.selected&&<Label>{format(moment(day.timeStamp).toDate(), "ddd MMM Do")} {hour.label}</Label>
                ))
              )
                
              )}
            </Grid.Row>
            <Grid.Row>

        </Grid.Row>
            <Grid.Row>
            <div
        class="list"
        style={{
          height: 160,
          marginBottom: 1,
          width: "100vw",
        // backgroundColor: "grey",
          paddingTop: 0,
          //   paddingLeft: this.props.childIsExpanding&&!this.props.showExpanded ? 0 : 30,
          transition: "0.15s all ease",
         // overflow: "scroll",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
          top:"10",
          verticalAlign: "middle",
        }}
      >


      </div>
            </Grid.Row>

          </Grid>



       </div>
      <Button>Back</Button> <Button onClick={()=>this.handlePostJob()}>Dispatch Job</Button>
      </div>
    )
  }
}


export default  JobConfirmForm