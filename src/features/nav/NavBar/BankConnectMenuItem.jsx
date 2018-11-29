import React from 'react'
import { Menu, Button , Label} from 'semantic-ui-react'

const BankConnectMenuItem = ({bankConnect}) => {
  return (
    <Menu.Item position="right">
    <Button circular icon='users' onClick={bankConnect} size="mini"  />
    <Label basic pointing="left" color="blue">
      Receive Payments
    </Label>
  </Menu.Item>
  )
}

export default BankConnectMenuItem