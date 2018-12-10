//NEW MESSAGE

import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Segment,
  Header,
  Button,
  Container,
  Grid,
  Label,
  Icon,
  Menu
} from "semantic-ui-react";
class PopupNavBar extends Component {
  render() {
    const { message, closeMessage } = this.props;
    return (
      <Grid  container padding={false}>
        <Grid.Row  color="blue">
          <Grid.Column width={14}>{message.displayName}</Grid.Column>
         <Icon  onClick={()=>closeMessage(message)}size='medium' name='close'/>
        </Grid.Row>
      </Grid>
    );
  }
}

export default PopupNavBar;
