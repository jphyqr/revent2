import React, { Component } from "react";
import { Grid, Responsive, Sticky, Button, Segment, Container , Image, Loader,Popup, Transition} from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { connect } from "react-redux";
import JobMap from "./JobMap";
import SupplierDashboard from './SupplierDashboard/SupplierDashboard'
import RightSidebar from './RightSidebar/RightSidebar'
import JobList from "../JobList/JobList";
import { getJobsForDashboard, getAllJobsForDashboard } from "../jobActions";
import { deleteJobDraft, hideHowToPost } from "../../user/userActions";
import { selectDraftToEdit } from "../../build/draftActions";
import { selectQuoteToEdit } from "../../modals/QuoteJobModal/quoteActions";
import { firestoreConnect, isLoaded } from "react-redux-firebase"; //even though we using firestore this gives our binding
import { openModal } from "../../modals/modalActions";
import OpenJobsSlider from "./OpenJobsSlider/OpenJobsSlider";
import OpenJobExpanded from "./OpenJobExpanded"
import LabourList from './Labour/LabourList/LabourList'
import Post from './Post/Post'
import StatsDashboard from './Stats/StatsDashboard'
import MarketDashboard from './Market/MarketDashboard/MarketDashboard'
import Profile from './RightSidebar/Profile'
import NavBar from '../NavBar'

import SupportersContainer from "./Supporters/SupportersContainer";

const query = ({ auth }) => {
  const authenticated = auth.isLoaded && !auth.isEmpty;
  if (authenticated) {
    return [
      {
        collection: "job_attendee",
        where: [["userUid", "==", `${auth.uid}`]],
        storeAs: "jobs_attended"
      },
      {
        collection: "users",
        doc: auth.uid,
        subcollections: [{ collection: "quotes" }],
        storeAs: "my_quotes"
      }
    ];
  } else {
    return [
      {
        collection: "job_attendee",
        where: [["userUid", "==", `${auth.uid}`]],
        storeAs: "jobs_attended"
      }
    ];
  }
};

const mapState = state => ({
  jobs: state.jobs,
  loading: state.async.loading,
  auth: state.firebase.auth,
  role: state.role,
  notifications: state.notifications,
  myJobs: state.firestore.ordered.jobs_attended || {},
  selectedJob: state.draft && state.draft.value,
  myQuotes: state.firestore.ordered.my_quotes ||{},
   authenticated:  (state.firebase.auth.isLoaded && !state.firebase.auth.isEmpty)
});

const actions = {
  getJobsForDashboard,
  deleteJobDraft,
  selectDraftToEdit,
  openModal,
  selectQuoteToEdit,
  getAllJobsForDashboard,
  hideHowToPost
};

class JobDashboard extends Component {
  state = {
    moreJobs: false,
    loadingInitial: true,
    loadedJobs: [],
    contextRef: {},
    scrollToId: "",
    hoveredJobId: "",
    showExpanded: false,
    selectedJob: {},
    selectedJobId: "",
    myQuotes: [],
    quotesLoading: false,
    navShow: "post",
    jobs: []
  };

  handleSelectTab = tab =>{
    const {auth} = this.props
    const authenticated = auth.isLoaded && !auth.isEmpty;
    if((tab==="stats"||tab==="profile" ||tab==="supporters")&&!authenticated)
     {
      this.props.openModal("RegisterModal")
    }else{
      this.setState({navShow:tab, showExpanded:false})
    }
   
  }



  handleSelectOpenJob = async job => {
    const {auth} = this.props
    const authenticated = auth.isLoaded && !auth.isEmpty;
   if(!authenticated){
     this.props.openModal("RegisterModal")
   } else {

   
    this.setState({ quotesLoading: true });
    await this.props.selectDraftToEdit(job.id);
    await this.setState({
      showExpanded: true,
      selectedJob: this.props.selectedJob,
      selectedJobId: job.id,
      navShow: ''
    });
    this.setState({ quotesLoading: false });
  }
  };
  handleHoverJob = (isHovered, jobId) => {
    if(isHovered){
      this.setState({ hoveredJobId: jobId })}
      else{
        this.setState({ hoveredJobId: "" })
      };
  };

  async componentDidMount() {
    this.setState({ quotesLoading: true, jobs: this.props.jobs });
    await this.props.getAllJobsForDashboard() // this.props.getJobsForDashboard();

    // if (next && next.docs && next.docs.length > 1) {
    //   this.setState({
    //     moreJobs: true,
    //     loadingInitial: false
    //   });
    // }
    this.setState({ quotesLoading: false });
  }

  componentWillReceiveProps = async (nextProps)=> {
 console.log('DASHBOARD RECEIVED PROPS')
    if (this.state.jobs !== nextProps.jobs) {
      console.log('JOBS NOT EQUAL')
      this.setState({ quotesLoading: true, ownerProfileLoading: true, jobs: nextProps.jobs });
      this.setState({
        loadedJobs: [...this.state.loadedJobs, ...nextProps.jobs],
          myQuotes: nextProps.myQuotes ||{}
      });
      this.setState({ quotesLoading: false });
    }
  }
  handleDelete = job => {
    this.setState({ render: "false" });
    this.props.deleteJobDraft(job);
    this.setState({ render: "true" });
  };
  getNextJobs = async () => {
    const { jobs } = this.props;
    let lastJob = jobs && jobs[jobs.length - 1];

    let next = await this.props.getJobsForDashboard(lastJob);

    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreJobs: false
      });
    }
  };

  handleMapItemClick = id => {
    this.setState({
      scrollToId: id
    });
  };

  handleContextRef = contextRef =>
    this.setState({
      contextRef
    });
    

  render() {
    const { role, notifications, compactDisplayMode, CUSTOM_TABLET_CUTOFF, COMPACT_ITEM_HEIGHT,COMPACT_ITEM_WIDTH,REGULAR_ITEM_HEIGHT,REGULAR_ITEM_WIDTH, loading, selectQuoteToEdit, auth,  authenticated, } = this.props ||{};
    const { moreJobs, loadedJobs, myQuotes, jobs } = this.state;

    const {hideHowToPost} = notifications || {}


    return (
  
      <div>
{/* 

       {(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? <p>IN DEV</p>: <p>IN PROD</p> }  */}
          <p style={{ color: "white", fontSize: compactDisplayMode ? 14 : 26, margin:5 }}>Open Jobs</p>
        <OpenJobsSlider
        role={role}
           myQuotes={myQuotes}
          handleSelectOpenJob={this.handleSelectOpenJob}
          handleHoverJob={this.handleHoverJob}
          jobs={jobs}

          compactDisplayMode={compactDisplayMode}
          COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}
          COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
          REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
          REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
        />


<Responsive   minWidth={1} >






          
<div style={{ minHeight: compactDisplayMode? "300px":  "500px" }}>
          <Grid style={{margin:0}}>
            <Grid.Row >
              <Grid.Column width={3} only='computer'>
              <div style={{width:"100%"}}>

               <Image  style={{maxHeight:"475px",marginLeft:"auto",  marginTop:"60px", marginRight:"auto", display:"block"}}src="/assets/ad5.png"/>
            
               </div>
              </Grid.Column>
             
              <Grid.Column style={{padding:0}}mobile={16} tablet={16} computer={10} >
              <div style={{ paddingTop:10, width:'100%',}}>
            {(!this.props.authenticated || (!this.props.notifications.hideHowToPost)) && 
           <div> {this.props.authenticated&&<Button onClick={()=>this.props.hideHowToPost()}>Hide</Button>}
            <video controls
            style={{ display:'block', marginLeft:"auto", marginRight:"auto", width: compactDisplayMode? "100%": "50%", padding:0, }}
            // autoPlay
             poster={'https://firebasestorage.googleapis.com/v0/b/revents-99d5b.appspot.com/o/IMG-0384.JPG?alt=media&token=7557d850-71cb-417b-8518-1badb8e732ab'}
             id="myVideo"
            
             
           >
             <source src={'https://firebasestorage.googleapis.com/v0/b/revents-99d5b.appspot.com/o/IMG-0296.TRIM.MOV?alt=media&token=0950949d-9d48-4279-b622-85f91084c46d'} type="video/mp4" />
           </video>
           </div>
           }

           </div>


              <NavBar compactDisplayMode={compactDisplayMode} role={role} handleSelectTab={this.handleSelectTab} navShow={this.state.navShow}/>
           {this.state.loading ?  <Loader active inline='centered' /> :
                this.state.showExpanded ? (
                  <OpenJobExpanded
                    ownerProfileLoading={this.state.ownerProfileLoading}
                    quotesLoading={this.state.quotesLoading}
                    selectQuoteToEdit={selectQuoteToEdit}
                    selectedJobId={this.state.selectedJobId}
                    myQuotes={myQuotes}
                    compactDisplayMode={compactDisplayMode}
                    openModal={this.props.openModal}
                    role={this.props.role}
                    selectedJob={this.state.selectedJob}
                  />
                ) :(this.state.navShow==="post")?
                <Transition.Group animation='scale' duration={2000} visible={(this.state.navShow==="post")}>
                <Post compactDisplayMode={compactDisplayMode}/>
             </Transition.Group>

                :
                 (this.state.navShow==="profile") ? 

                <Transition.Group animation='scale' duration={2000} visible={(this.state.navShow==="profile")}>
                 <Profile compactDisplayMode={compactDisplayMode}/>
              </Transition.Group>

:(this.state.navShow==="market") ?
<Transition.Group animation='scale' duration={2000} visible={(this.state.navShow==="profile")}>
<MarketDashboard/>
</Transition.Group>
               
                : 
                (this.state.navShow==="stats") ?
                <Transition.Group animation='scale' duration={2000} visible={(this.state.navShow==="profile")}>
                <StatsDashboard/>
             </Transition.Group>
                :
                
                
                
                (this.state.navShow==="labour") ?
                <Transition.Group animation='scale' duration={2000} visible={(this.state.navShow==="profile")}>
                <LabourList compactDisplayMode/>
             </Transition.Group>
                :

                (this.state.navShow==="supplier") ?
                <Transition.Group animation='scale' duration={2000} visible={(this.state.navShow==="supplier")}>
                <SupplierDashboard compactDisplayMode={compactDisplayMode}/>
             </Transition.Group>
                :
                
                (this.state.navShow==="supporters") ? 
                <Transition.Group animation='scale' duration={2000} visible={(this.state.navShow==="supporters")}>
                <SupportersContainer/>
             </Transition.Group>
                :
                (
                  <Transition.Group animation='scale' duration={2000} visible={(this.state.navShow==="map")}>
                  <JobMap
                    compactDisplayMode={compactDisplayMode}
                    hoveredJobId={this.state.hoveredJobId}
                    jobs={jobs}
                    lat={50.44}
                    lng={-104.61}
                    handleMapItemClick={this.handleMapItemClick}
                  />
                      </Transition.Group>
                )}
   
              </Grid.Column>
              <Grid.Column width={3} only='computer'>
              <div style={{width:"100%"}}>

               <Image  style={{maxHeight:"475px",marginLeft:"auto",  marginTop:"60px", marginRight:"auto", display:"block"}}src="/assets/ad5.png"/>
            
               </div>
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </div>
          </Responsive> 




      </div>
   
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(JobDashboard));
