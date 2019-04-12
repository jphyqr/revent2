import React, { Component } from "react";
import { Icon } from "semantic-ui-react";




class ContractItem extends Component {




  handleClick = async (e, myContract) => {
  
    this.setState({ clicked: true });

    this.props.toggleLockInHover();
    this.setState({ expanded: true });
    this.setState({ hovered: false });
    this.props.handleShowExpanded(myContract);
    if (!this.props.showExpanded) {
      this.props.scrollToMyRef(e, 0);
    }
  };

  render() {
    const { myContract , index } = this.props;
    const {jobData, ownerData} = myContract ||{}
    const {ownerPhotoURL} = ownerData || {}
    const {jobPhotoURL} = jobData||{}
  const {quotedByPhotoURL} = myContract || ""
    return (
      <div
        ref={index}
        className="ui  image"
        //   onMouseEnter={this.onMouseEnterHandler}
        //   onMouseLeave={this.onMouseLeaveHandler}
        onClick={e => this.handleClick(e, myContract)}
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          display: "inline-block",
          height: 150, // this.state.hovered ? 200 : 150,
          width: 300, //: 400,
          marginLeft: 15,
          //left: this.state.hovered ? -30: 0,
          //    opacity: (this.state.hovered||this.state.isSelected) ? 1 : 0.8,
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
              width: 300, //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
              //    left:this.state.hovered ? 50 : 0,
              //       opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              //    transition: "opacity 1500ms , height 1500ms , width 1500ms ",
              //      transform: this.state.hovered?"scale(1.5)":"scale(1)",
              //    transformOrigin: "50% 50%",
              transition: "0.15s all ease"
            }}
            src={jobPhotoURL}
          />
                    <img
            style={{
              height: 75, //this.state.hovered ? 200 : 150,
              width: 75, //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
              position: "absolute",
              top: 10,
              left: 10,
              transition: "0.15s all ease",
              zIndex:10,
              borderStyle: "solid",
              borderRadius: "50%",
              borderWidth: "thick",
              borderColor: "green",
              boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
            src={quotedByPhotoURL}
          />
                              <label
            style={{
               position: "absolute",
              top: 80,
              left: 26,
              transition: "0.15s all ease",
              zIndex:10,
              backgroundColor:"green",
              color:"lightgrey",
              boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          
          >Owner</label>

<img
            style={{
              height: 75, //this.state.hovered ? 200 : 150,
              width: 75, //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
              position: "absolute",
              top: 10,
              right: 10,
              transition: "0.15s all ease",
              zIndex:10,
              borderStyle: "solid",
              borderRadius: "50%",
              borderWidth: "thick",
              borderColor: "lightgrey",
              boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
            src={ownerPhotoURL}
          />

<label
            style={{
               position: "absolute",
              top: 80,
              right: 14,
              transition: "0.15s all ease",
              zIndex:10,
              backgroundColor:"lightgrey",
              color:"green",
              boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }}
          
          >Contractor</label>
        </div>
        <div
          style={{
            //    backgroundColor: "black",
            color: "white",
            fontSize: 22,
            position: "absolute",
            bottom: "0",
            marginBottom: 5,
            marginRight: 5,
            //right: "100",
            textAlign: "right",
            width: "100%",
            height: "auto",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden"
          }}
        >
          {myContract.taskName}
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

            //     opacity: this.state.hovered ? 0.8 : 0,
            height: "auto"
          }}
        >
          <Icon color="white" size="huge" name="arrow down" />
        </div>
        {myContract.inDraft ? (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              opacity: 0.6,
              color: "white"
            }}
          >
            In Draft
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              opacity: 0.6,
              color: "white"
            }}
          >
            LIVE
          </div>
        )}

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

export default (ContractItem);
