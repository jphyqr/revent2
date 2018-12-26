import React, { Component } from "react";
import Slider from "react-slick";
import { allItems } from "../../../../../app/data/buildData";
import { Button, Image, Transition } from "semantic-ui-react";
import { findDOMNode } from "react-dom";
import { isThisSecond } from "date-fns";
import BuildSlider from './BuildSlider/BuildSlider'
import BuildExpanded from "./BuildExpanded/BuildExpanded";
import { withFirestore, firestoreConnect } from "react-redux-firebase";
import {getTasksForCarousel} from './carouselActions'
import { connect } from "react-redux";
import {selectTaskToEdit} from '../../../../modals/TaskModal/taskActions'
const query = ({ category }) => {
  return [
    {
      collection: "tasks",
      where: [["category", "==", `${category.id}`]],
      storeAs: "tasksInCategory"
    }
  ];
};


const actions = {
  getTasksForCarousel,selectTaskToEdit
    
}

const mapState = state => {
  const tasksInCategory = state.firestore.ordered.tasksInCategory
   
  return {
   
    tasks: tasksInCategory
  };
};

class BuildCarousel extends Component {

async componentDidMount(){
  let tasks = await this.props.getTasksForCarousel(this.props.category);

  if(tasks.length > 0){
   
    this.setState({tasks:tasks})
  }

}
  


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
    selectedJob: {},
    tasks: []
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
      "handleShowExapanded", job
    )
    this.setState({ selectedJob: job, showExpanded: true });
    this.props.selectTaskToEdit(job)
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

    const items = allItems[category.id];

  

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
           items={this.state.tasks}
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

export default connect(mapState,actions)(firestoreConnect(props=>query(props))(BuildCarousel));
