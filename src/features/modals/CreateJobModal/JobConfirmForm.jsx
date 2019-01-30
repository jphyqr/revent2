import React, { Component } from 'react'
import {Button, Grid} from 'semantic-ui-react'
class JobConfirmForm extends Component {
  render() {

    const {draft} = this.props
    const {value: draftValue} = draft
    console.log({draftValue})
    const {date, description, fields, flatContractor, flatOwner, hourlyContractor, inDraft, managedBy, name, owneredBy, phases, startDate, subscribers, timesSelected, title, type, acceptsFlatOwner, acceptsFlatContractor, acceptsRateContractor, acceptsRateOwner, venue, venueLatLng, customFields, confirmStamp} = draftValue
    return (
      <div>
       <div style={{height:400, overflowY:"auto"}}>
          <Grid>
          <Grid.Row>
        <Grid.Column width={4}>{name}</Grid.Column>
        <Grid.Column width={6}>{description}</Grid.Column>
        <Grid.Column width={6}>{managedBy}</Grid.Column>
          </Grid.Row>
          <Grid.Row>
        <Grid.Column width={8}>{name}</Grid.Column>
        <Grid.Column width={8}>{description}</Grid.Column>
          </Grid.Row>

          </Grid>
       </div>
       <Button>Dispatch Job</Button>
      </div>
    )
  }
}


export default  JobConfirmForm