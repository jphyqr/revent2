import React, { Component } from 'react'
import OpenJobItem from './OpenJobItem'
class OpenJobsSlider extends Component {

state={jobsLoading:true}

  componentWillReceiveProps(nextProps){



      console.log('newJobsLoading:', nextProps.jobsLoading)
      this.setState({jobsLoading:nextProps.jobsLoading})
    
  }
  render() {
      const {jobs, compactDisplayMode, COMPACT_ITEM_HEIGHT,COMPACT_ITEM_WIDTH,REGULAR_ITEM_HEIGHT,REGULAR_ITEM_WIDTH,} = this.props
      
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
        {jobs &&
          jobs.map((job, i) => (

            false? //(this.props.jobsLoading||this.props.quotesLoading)?
            <div
           
            style={{
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              display: "inline-block",
              height: compactDisplayMode ? COMPACT_ITEM_HEIGHT:REGULAR_ITEM_HEIGHT , // this.state.hovered ? 200 : 150,
              width: compactDisplayMode ? COMPACT_ITEM_WIDTH:REGULAR_ITEM_WIDTH ,
              marginLeft: 5,
              //left: this.state.hovered ? -30: 0,
              opacity: 0.8,
              
              // transition: "opacity 1500ms, height 1500ms , width 1500ms ",
              //   transform: this.state.hovered ? "scaleY(1.5)" : this.props.scrollRightClicked ? "translateX(-500%)" : "scaleY(1)" ,
              //transform: this.state.clicked ? "translateX(-100%)" : "translateX(0%)",
              // transformOrigin: "50% 50%",
              boxSizing: "border-box",
              transition: "0.15s all ease",
              //  transitionDelay: "100ms"
            }}
          />
            

            :
            <OpenJobItem
      
            compactDisplayMode={compactDisplayMode}
            COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}
            COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
            REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
            REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
       
            myQuotes={this.props.myQuotes}
            handleSelectOpenJob={this.props.handleSelectOpenJob}
            handleHoverJob={this.props.handleHoverJob}
              index={i}
           //   category={this.props.category}
              job={job}
        //      selectDraftToEdit={selectDraftToEdit}
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

export default OpenJobsSlider