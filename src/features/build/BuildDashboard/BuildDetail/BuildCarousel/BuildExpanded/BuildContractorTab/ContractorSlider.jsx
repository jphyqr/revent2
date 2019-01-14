import React, { Component } from "react";
import ContractorItem from "./ContractorItem";
import {objectToArray} from '../../../../../../../app/common/util/helpers'
class ContractorSlider extends Component {

state = {
    subscribers: []
}
    componentDidMount(){
        const {items} = this.props
        const subscribers = items&&objectToArray(items); 

        this.setState({subscribers: subscribers})
    }

  render() {
      const {subscribers} = this.state
      console.log({subscribers})
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
        {subscribers &&
          subscribers.map((item, i) => (
            <ContractorItem
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

export default ContractorSlider;
