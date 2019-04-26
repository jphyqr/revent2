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
    const { message, closeMessage, width } = this.props;
    return (
      <Grid  style={{ padding:0, margin:0, width:width}} >
        <Grid.Row  style={{padding:5}} color="blue">
          <Grid.Column  style={{padding:5}} width={14}>{message.displayName}</Grid.Column>
          <Grid.Column  style={{padding:5}} width={2}>
          <Icon  onClick={()=>closeMessage(message)}size='medium' name='close'/>
          </Grid.Column>
        
        </Grid.Row>
      </Grid>
    );
  }
}

export default PopupNavBar;
