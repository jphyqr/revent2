import React, { Component } from "react";
import { Image, Icon } from "semantic-ui-react";
class BuildCarouselItem extends Component {
  state = {
    hovered: false,
    expanded: false,
    clicked: false
  };
  onMouseEnterHandler = () => {
    if (!this.props.lockHover)
      this.setState({
        hovered: true
      });

    this.props.handleChildExpanding();
  };
  onMouseLeaveHandler = () => {
    this.setState({
      hovered: false
    });
    this.props.handleChildCompressing();
  };



  componentDidMount = () => {
    if (this.props.index === 5) {
      console.log("this is the 5th");
      console.log("5th", this.props.category.string);
      console.log(this.props.item);
    }
  };

  handleContextRef = contextRef => this.props.updateCarouselRef(contextRef);

  handleClick = (e, job, category) => {
    this.setState({clicked:true})
    this.props.toggleLockInHover();
    this.setState({ expanded: true });
    this.setState({ hovered: false });
    console.log("clicked handle click");
    console.log("e", e);
    this.props.handleShowExpanded(job);
    if (!this.props.showExpanded) {
      this.props.scrollToMyRef(e, category);
    }
  };
  render() {
    const { item, category, index, setNextRef } = this.props;
    return (
      // <Image
      // style={{minHeight:200, maxHeight:200, minWidth:200, maxWidth:200}}
      //   onClick={(e)=>this.handleClick(e, item, category)}
      //   src={`/assets/categoryImages/${item}.jpg`}
      // />

      <div
        ref={index}
        className="ui  image"
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
        onClick={e => this.handleClick(e, item, category)}
        style={{
          display: "inline-block",
          height: 150, // this.state.hovered ? 200 : 150,
          width:  300, //: 400,
          marginLeft:15,
          //left: this.state.hovered ? -30: 0,
          opacity: this.state.hovered ? 1 : 0.8,
          // transition: "opacity 1500ms, height 1500ms , width 1500ms ",
       //   transform: this.state.hovered ? "scaleY(1.5)" : this.props.scrollRightClicked ? "translateX(-500%)" : "scaleY(1)" ,
          //transform: this.state.clicked ? "translateX(-100%)" : "translateX(0%)",
         // transformOrigin: "50% 50%",
          boxSizing: "border-box",
          transition: "0.15s all ease"

          //  transitionDelay: "100ms"
        }}
      >
        <div
          style={{
            backgroundColor: "black",
            padding: 0
          }}
        >
          <img
            style={{
              height: 150, //this.state.hovered ? 200 : 150,
              width:300,//this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
              //    left:this.state.hovered ? 50 : 0,
              opacity: this.state.hovered ? 1 : 0.8,
              //    transition: "opacity 1500ms , height 1500ms , width 1500ms ",
          //      transform: this.state.hovered?"scale(1.5)":"scale(1)",
              //    transformOrigin: "50% 50%",
              transition: "0.15s all ease"
            }}
            src={`/assets/categoryImages/${item.id}.jpg`}
          />
        </div>
        <div
          style={{
        //    backgroundColor: "black",
            color: "white",
            fontSize: 22,
            position: "absolute",
            bottom: "0",
            marginBottom:5,
            marginRight:5
            ,
            //right: "100",
            textAlign: "right",
            width: "100%",
            height: "auto"
          }}
        >
          {item.string}
        </div>
        <div
          style={{
       //     backgroundColor: "black",
            color: "white",
            fontSize: 18,
            position: "absolute",
            bottom: 50,
            textAlign: "center",
            width: "100%",
            
            opacity: this.state.hovered ? .8 : 0,
            height: "auto"
          }}
        >
          <Icon color="white" size="huge" name="arrow down" />
        </div>
      </div>
    );
  }
}

export default BuildCarouselItem;
