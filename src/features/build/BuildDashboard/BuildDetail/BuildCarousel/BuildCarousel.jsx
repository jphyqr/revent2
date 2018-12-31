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
import {subscribeToTask, unsubscribeToTask} from '../../../../../features/user/userActions'
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
  getTasksForCarousel,selectTaskToEdit,subscribeToTask, unsubscribeToTask
    
}

const mapState = state => {
  const tasksInCategory = state.firestore.ordered.tasksInCategory
   
  return {
    auth: state.firebase.auth,
    loading: state.async.loading,
    tasks: tasksInCategory,
    task: state.task&&state.task
  };
};

class BuildCarousel extends Component {




 handleTasksUpdated = async () =>{
  let tasks = await this.props.getTasksForCarousel(this.props.category);

  if(tasks.length > 0){
   
    this.setState({tasks:tasks, selectedJob:this.props.task})
  }
 }
async componentDidMount(){
  let tasks = await this.props.getTasksForCarousel(this.props.category);

  if(tasks.length > 0){
   
    this.setState({tasks:tasks, selectedJob:this.props.task})
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
    tasks: [],
    subscribeButtonLoading: false
  };



  handleUnsubscribe = async () =>{
    this.setState({subscribeButtonLoading: true})
    await this.props.unsubscribeToTask(this.state.selectedJob);
    this.setState({subscribeButtonLoading: false})
    this.setState({selectedJob: this.props.task})
   
    this.handleTasksUpdated() 
    this.forceUpdate();
  }



  handleSubscribe = async ()  =>{
    this.setState({subscribeButtonLoading: true})
    await this.props.subscribeToTask(this.state.selectedJob);
    this.setState({subscribeButtonLoading: false})

    this.setState({selectedJob: this.props.task})
    this.handleTasksUpdated()
      this.forceUpdate();
  }

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

  handleShowExpanded  = async job => {
    console.log(
      "handleShowExapanded", job
    )
    let newTask = await this.props.selectTaskToEdit(job)
    console.log({newTask})
    this.setState({ selectedJob: this.props.task, showExpanded: true });
    
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
           auth={this.props.auth}
           subscribeButtonLoading={this.state.subscribeButtonLoading}
           handleSubscribe={this.handleSubscribe}
           handleUnsubscribe={this.handleUnsubscribe}
           loading={this.props.loading}
           selectedJobId={this.state.selectedJob.key}

         />

        <Transition.Group animation="scale" duration={300}>
          {this.state.showExpanded && (
            

            <BuildExpanded 
            subscribeButtonLoading={this.state.subscribeButtonLoading}
            handleSubscribe={this.handleSubscribe}
            selectedJob={this.state.selectedJob.value}
            handleClose={this.handleClose}
            handleUnsubscribe={this.handleUnsubscribe}
            />
          )}
        </Transition.Group>
      </div>
    );
  }
}

export default connect(mapState,actions)(firestoreConnect(props=>query(props))(BuildCarousel));
