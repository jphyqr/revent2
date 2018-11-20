import React from 'react';
import { Segment, Icon, Popup, Grid } from 'semantic-ui-react';
import GoogleMapReact from 'google-map-react';
import MapMarker from './MapMarker'

const Marker = () => <Icon name="marker" size="big" color="red" />;

const JobMap = ({ lat, lng, jobs }) => {
  const center = [lat, lng];
  const zoom = 11;




  
  return (
    <Segment attached="bottom" style={{padding: 0}}>
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
            lat={job.venueLatLng.lat}
            lng={job.venueLatLng.lng}
            key={index}
            job={job}
            onChildMouseEnter={this.onChildMouseEnter}
            onChildMouseLeave= {this.onChildMouseLeave}
            
            />

           
            
          
            
          
           




            
          ))}


        </GoogleMapReact>
      </div>
    </Segment>
  );
};

export default JobMap;