import React from 'react'
import { Menu, Button } from 'semantic-ui-react'
import {  Link } from "react-router-dom";
const JoinBetaMenu = ({backToApp}) => {
  return (
    <Menu.Item position="right" as={Link} to="/build">
    <Button onClick={backToApp} basic inverted content="Back to App" />

  </Menu.Item>
  )
}

export default JoinBetaMenu
