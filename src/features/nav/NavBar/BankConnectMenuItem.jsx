import React, { Component } from 'react'
import { Menu, Button , Label} from 'semantic-ui-react'
import _ from 'lodash'
import {connect} from 'react-redux'



const mapState = state => {

  return {
    loading: state.async.loading
  }
}

 class BankConnectMenuItem extends Component {


  render() {

    const {currentConnectedAccount, bankConnect, loading} = this.props

    return (
      <Menu.Item position="right">
      <Button loading={loading} circular icon='stripe' onClick={bankConnect} size="mini"  />
      {!_.isEmpty(currentConnectedAccount) ? <Label basic pointing="left" color="blue">Stripe Needs Info</Label>: <Label basic pointing="left" color="blue">Add connected account</Label>}
  
    </Menu.Item>
    )
  }
}




export default connect(mapState, null)(BankConnectMenuItem)