import React, { Component } from 'react'
import MyJobItem from './MyJobItem'
 class MyJobsSlider extends Component {
  render() {
      const {myJobs, selectDraftToEdit,
      
        compactDisplayMode,
        COMPACT_ITEM_HEIGHT,
        COMPACT_ITEM_WIDTH,
        REGULAR_ITEM_HEIGHT,
        REGULAR_ITEM_WIDTH,
        newQuotes,
        notifications
      
      } = this.props
    return (
        <div
        class="list"
      //  onMouseEnter={this.props.onMouseEnterHandler}
      //  onMouseLeave={this.props.onMouseLeaveHandler}
        style={{
          height: compactDisplayMode? (COMPACT_ITEM_HEIGHT+10):(REGULAR_ITEM_HEIGHT+10),
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
        {myJobs &&
          myJobs.map((myJob, i) => (
            <MyJobItem
            notifications={notifications}
            newQuotes={newQuotes}
            compactDisplayMode={compactDisplayMode}
REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}
              index={i}
           //   category={this.props.category}
              myJob={myJob}
              selectDraftToEdit={selectDraftToEdit}
            //   scrollRightClicked={this.state.scrollRightClicked}
               scrollToMyRef={this.props.scrollToMyRef}
            //   showExpanded={this.props.showExpanded}
               handleShowExpanded={this.props.handleShowExpanded}
               toggleLockInHover={this.props.toggleLockInHover}
            //   lockHover={this.props.lockInHover}
            //   handleChildExpanding={this.props.handleChildExpanding}
            //   handleChildCompressing={this.props.handleChildCompressing}
            //   handleSubscribe={this.props.handleSubscribe}
            //   handleUnsubscribe={this.props.handleUnsubscribe}
            //   auth={this.props.auth}
            //   loading={this.props.loading}
            //   selectedJobId={this.props.selectedJobId}
            //   subscribeButtonLoading={this.props.subscribeButtonLoading}
            //   expandedLoading={this.props.expandedLoading}
            />
          ))}
      </div>
    )
  }
}

export default MyJobsSlider