import React, { Component } from 'react'
import MyJobsSlider from './MyJobsSlider/MyJobsSlider'
import MyJobsExpanded from './MyJobsExpanded/MyJobsExpanded'
import {Transition} from 'semantic-ui-react'
class MyJobsCarousel extends Component {

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
    myJobs: [],
    subscribeButtonLoading: false,
    expandedLoading: false,
  };

  toggleLockInHover = () => {
    this.setState({ lockInHover: true });
  };

  handleShowExpanded  = async draft => {
    
    this.setState({expandedLoading:true})

    let draftUserId= draft.id
    let draftId = draftUserId.split('_')[0]

    let newTask = await this.props.selectDraftToEdit(draftId)
    console.log({newTask})
    this.setState({ selectedJob: this.props.draft, showExpanded: true });
    this.setState({expandedLoading:false})
  };

  handleClose = () => {
    this.setState({ showExpanded: false, lockInHover: false });
  };

  async componentDidMount(){
    const {myJobs} = this.props
  
    if(myJobs&&myJobs.length > 0){
     
      this.setState({myJobs:myJobs, selectedJob:this.props.draft})
    }
  
  }

  render() {
      const {myJobs, selectDraftToEdit, scrollToMyRef} = this.props
    return (
        <div style={{marginTop:30}}>
 

        <p style={{ color: "white", fontSize: 26, margin:5 }}>My Projects</p>
   
         <MyJobsSlider 
        //    onMouseEnterHandler={this.onMouseEnterHandler}
        //    onMouseLeaveHandler={this.onMouseLeaveHandler}
        //    childIsExpanding={this.state.childIsExpanding}
        //    showExpanded={this.state.showExpanded}
        //    carouselHovered={this.state.carouselHovered}
        //    items={this.state.tasks}
        //    category={category}
        
            scrollToMyRef={scrollToMyRef}
            handleShowExpanded={this.handleShowExpanded}
            toggleLockInHover={this.toggleLockInHover}
        //    handleChildExpanding={this.handleChildExpanding}
        //    handleChildCompressing={this.handleChildCompressing}
        //    lockInHover={this.state.lockInHover}
        //    auth={this.props.auth}
        //    subscribeButtonLoading={this.state.subscribeButtonLoading}
        //    handleSubscribe={this.handleSubscribe}
        //    handleUnsubscribe={this.handleUnsubscribe}
        //    loading={this.props.loading}
        //    selectedJobId={this.state.selectedJob.key}
        //    expandedLoading={this.state.expandedLoading}
            myJobs={myJobs}
            selectDraftToEdit={selectDraftToEdit}
         />

        <Transition.Group animation="scale" duration={400}>
         
          {(this.state.showExpanded || this.state.expandedLoading)&& 
          
         

            <MyJobsExpanded 
            // subscribeButtonLoading={this.state.subscribeButtonLoading}
            // handleSubscribe={this.handleSubscribe}
             selectedJob={this.state.selectedJob.value}
             selectedJobId={this.state.selectedJob.key}
             handleClose={this.handleClose}
             handleEditDraft={this.props.handleEditDraft}
             handlePostJob={this.props.handlePostJob}
            // handleUnsubscribe={this.handleUnsubscribe}
             expandedLoading={this.state.expandedLoading}
             pauseButtonLoading={this.props.pauseButtonLoading}
            />
          }
        </Transition.Group>
      </div>
    )
  }
}



export default  MyJobsCarousel