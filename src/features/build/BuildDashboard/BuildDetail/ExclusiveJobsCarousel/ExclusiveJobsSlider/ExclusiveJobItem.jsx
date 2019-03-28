import React, { Component, createRef } from "react";
import { Icon } from "semantic-ui-react";




class ExclusiveJobItem extends Component {

 state={hovered:false, isSelected:false}
  componentDidMount() {
 
  }
  componentWillReceiveProps = nextProps => {

  };

  handleClick = async (e, exclusiveJob) => {
    this.setState({ clicked: true });
       this.setState({isSelected:true})
    this.props.toggleLockInHover();
    this.setState({ expanded: true });
    this.setState({ hovered: false });
    this.props.handleShowExpanded(exclusiveJob);
    if (!this.props.showExpanded) {
      this.props.scrollToMyRef(e,(300));
    }
  };

  onMouseEnterHandler = () => {
    if (!this.props.lockHover)
      this.setState({
        hovered: true
      });

  
  };
  onMouseLeaveHandler = () => {
    this.setState({
      hovered: false
    });
   
  };


  render() {
    const { exclusiveJob, index,  } = this.props;
    const {contractor} = exclusiveJob || {
      
    }
    return (
      <div
       
        className="ui  image"
           onMouseEnter={this.onMouseEnterHandler}
           onMouseLeave={this.onMouseLeaveHandler}
        onClick={e => this.handleClick(e, exclusiveJob)}
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          display: "inline-block",
          height: 400, // this.state.hovered ? 200 : 150,
          width: 300, //: 400,
          marginLeft: 15,
          //left: this.state.hovered ? -30: 0,
            opacity: (this.state.hovered||this.state.isSelected) ? 1 : 0.8,
          // transition: "opacity 1500ms, height 1500ms , width 1500ms ",
          //   transform: this.state.hovered ? "scaleY(1.5)" : this.props.scrollRightClicked ? "translateX(-500%)" : "scaleY(1)" ,
          //transform: this.state.clicked ? "translateX(-100%)" : "translateX(0%)",
          // transformOrigin: "50% 50%",
          boxSizing: "border-box",
          transition: "0.15s all ease"
          //  transitionDelay: "100ms"
        }}
      >

<div              style={{
                 width: "100%",
                 height: "100%",
                position: "absolute",
              //  minWidth: "25%",
            //    left: 825,

                bottom:0,
           //     maxWidth: "25%",
                backgroundImage:
                  "linear-gradient( to top, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)",
                zIndex: 5
              }}>
    
    </div>
        <div
          style={{
            backgroundColor: "black",
            padding: 0
          }}
        >
        {contractor&&<img
            style={{
              height: 75, //this.state.hovered ? 200 : 150,
              width: 75, //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
              position: "absolute",
              top: 10,
              left: 10,
              transition: "0.15s all ease",
              zIndex:10,
              borderRadius: "50%",
              boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              
            }}
            src={contractor&&contractor.photoURL}
          />}
                  {/* <div
          style={{
            height: 250,
            position: "absolute",
            minWidth: "100%",
            top: 150,
            maxWidth: "85%",
            backgroundImage:
              "linear-gradient( rgba(0,0,0, 1) 0%, rgba(255,255,255, 0) 100%)",
              zIndex: 5
          }}
        /> */}
          <img
           ref={index}
            style={{
              height:  400, //this.state.hovered ? 200 : 150,
              width: 300, //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
              //    left:this.state.hovered ? 50 : 0,
              //       opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              //    transition: "opacity 1500ms , height 1500ms , width 1500ms ",
              //      transform: this.state.hovered?"scale(1.5)":"scale(1)",
              //    transformOrigin: "50% 50%",
           
              position:"absolute",
              top:0,
              transition: "0.15s all ease"
            }}
            src={exclusiveJob.displayURL}
          />


        </div>
        <div
          style={{
            //    backgroundColor: "black",
            color: "white",
            fontSize: 28,
            position: "absolute",
            bottom: "0",
            backgroundColor:"black",
            paddingBottom: 10,
            paddingTop:10,

            marginRight: 5,
            //right: "100",
            textAlign: "center",
            width: "100%",
            height: "auto",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden"
          }}
        >
          {exclusiveJob.name}
        </div>
        <div
          style={{
            //     backgroundColor: "black",
            color: "white",
            fontSize: 18,
            position: "absolute",
            bottom: 75,
            textAlign: "center",
            width: "100%",
            zIndex:10,
                opacity: this.state.hovered ? 0.8 : 0,
            height: "auto"
          }}
        >
          <Icon color="white" size="massive" name="arrow down" />
        </div>
      
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              opacity: 0.6,
              color: "white"
            }}
          >
            {exclusiveJob.managedBy}
          </div>
         

        <div
          style={{
            position: "absolute",
            top: 30,
            right: 5,
            color: "white",
            zIndex: 5
          }}
        >

        </div>
      </div>
    );
  }
}

export default (ExclusiveJobItem);