import React, { Component } from 'react'

class RightScrollPaddle extends Component {

handleClick = () => {
    this.props.handleClickedScrollRight()
    
    //this.props.afterScrollRightClicked()
}

  render() {
    return (
<div
        onClick={this.handleClick}
          style={{
            height:"150px",
            display: "inline-block",
            zIndex: 100,
            width:"50px",
            textAlign:"center",

            backgroundColor:"black",
            opacity:0.6,
            
            position: "absolute",
            top: "30",
            
            right:"0",
            
          }}
        >
         
         <p style={{fontSize:40, color:"white",position:"absolute", bottom:60}}> ></p>
        </div>
    )
  }
}

export default  RightScrollPaddle