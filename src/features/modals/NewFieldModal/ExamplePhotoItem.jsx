import React, { Component } from "react";
import { Image, Container, Label, TextArea } from "semantic-ui-react";
class ExamplePhotoItem extends Component {

    state={descriptionHovered:false, titleHovered:false}

handleTitleChange=(event)=>{
    console.log('handeTItleChange etv' , event.target.value)
    this.props.handleUpdatePhotoTitle(this.props.index, event.target.value )
}

handleDescriptionChange=(event)=>{
    console.log('handedescritioneChange etv' , event.target.value)
    this.props.handleUpdatePhotoDescription(this.props.index, event.target.value )
}




  render() {
    const { photo, index } = this.props;
    const {descriptionHovered,titleHovered} =this.state
    return (
      <div
        class="contianer"
        style={{ position: "relative", minHeight:240, whiteSpace: "pre-wrap", width: 200 }}
      >
        <TextArea
            
              onMouseEnter={()=>this.setState({titleHovered:true})}
              onMouseLeave={()=>this.setState({titleHovered:false})}
              onChange={this.handleTitleChange}
          //  style={{opacity: this.props.hoveredIcon===field.className? 1:0.6}}
                
          style={{
            
            width: "200",
            height: "25",
            color: "white",
            backgroundColor:"black",
            fontSize: "15px",
            textAlign: "center",
            position: "absolute",
            top: "0%",
            opacity: titleHovered? 1:0.6,
            zIndex: '2',
            rows: 1

          }}
        >
          {photo.title}
        </TextArea>

        <Image style={{ height: 200, width: 200, bottom:"0px" }} src={photo.url} />
        <TextArea
            
              onMouseEnter={()=>this.setState({descriptionHovered:true})}
              onMouseLeave={()=>this.setState({descriptionHovered:false})}
          //  style={{opacity: this.props.hoveredIcon===field.className? 1:0.6}}
          onChange={this.handleDescriptionChange}
          style={{
            
            width: "200",
            height: "auto",
            color: "white",
            backgroundColor:"black",
            fontSize: "15px",
            textAlign: "center",
            position: "absolute",
            bottom: "0%",
            opacity: descriptionHovered? 1:0.6

          }}
        >
          {photo.description}
        </TextArea>
      </div>
    );
  }
}

export default ExamplePhotoItem;
