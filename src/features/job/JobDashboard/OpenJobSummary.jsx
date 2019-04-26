import React, { Component } from 'react'
import {Grid, Icon, Label, Button} from 'semantic-ui-react'
import GoogleMapReact from 'google-map-react';
import ExamplePhotoSlider from "../../../app/common/form/PhotoUpload/ExamplePhotoSlider";
import {objectToArray} from '../../../app/common/util/helpers'  
import moment from 'moment'
import format from 'date-fns/format'
 class OpenJobSummary extends Component {

    state={
        zoom:11
      }

      handleMapChange = (e) => {
        console.log('handlkeMapChange', e)
        this.setState({zoom:e.zoom})
        }
        
        
  render() {
      const {selectedJob, compactDisplayMode} = this.props
      const {city, jobPhotos, description,  subscribers, timesSelected, title,   venueLatLng, customFields} = selectedJob
      const {lat, lng} = venueLatLng
      const customFieldsArray = objectToArray(customFields)
      const subscriberArray = objectToArray(subscribers)
      const center = [lat, lng];
      const randomLat = Math.random()*((lat+0.002)-(lat-0.002))+(lat-0.002)
      
          const randomLng = Math.random()*((lng+0.002)-(lng-0.002))+(lng-0.002)
      const Marker = () => <Icon name="bullseye"   size="big" color="red" />;
    return (
        <div >
        <div style={{paddingTop:compactDisplayMode?0:"10px", paddingLeft:compactDisplayMode?0:"10px", background:"lightgrey", maxHeight:compactDisplayMode? 240:465, overflowY:compactDisplayMode?"none":"auto", overflowX: compactDisplayMode?"none":"hidden", width:'100%'}}>
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
 <div style={{  position:'relative', height: compactDisplayMode? 150:200, width: '200px', paddingLeft:"10px"  }}>
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
 
 <Grid.Row style={{fontSize:'16px', paddingLeft:"10px"}}>Job Photos</Grid.Row>
 <Grid.Row style={{paddingLeft:"10px"}} >
               {jobPhotos && (
                 <ExamplePhotoSlider
                   photos={jobPhotos}
                   label="Job Photos"
                 />
               )}
             </Grid.Row>
 
 
           </Grid>
 
 
 
        </div>

       </div>
    )
  }
}


export default OpenJobSummary