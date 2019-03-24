import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react';
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker'



 class JobMap extends Component {
  
  render() {
    const { lat, lng, jobs } = this.props

    const center = [lat, lng];
    const zoom = 11;
    return (
    //  <Segment attached="bottom" style={{padding:0, marginTop: 0}}>
      <div style={{ height: '500px', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyBeJlBUVhFnJrXS5flaYydbj5AmbuGCNBQ' }}
          defaultCenter={center}
          defaultZoom={zoom}
          onChildMouseEnter = {this.onChildMouseEnter}
          onChildMouseLeave=  {this.onChildMouseLeave}
        >
          
          {jobs&&jobs.map((job, index)=>(
            
            <MapMarker 
            hoveredJobId={this.props.hoveredJobId}
            handleMapItemClick = {this.props.handleMapItemClick}
            lat={job&&job.venueLatLng&&job.venueLatLng.lat}
            lng={job&&job.venueLatLng&&job.venueLatLng.lng}
            key={index}
            job={job}
            onChildMouseEnter={this.onChildMouseEnter}
            onChildMouseLeave= {this.onChildMouseLeave}
            
            />

           
            
          
            
          
           




            
          ))}


        </GoogleMapReact>
      </div>
 //   </Segment>
    )
  }
}


export default JobMap;