import React, { Component } from 'react'
import {Button, Grid, Segment} from 'semantic-ui-react'

import OwnerProfile from './OwnerProfile'
import OpenJobSummary from './OpenJobSummary'




 class OpenJobExpanded extends Component {
  render() {
      const {selectedJob} = this.props
      const {ownerUid, title, venueLatLng,  customFields, date, acceptsHourlyOwner} = selectedJob
    return (
        <Segment attached="bottom" style={{paddingBottom: '0px'}}>
        <div style={{ color:'black', height: '500px', width: '100%' }}>
        <Grid>
        <Grid.Column width={4}> 
        <OwnerProfile ownerUid={ownerUid}/> 
        <Button primary fluid onClick={()=>console.log('quote now')}>Quote Now</Button>
        </Grid.Column>
        <Grid.Column width={10}> <OpenJobSummary selectedJob={selectedJob}/> </Grid.Column>
        <Grid.Column width={2}>  <Button  onClick={()=>this.props.handleHideMap()}>Show Map</Button> </Grid.Column>
        </Grid>
     </div>
     </Segment>
    )
  }
}
export default OpenJobExpanded
