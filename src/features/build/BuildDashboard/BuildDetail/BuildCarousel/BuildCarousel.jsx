import React, { Component } from "react";
import Slider from "react-slick";
import { allItems } from "../../../../../app/data/buildData";
import { Button, Image, Transition } from "semantic-ui-react";
import { findDOMNode } from "react-dom";
import { isThisSecond } from "date-fns";
import BuildSlider from './BuildSlider/BuildSlider'
import BuildExpanded from "./BuildExpanded/BuildExpanded";
class BuildCarousel extends Component {


  state = {
    showExpanded: false,
    sliding:false,
    job: "",
    lockInHover: false,
    childIsExpanding: false,
    carouselHovered: false,
    carouselRef: {},
    scrollRef:{},
    index:0,
    nextRef:{},
    selectedJob: {}
  };









  handleChildExpanding = () => {
    this.setState({ childIsExpanding: true });
  };

  handleChildCompressing = () => {
    if (!this.state.carouselHovered) {
      this.setState({ childIsExpanding: false });
    }
  };

  toggleLockInHover = () => {
    this.setState({ lockInHover: true });
  };

  handleShowExpanded = job => {
    console.log(
      "handleShowExapanded"
    )
    this.setState({ selectedJob: job, showExpanded: true });
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
      carouselHovered: false,
    
    });
    if(!this.state.showExpanded)
    this.setState({
        childIsExpanding: false
    })
  };

  render() {
    const { category, scrollToMyRef } = this.props;
    const {nextRef} = this.state
    console.log({ category });
    const items = allItems[category.id];

    console.log({ items });

    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      swipeToSlide: true,
      variableWidth: true,
      adaptiveHeight: true
    };
    return (
      <div style={{marginTop:30}}>
 

        <p style={{ color: "white", fontSize: 26, margin:5 }}>{category.string}</p>
   
         <BuildSlider 
           onMouseEnterHandler={this.onMouseEnterHandler}
           onMouseLeaveHandler={this.onMouseLeaveHandler}
           childIsExpanding={this.state.childIsExpanding}
           showExpanded={this.state.showExpanded}
           carouselHovered={this.state.carouselHovered}
           showExpanded={this.state.showExpanded}
           items={items}
           category={category}
           scrollToMyRef={scrollToMyRef}
           handleShowExpanded={this.handleShowExpanded}
           toggleLockInHover={this.toggleLockInHover}
           handleChildExpanding={this.handleChildExpanding}
           handleChildCompressing={this.handleChildCompressing}
           lockInHover={this.state.lockInHover}

         />

        <Transition.Group animation="scale" duration={300}>
          {this.state.showExpanded && (
            

            <BuildExpanded 
            selectedJob={this.state.selectedJob}
            handleClose={this.handleClose}
            />
          )}
        </Transition.Group>
      </div>
    );
  }
}

export default BuildCarousel;
