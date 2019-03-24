import React, { Component } from 'react'
import ContractItem from './ContractItem'
 class ContractSlider extends Component {
  render() {
      const {myContracts} = this.props
    return (
        <div
        class="list"
      //  onMouseEnter={this.props.onMouseEnterHandler}
      //  onMouseLeave={this.props.onMouseLeaveHandler}
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
        {myContracts &&
          myContracts.map((myContract, i) => (
            <ContractItem
              index={i}
           //   category={this.props.category}
              myContract={myContract}
           //   selectDraftToEdit={selectDraftToEdit}
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

export default ContractSlider