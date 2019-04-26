import React, { Component, createRef } from "react";
import { Icon, Confirm } from "semantic-ui-react";
import {toastr} from "react-redux-toastr";
class ExclusiveJobItem extends Component {
  state = { hovered: false, isSelected: false, open: false };
  componentDidMount() {}
  componentWillReceiveProps = nextProps => {};
  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });
  handleClick = async (e, exclusiveJob) => {
    if (this.props.role.isAdmin) {
      this.setState({ clicked: true });
      this.setState({ isSelected: true });
      this.props.toggleLockInHover();
      this.setState({ expanded: true });
      this.setState({ hovered: false });
      this.props.handleShowExpanded(exclusiveJob);
      if (!this.props.showExpanded) {
        this.props.scrollToMyRef(e, 300);
      }
    } else {
      toastr.confirm("Exclusive Jobs are disabled during Alpha Release", {
        onOk: () => {}
      });
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
    const {
      exclusiveJob,
      role,
      index,
      REGULAR_EXCLUSIVE_HEIGHT,
      REGULAR_EXCLUSIVE_WIDTH,
      COMPACT_EXCLUSIVE_HEIGHT,
      COMPACT_EXCLUSIVE_WIDTH,
      compactDisplayMode
    } = this.props;

    const { isAdmin, authenticated } = role || {};
    const { contractor } = exclusiveJob || {};
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
          height: compactDisplayMode
            ? COMPACT_EXCLUSIVE_HEIGHT
            : REGULAR_EXCLUSIVE_HEIGHT, // this.state.hovered ? 200 : 150,
          width: compactDisplayMode
            ? COMPACT_EXCLUSIVE_WIDTH
            : REGULAR_EXCLUSIVE_WIDTH,
          marginLeft: 5,
          //left: this.state.hovered ? -30: 0,
          opacity: isAdmin? this.state.hovered || this.state.isSelected ? 1 : 0.8 : 0.2,
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
            height: compactDisplayMode
              ? COMPACT_EXCLUSIVE_HEIGHT
              : REGULAR_EXCLUSIVE_HEIGHT, // this.state.hovered ? 200 : 150,
            width: compactDisplayMode
              ? COMPACT_EXCLUSIVE_WIDTH
              : REGULAR_EXCLUSIVE_WIDTH,
            position: "absolute",
            //  minWidth: "25%",
            //    left: 825,

            bottom: 0,
            //     maxWidth: "25%",
            backgroundImage:
              "linear-gradient( to top, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)",
            zIndex: 5
          }}
        />
        <div
          style={{
            backgroundColor: "black",
            padding: 0
          }}
        >
          {contractor && (
            <img
              style={{
                height: 75, //this.state.hovered ? 200 : 150,
                width: 75, //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
                position: "absolute",
                top: 10,
                left: 10,
                transition: "0.15s all ease",
                zIndex: 10,
                borderRadius: "50%",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
              }}
              src={contractor && contractor.photoURL}
            />
          )}
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
              height: compactDisplayMode
                ? COMPACT_EXCLUSIVE_HEIGHT
                : REGULAR_EXCLUSIVE_HEIGHT, // this.state.hovered ? 200 : 150,
              width: compactDisplayMode
                ? COMPACT_EXCLUSIVE_WIDTH
                : REGULAR_EXCLUSIVE_WIDTH,
              //    left:this.state.hovered ? 50 : 0,
              //       opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              //    transition: "opacity 1500ms , height 1500ms , width 1500ms ",
              //      transform: this.state.hovered?"scale(1.5)":"scale(1)",
              //    transformOrigin: "50% 50%",

              position: "absolute",
              top: 0,
              transition: "0.15s all ease"
            }}
            src={exclusiveJob.displayURL}
          />
        </div>
        <div
          style={{
            //    backgroundColor: "black",
            color: "white",
            fontSize: compactDisplayMode ? 14 : 28,
            position: "absolute",
            bottom: "0",
            backgroundColor: "black",
            paddingBottom: compactDisplayMode ? 2 : 10,
            paddingTop: compactDisplayMode ? 2 : 10,

            marginRight: 5,
            //right: "100",
            textAlign: "center",
            //wordBreak:"break-all",
            width: "100%",
            height: compactDisplayMode ? "45px" : "60px",
            //  textOverflow: "ellipsis",
            whiteSpace: "normal",
            overflowX: "hidden"
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
            zIndex: 10,
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
        />
      </div>
    );
  }
}

export default ExclusiveJobItem;
