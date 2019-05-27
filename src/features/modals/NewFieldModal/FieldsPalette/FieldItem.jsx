import React, { Component } from "react";
import { withFirestore } from "react-redux-firebase";
import { Icon } from "semantic-ui-react";
import {Grid, Button} from 'semantic-ui-react'
class FieldItem extends Component {
  render() {
    const { field } = this.props ||{};
    const {id} = field|| {}
    return (
      <div
      draggable
      onDragStart ={e=>this.props.onDragStart(e, field)}
        class="container"
       
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          display: "inline-block",
          background: "white",
          marginRight: "15px",
          marginBottom: "15px",
          borderRadius: "5%",
          height: "auto",
          width: "100%",
          textAlign:'center',
          position: 'relative',
          display:"inline-block"
        }}
      >
      

     <Grid>
        <Grid.Column width={3}>
          <Button onClick={() => this.props.handleDeleteField(id)}>X</Button>
        </Grid.Column>
        <Grid.Column width={13}>

        <div
        onClick={()=>this.props.handleSelectField(field)}
          style={{ 
            textAlign: "center",
         
            height: "auto",


            textOverflow: "ellipsis",
            whiteSpace:  "normal",
            overflow: "hidden",
            
            width: "100%",
            }}
        >
          {field.name}
        </div>
        </Grid.Column>
     </Grid>

      </div>
    );
  }
}

export default FieldItem;
