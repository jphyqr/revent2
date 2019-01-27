import React, { Component } from 'react'
import {Step, Icon} from 'semantic-ui-react'



 class JobProgress extends Component {
  render() {


const {showState} = this.props
const {showSchedule, showOverview, showBasic, showCustom, showContract, showConfirm} = showState
    return (
        <Step.Group size='mini'>
       {/* <Step completed={showContract||showConfirm||showBasic||showSchedule||showCustom} active={showOverview} disabled={!showOverview}>
          <Icon name='globe' />
          <Step.Content>
            <Step.Title>Overview </Step.Title>
          </Step.Content>
        </Step> */}
        <Step completed={showCustom||showSchedule||showContract||showConfirm} active={showBasic} disabled={!showBasic}>
          <Icon name='legal' />
          <Step.Content>
            <Step.Title>Basic</Step.Title>
          </Step.Content>
        </Step>
        <Step  completed={showConfirm||showSchedule||showContract}active={showCustom} disabled={!showCustom}>
          <Icon name='credit card' />
          <Step.Content>
            <Step.Title>Custom</Step.Title>
            <Step.Description>Custom</Step.Description>
          </Step.Content>
        </Step>
        <Step completed={showConfirm||showContract}active={showSchedule} disabled={!showSchedule}>
          <Icon name='info' />
          <Step.Content>
            <Step.Title>Schedule</Step.Title>
            <Step.Description>Schedule</Step.Description>
          </Step.Content>
        </Step>
        <Step completed={showConfirm} active={showContract} disabled={!showContract}>
          <Icon  name='check' />
          <Step.Content>
            <Step.Title>Contract</Step.Title>
          </Step.Content>
        </Step>
        <Step active={showConfirm} disabled={!showConfirm}>
          <Icon  name='check' />
          <Step.Content>
            <Step.Title>Confirm</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
    )
  }
}




export default JobProgress