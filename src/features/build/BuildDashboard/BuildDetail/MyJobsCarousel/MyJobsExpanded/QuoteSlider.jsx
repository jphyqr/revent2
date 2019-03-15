import React, { Component } from "react";
import QuoteItem from "./QuoteItem";
import {objectToArray} from '../../../../../../app/common/util/helpers'
class QuoteSlider extends Component {

state = {
    quotes: []
}
    componentDidMount(){
        const {quotes} = this.props
       // const subscribers = items&&objectToArray(items); 

        this.setState({quotes: quotes})
    }

    componentWillReceiveProps = nextProps=>{
        if(this.state.quotes != nextProps.quotes)
        {
            this.setState({quotes: nextProps.quotes})
        }
    }

  render() {
      const {quotes} = this.state
      const quotesArray = objectToArray(quotes) || []
    return (
      <div
        class="list"
      //  onMouseEnter={this.props.onMouseEnterHandler}
      //  onMouseLeave={this.props.onMouseLeaveHandler}
        style={{
          height: 160,
          marginBottom: 1,
          width: "100vw",
        // backgroundColor: "grey",
          paddingTop: 0,
          //   paddingLeft: this.props.childIsExpanding&&!this.props.showExpanded ? 0 : 30,
          transition: "0.15s all ease",
         // overflow: "scroll",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
          top:"10",
          verticalAlign: "middle",
        }}
      >
        {quotesArray &&
          quotesArray.map((item, i) => (
            <QuoteItem
              index={i}
            //  category={this.props.category}
              item={item}
            //   scrollRightClicked={this.state.scrollRightClicked}
            //   scrollToMyRef={this.props.scrollToMyRef}
            //   showExpanded={this.props.showExpanded}
            //   handleShowExpanded={this.props.handleShowExpanded}
            //   toggleLockInHover={this.props.toggleLockInHover}
            //   lockHover={this.props.lockInHover}
            //   handleChildExpanding={this.props.handleChildExpanding}
            //   handleChildCompressing={this.props.handleChildCompressing}
            //   handleSubscribe={this.props.handleSubscribe}
            //   handleUnsubscribe={this.props.handleUnsubscribe}
            //   auth={this.props.auth}
            //   loading={this.props.loading}
            //   selectedJobId={this.props.selectedJobId}
            //   subscribeButtonLoading={this.props.subscribeButtonLoading}
            />
          ))}
      </div>
    );
  }
}

export default QuoteSlider;
