import React, { Component } from "react";
import { Image, Icon } from "semantic-ui-react";
import { objectToArray } from "../../../../../../app/common/util/helpers";
import LoadingComponent from "../../../../../../app/layout/LoadingComponent";
import { connect } from "react-redux";
import { Button } from "semantic-ui-react";
import {
  subscribeToTask,
  unsubscribeToTask
} from "../../../../../user/userActions";

import {selectTaskToEdit} from '../../../../../modals/TaskModal/taskActions'
import {openModal} from '../../../../../modals/modalActions'

const mapState = state => {
  return {
    loading: state.async.loading
  };
};

const actions = {
  subscribeToTask,
  unsubscribeToTask,
  selectTaskToEdit,
  openModal
};

class BuildCarouselItem extends Component {
  state = {
    hovered: false,
    expanded: false,
    clicked: false,
    isSubscribed: false,
    subscribers: [],
    isLoading: false,
    isSelected: false
  };
  onMouseEnterHandler = () => {
    if (!this.props.lockHover)
      this.setState({
        hovered: true
      });

    this.props.handleChildExpanding();
  };
  onMouseLeaveHandler = () => {
    this.setState({
      hovered: false
    });
    this.props.handleChildCompressing();
  };




  componentDidMount = () => {
    const { item, auth, loading, selectedJobId} = this.props;
    let isSelected = item.id===selectedJobId
    const subscribers =
      item && item.subscribers && objectToArray(item.subscribers);
    const isSubscribed =
      subscribers && auth && subscribers.some(a => a.id === auth.uid);

    this.setState({
      subscribers: subscribers,
      isSubscribed: isSubscribed,
      isLoading: false,
      isSelected: isSelected
    });
  };

  componentWillReceiveProps = nextProps => {
   // if (nextProps.selectedJob !== this.state.currentJob) {
      const { item, auth, loading, selectedJobId } = nextProps
      console.log('item id', item.id)
      console.log('selectedJobId', selectedJobId)
      let isSelected = item.id===selectedJobId
      const subscribers =
      item && item.subscribers && objectToArray(item.subscribers);
    const isSubscribed =
      subscribers && auth && subscribers.some(a => a.id === auth.uid);

      this.setState({
        subscribers: subscribers,
        isSubscribed: isSubscribed,
        isLoading: false,
        isSelected: isSelected
      });
       this.forceUpdate();
   // } 
  };



editTask = item =>{

 
    console.log('editTask', item.id)
    this.setState({loading:true})  
   this.props.selectTaskToEdit(item.id)
    this.setState({loading:false})  
    this.props.openModal("TaskModal")
 
  
}

  handleSubscribe = async item => {
    this.setState({ isLoading: true });
    await this.props.subscribeToTask(item);
    this.setState({ isSubscribed: true, isLoading: false });
  };

  handleUnSubscribe = async item => {
    this.setState({ isLoading: true });
    await this.props.unsubscribeToTask(item);
    this.setState({ isSubscribed: false, isLoading: false });
  };

  handleContextRef = contextRef => this.props.updateCarouselRef(contextRef);

  handleClick = async (e, job, category) => {
    this.setState({ clicked: true });
 //   this.setState({isSelected:true})
    this.props.toggleLockInHover();
    this.setState({ expanded: true });
    this.setState({ hovered: false });
    this.props.handleShowExpanded(job);
    if (!this.props.showExpanded) {
      this.props.scrollToMyRef(e, category);
    }
  };
  render() {
    const { item, category, index, setNextRef, auth } = this.props;
    const { subscribers, isSubscribed, isLoading } = this.state;
    // const subscribers =
    //   item && item.subscribers && objectToArray(item.subscribers);
    // const isSubscribed =
    //   subscribers && subscribers.some(a => a.id === auth.uid);
    //if (loading) return <LoadingComponent inverted={true} />;
    return (
      // <Image
      // style={{minHeight:200, maxHeight:200, minWidth:200, maxWidth:200}}
      //   onClick={(e)=>this.handleClick(e, item, category)}
      //   src={`/assets/categoryImages/${item}.jpg`}
      // />

      <div
        ref={index}
        className="ui  image"
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
        onClick={e => this.handleClick(e, item, category)}
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          display: "inline-block",
          height: 150, // this.state.hovered ? 200 : 150,
          width: 300, //: 400,
          marginLeft: 15,
          //left: this.state.hovered ? -30: 0,
          opacity: (this.state.hovered||this.state.isSelected) ? 1 : 0.8,
          // transition: "opacity 1500ms, height 1500ms , width 1500ms ",
          //   transform: this.state.hovered ? "scaleY(1.5)" : this.props.scrollRightClicked ? "translateX(-500%)" : "scaleY(1)" ,
          //transform: this.state.clicked ? "translateX(-100%)" : "translateX(0%)",
          // transformOrigin: "50% 50%",
          boxSizing: "border-box",
          transition: "0.15s all ease",
          //  transitionDelay: "100ms"
        }}
      >
        <div
          style={{
            backgroundColor: "black",
            padding: 0
          }}
        >
          <img
            style={{
              height: 150, //this.state.hovered ? 200 : 150,
              width: 300, //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
              //    left:this.state.hovered ? 50 : 0,
              opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              //    transition: "opacity 1500ms , height 1500ms , width 1500ms ",
              //      transform: this.state.hovered?"scale(1.5)":"scale(1)",
              //    transformOrigin: "50% 50%",
              transition: "0.15s all ease"
            }}
            src={`/assets/categoryImages/${item.value}.jpg`}
          />
        </div>
        <div
          style={{
            //    backgroundColor: "black",
            color: "white",
            fontSize: 22,
            position: "absolute",
            bottom: "0",
            marginBottom: 5,
            marginRight: 5,
            //right: "100",
            textAlign: "right",
            width: "100%",
            height: "auto"
          }}
        >
          {item.string}
        </div>
        <div
          style={{
            //     backgroundColor: "black",
            color: "white",
            fontSize: 18,
            position: "absolute",
            bottom: 50,
            textAlign: "center",
            width: "100%",

            opacity: this.state.hovered ? 0.8 : 0,
            height: "auto"
          }}
        >
          <Icon color="white" size="huge" name="arrow down" />
        </div>
        {item.managerUid === auth.uid ? (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              opacity: 0.6,
              color: "white"
            }}
          >
            Manager
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              opacity: 0.6,
              color: "white"
            }}
          >
            Managed By: {item.managedBy}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 25,
            right: 5,
            color: "white",
            zIndex: 5000
          }}
        >
          {item.managerUid === auth.uid ? (
            <Button
              loading={isLoading}
              onClick={() => this.editTask(item)}
            >
              edit task
            </Button>
          ) : isSubscribed ? (
            <Button
              loading={this.props.subscribeButtonLoading&&this.state.isSelected}
              onClick={() => this.props.handleUnsubscribe()}
            >
              unsubscribe
            </Button>
          ) : (
            <Button
              loading={this.props.subscribeButtonLoading&&this.state.isSelected}
              onClick={() => this.props.handleSubscribe()}
              color="teal"
            >
              SUBSCRIBE
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(BuildCarouselItem);
