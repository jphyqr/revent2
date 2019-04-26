import React from 'react';
import { Grid, Menu, Header } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom'

const SettingsNav = ({compactDisplayMode}) => {
  return (
    <Grid.Column width={4}>
      <Menu fluid={compactDisplayMode} vertical={!compactDisplayMode}>
       {!compactDisplayMode&&<Header icon="user" style={{width:"100%"}} attached inverted color="grey" content="Profile" />}
        <Menu.Item as={NavLink} to='/settings/basic'>Basics</Menu.Item>
        <Menu.Item as={NavLink} to='/settings/about'>About Me</Menu.Item>
        <Menu.Item as={NavLink} to='/settings/photos'>My Photos</Menu.Item>
        {compactDisplayMode&&<Menu.Item as={NavLink} to='/settings/account'>My Account</Menu.Item>}
      </Menu>
      <Grid.Row />
     {!compactDisplayMode&& <Menu>
        <Header
          icon="settings"
          attached
          inverted
          color="grey"
          content="Account"
        />
        <Menu.Item as={NavLink} to='/settings/account'>My Account</Menu.Item>
      </Menu>}
    </Grid.Column>
  );
};

export default SettingsNav;
