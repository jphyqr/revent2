import React, { Component } from "react";
import Slider from "react-slick";
import { allItems } from "../../../../../app/data/buildData";
import { Button, Image, Transition, Dimmer, Loader } from "semantic-ui-react";

import ContractsSlider from "./MyContractsSlider/ContractSlider";
import MyContractsExpanded from "./MyContractsExpanded/MyContractsExpanded";

import { connect } from "react-redux";
import { selectContract } from "./contractActions";

const actions = {
  selectContract
};

const mapState = state => {
  return {
    contract: state.contract||{},
    loading: state.async.loading
  };
};

class MyContractCarousel extends Component {
  async componentDidMount() {
    this.setState({ selectedContract: this.props.contract });
  }

  state = {
    showExpanded: false,
    sliding: false,
    job: "",
    lockInHover: false,
    childIsExpanding: false,
    carouselHovered: false,
    carouselRef: {},
    scrollRef: {},
    index: 0,
    nextRef: {},
    selectedContract: {},
    tasks: [],
    subscribeButtonLoading: false,
    expandedLoading: false
  };

  toggleLockInHover = () => {
    this.setState({ lockInHover: true });
  };

  handleShowExpanded = async contract => {
    console.log('hanleSHowExpanded newContract', contract)
    this.setState({ expandedLoading: true });
    await this.props.selectContract(contract);

    this.setState({
      selectedContract: this.props.contract,
      showExpanded: true
    });
    this.setState({ expandedLoading: false });
  };

  handleClose = () => {
    this.setState({ showExpanded: false, lockInHover: false });
  };

  onMouseEnterHandler = () => {
    //  if(this.state.childIsExpanding)
    this.setState({
      carouselHovered: true
    });
  };
  onMouseLeaveHandler = () => {
    this.setState({
      carouselHovered: false
    });
    if (!this.state.showExpanded)
      this.setState({
        childIsExpanding: false
      });
  };

  render() {
    const {
      contract,
      scrollToMyRef,
      myContracts,
      REGULAR_ITEM_HEIGHT,
      REGULAR_ITEM_WIDTH,
      COMPACT_ITEM_HEIGHT,
      COMPACT_ITEM_WIDTH
    } = this.props;
    const { selectedContract } = this.state;

    return (
      <div>
        <ContractsSlider
          compactDisplayMode={this.props.compactDisplayMode}
          showExpanded={this.state.showExpanded}
          myContracts={myContracts}
          scrollToMyRef={scrollToMyRef}
          handleShowExpanded={this.handleShowExpanded}
          toggleLockInHover={this.toggleLockInHover}
          lockInHover={this.state.lockInHover}
          loading={this.props.loading}
          REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
          REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
          COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
          COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}
        />

        <Transition.Group animation="scale" duration={400}>
          {(this.state.showExpanded || this.state.expandedLoading) && (
            <MyContractsExpanded
              compactDisplayMode={this.props.compactDisplayMode}
              REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
              REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
              COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
              COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}s
              selectedContract={selectedContract}
              handleClose={this.handleClose}
            />
          )}
        </Transition.Group>
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(MyContractCarousel);
