import React, { Component } from "react";
import { withFirestore } from "react-redux-firebase";
import { Icon } from "semantic-ui-react";

class FieldItem extends Component {
  render() {
    const { field } = this.props;
    return (
      <div
      draggable
      onDragStart ={e=>this.props.onDragStart(e, field)}
        class="container"
        onClick={()=>this.props.handleSelectField(field)}
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          display: "inline-block",
          background: "white",
          marginRight: "15px",
          marginBottom: "15px",
          borderRadius: "5%",
          height: 75,
          width: 75,
          textAlign:'center',
          position: 'relative'

        }}
      >
      
          <Icon

          style={{

            position: 'absolute',
            float: 'left',
            top: '25%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
           

          }}
            //   onClick={()=>this.props.handleSelectIcon(field.className)}

            //    onMouseEnter={()=>this.props.handleOnMouseEnter(field.className)}
            //    onMouseLeave={()=>this.props.handleOnMouseLeave(field.className)}
            //  style={{opacity: this.props.hoveredIcon===field.className? 1:0.6}}
            //    index={i}
            size="big"
            name={field.icon}
            //    color={field.className===this.props.selectedIcon ? 'teal' : 'black'}
          />
     
        <div
          class="container"
          style={{ 
            position: 'relative',
            float: 'left',
            top: '75%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            
            
            
            width: "auto", textAlign: "center",  }}
        >
          {field.name}
        </div>
      </div>
    );
  }
}

export default FieldItem;
