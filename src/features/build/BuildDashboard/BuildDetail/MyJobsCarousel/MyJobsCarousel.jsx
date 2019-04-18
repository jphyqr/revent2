import React, { Component } from "react";
import MyJobsSlider from "./MyJobsSlider/MyJobsSlider";
import MyJobsExpanded from "./MyJobsExpanded/MyJobsExpanded";
import ContractSlider from '../MyContractsCarousel/MyContractsSlider/ContractSlider'
import MyContractsCarousel from '../MyContractsCarousel/MyContractsCarousel'
import { Transition } from "semantic-ui-react";
class MyJobsCarousel extends Component {
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
    selectedJob: {},
    myJobs: [],
    subscribeButtonLoading: false,
    expandedLoading: false,
    projectsHovered:false,
    contractsHovered: false,
    projectsSelected: true,
    contractsSelected: false
  };

  toggleLockInHover = () => {
    this.setState({ lockInHover: true });
  };

  handleShowExpanded = async draft => {
    this.setState({ expandedLoading: true });

    let draftUserId = draft.id;
    let draftId = draftUserId.split("_")[0];

    let newTask = await this.props.selectDraftToEdit(draftId);
    console.log({ newTask });
    this.setState({ selectedJob: this.props.draft, showExpanded: true });
    this.setState({ expandedLoading: false });
  };

  handleClose = () => {
    this.setState({ showExpanded: false, lockInHover: false });
  };

  async componentDidMount() {
    const { myJobs } = this.props;

    if (myJobs && myJobs.length > 0) {
      this.setState({ myJobs: myJobs, selectedJob: this.props.draft });
    }
  }



  render() {
    const { myJobs, selectDraftToEdit, scrollToMyRef,
    

      compactDisplayMode,
      COMPACT_ITEM_HEIGHT,
      COMPACT_ITEM_WIDTH,
      REGULAR_ITEM_HEIGHT,
      REGULAR_ITEM_WIDTH
    
    } = this.props;
    const {projectsHovered, projectsSelected, contractsHovered, contractsSelected} = this.state
    return (
      <div style={{  marginTop: compactDisplayMode ? 0: 30 }}>
        <p
        onMouseEnter={()=>this.setState({projectsHovered:true})}
        onMouseLeave={()=>this.setState({projectsHovered:false})}
        onClick={()=>this.setState({projectsSelected:true, contractsSelected:false})}
          style={{
            display: "inline-block",
            color: projectsSelected? "orange" : "white",
            fontSize: compactDisplayMode ? 14 : 26,
            opacity: (projectsHovered ||projectsSelected)? 
            1:0.4,
           margin: 5,
            marginRight: 20
          }}
        >
          My Projects
        </p>
        <p
        onClick={()=>this.setState({contractsSelected:true, projectsSelected:false})}
             onMouseEnter={()=>this.setState({contractsHovered:true})}
             onMouseLeave={()=>this.setState({contractsHovered:false})}
          style={{
            display: "inline-block",
            color: contractsSelected? "orange" : "white",
            opacity: (contractsHovered||contractsSelected) ? 
            1:0.4,
            fontSize: compactDisplayMode ? 14 : 26,
            margin: 5
          }}
        >
          My Contracts
        </p>


   {projectsSelected ?       <div> <MyJobsSlider


scrollToMyRef={scrollToMyRef}
handleShowExpanded={this.handleShowExpanded}
toggleLockInHover={this.toggleLockInHover}

myJobs={myJobs}
selectDraftToEdit={selectDraftToEdit}
compactDisplayMode={compactDisplayMode}
REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}
/>

<Transition.Group animation="scale" duration={400}>
{(this.state.showExpanded || this.state.expandedLoading) && (
  <MyJobsExpanded

    selectedJob={this.state.selectedJob.value}
    selectedJobId={this.state.selectedJob.key}
    handleViewQuote={this.props.handleViewQuote}
    handleNewChat={this.props.handleNewChat}
    handleClose={this.handleClose}
    handleEditDraft={this.props.handleEditDraft}
    handlePostJob={this.props.handlePostJob}
    loading={this.props.loading}

    expandedLoading={this.state.expandedLoading}
    pauseButtonLoading={this.props.pauseButtonLoading}
  />
)}
</Transition.Group>
</div> : 


<MyContractsCarousel  scrollToMyRef={this.props.scrollToMyRef} myContracts={this.props.myContracts}/>

}

      </div>
    );
  }
}

export default MyJobsCarousel;
