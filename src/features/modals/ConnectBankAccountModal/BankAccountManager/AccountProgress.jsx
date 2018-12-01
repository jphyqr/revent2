import React, { Component } from 'react'
import {Step, Icon} from 'semantic-ui-react'



 class AccountProgress extends Component {
  render() {


const {showTOS, showBankForm, showInfo, showComplete, showCountrySelect} = this.props

    return (
        <Step.Group size='mini'>
       <Step completed={showTOS||showBankForm||showInfo||showComplete} active={showCountrySelect} disabled={!showCountrySelect}>
          <Icon name='globe' />
          <Step.Content>
            <Step.Title>Country </Step.Title>
          </Step.Content>
        </Step>
        <Step completed={showBankForm||showInfo||showComplete} active={showTOS} disabled={!showTOS}>
          <Icon name='legal' />
          <Step.Content>
            <Step.Title>Aggreement</Step.Title>
          </Step.Content>
        </Step>
        <Step  completed={showInfo||showComplete}active={showBankForm} disabled={!showBankForm}>
          <Icon name='credit card' />
          <Step.Content>
            <Step.Title>Bank Account</Step.Title>
            <Step.Description>Connect to your Bank Account</Step.Description>
          </Step.Content>
        </Step>
        <Step completed={showComplete}active={showInfo} disabled={!showInfo}>
          <Icon name='info' />
          <Step.Content>
            <Step.Title>Personal Information</Step.Title>
            <Step.Description>Information required by Stripe</Step.Description>
          </Step.Content>
        </Step>
        <Step active={showComplete} disabled={!showComplete}>
          <Icon  name='check' />
          <Step.Content>
            <Step.Title>Complete</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
    )
  }
}




export default AccountProgress
