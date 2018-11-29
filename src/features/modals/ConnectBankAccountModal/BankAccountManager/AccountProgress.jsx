import React, { Component } from 'react'
import {Step, Icon} from 'semantic-ui-react'



 class AccountProgress extends Component {
  render() {


const {showTOS, showBankForm, showInfo, showComplete} = this.props

    return (
        <Step.Group size='mini'>
        <Step completed={showBankForm||showInfo||showComplete} active={showTOS} disabled={!showTOS}>
          <Icon name='legal' />
          <Step.Content>
            <Step.Title>Terms of Service</Step.Title>
            <Step.Description>Accept Stripe and Revents TOS</Step.Description>
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
            <Step.Title>Entity Information</Step.Title>
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
