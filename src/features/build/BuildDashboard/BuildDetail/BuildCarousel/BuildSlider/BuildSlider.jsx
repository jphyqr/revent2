import React, { Component } from "react";
import BuildCarouselItem from "./BuildCarouselItem";
import RightScrollPaddle from "./RightScrollPaddle";
class BuildSlider extends Component {
  state = {
    scrollRightClicked: false
  };

  handleClickedScrollRight = () => {
    console.log("scroll right clicked");
  };

  afterScrollRightClicked = () => {
    console.log("after scroll right clicked");
    this.setState({ scrollRightClicked: false });
  };

  render() {
    return (
      <div
        class="list"
        onMouseEnter={this.props.onMouseEnterHandler}
        onMouseLeave={this.props.onMouseLeaveHandler}
        style={{
          height: 160,
          marginBottom: 1,
          width: "100%",
          // backgroundColor: "blue",
          paddingTop: 0,
          //   paddingLeft: this.props.childIsExpanding&&!this.props.showExpanded ? 0 : 30,
          transition: "0.15s all ease",
          //  overflow: "scroll",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
          verticalAlign: "middle"
        }}
      >
        {this.props.items &&
          this.props.items.map((item, i) => (
            <BuildCarouselItem
              index={i}
              category={this.props.category}
              item={item}
              scrollRightClicked={this.state.scrollRightClicked}
              scrollToMyRef={this.props.scrollToMyRef}
              showExpanded={this.props.showExpanded}
              handleShowExpanded={this.props.handleShowExpanded}
              toggleLockInHover={this.props.toggleLockInHover}
              lockHover={this.props.lockInHover}
              handleChildExpanding={this.props.handleChildExpanding}
              handleChildCompressing={this.props.handleChildCompressing}
            />
          ))}
      </div>
    );
  }
}

export default BuildSlider;
