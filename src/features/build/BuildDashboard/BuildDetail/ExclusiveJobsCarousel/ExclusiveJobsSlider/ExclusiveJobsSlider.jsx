import React, { Component } from "react";
import ExclusiveJobItem from "./ExclusiveJobItem";
class ExclusiveJobsSlider extends Component {
  render() {
    const {
      exclusiveJobs,
      selectDraftToEdit,
      REGULAR_EXCLUSIVE_HEIGHT,
      REGULAR_EXCLUSIVE_WIDTH,
      COMPACT_EXCLUSIVE_HEIGHT,
      COMPACT_EXCLUSIVE_WIDTH,
      compactDisplayMode
    } = this.props;
    return (
      <div
        class="list"
        //  onMouseEnter={this.props.onMouseEnterHandler}
        //  onMouseLeave={this.props.onMouseLeaveHandler}
        style={{
          height: compactDisplayMode? (COMPACT_EXCLUSIVE_HEIGHT+10):(REGULAR_EXCLUSIVE_HEIGHT+10),
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
        {exclusiveJobs &&
          exclusiveJobs.map((exclusiveJob, i) => (
            <ExclusiveJobItem
              index={i}
              role={this.props.role}
              REGULAR_EXCLUSIVE_HEIGHT={REGULAR_EXCLUSIVE_HEIGHT}
              REGULAR_EXCLUSIVE_WIDTH={REGULAR_EXCLUSIVE_WIDTH}
              COMPACT_EXCLUSIVE_HEIGHT={COMPACT_EXCLUSIVE_HEIGHT}
              COMPACT_EXCLUSIVE_WIDTH={COMPACT_EXCLUSIVE_WIDTH}
              compactDisplayMode={compactDisplayMode}
              exclusiveJob={exclusiveJob}
              selectDraftToEdit={selectDraftToEdit}
              scrollToMyRef={this.props.scrollToMyRef}
              handleShowExpanded={this.props.handleShowExpanded}
              toggleLockInHover={this.props.toggleLockInHover}
            />
          ))}
      </div>
    );
  }
}

export default ExclusiveJobsSlider;
