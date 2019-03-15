import React, { Component } from "react";
import BuildCarousel from "./BuildCarousel/BuildCarousel";
//import { categories } from "../../../../app/data/buildData";
import scrollToComponent from "react-scroll-to-component";
import {withFirestore, isLoaded} from 'react-redux-firebase'
import { firestoreConnect } from "react-redux-firebase"; //even though we using firestore this gives our binding
import {connect} from 'react-redux'
import LoadingComponent from '../../../../app/layout/LoadingComponent'
import MyJobsCarousel from './MyJobsCarousel/MyJobsCarousel'
import {selectDraftToEdit, postToggle} from '../../draftActions'
import {openModal} from '../../../modals/modalActions'
const query = ({ auth }) => {
  if (auth !== null){
  return [
    {
      collection: "job_attendee",
      where: [["userUid", "==", `${auth.uid}`]],
      storeAs: "jobs_attended"
    }
  ];
}};
const actions = {
  selectDraftToEdit, postToggle, openModal
}


const mapState = state => {


  return {
    auth:state.firebase.auth,
    categories: state.firestore.ordered.categories,
    loading: state.async.loading,
    myJobs: state.firestore.ordered.jobs_attended,
    draft: state.draft,
   
  };
};

class BuildDetail extends Component {



  async componentDidMount() {
    const { firestore } = this.props;
    await firestore.setListener(`categories`);
  }





   componentWillReceiveProps = nextProps =>{
   if(nextProps.draft !== this.state.draft)
   {
     this.setState({draft: nextProps.draft})
     console.log('updated draft State')
   }
 }

  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`categories`);
  }


  state = {
    contextRef: {},
    selectedJob: "",
    draft: {},
    pauseButtonLoading: false
  };

  handleEditDraft = async jobId =>{
  
    await this.props.selectDraftToEdit(jobId)
     this.props.openModal("CreateJobModal")
 }



 handlePostJob = async (posted, jobId) =>{
  await this.setState({pauseButtonLoading: true})
  await this.props.postToggle(posted, jobId)
  await this.setState({pauseButtonLoading: false})
}

  handleContextRef = contextRef =>
    this.setState({
      contextRef
    });

  scrollToMyRef = (eChild, category) => {
  
   

      scrollToComponent(eChild.currentTarget, {
        offset: -110,
        align: "top",
        duration: 600
      });
    
  };
  render() {
    const {categories,selectDraftToEdit, auth} = this.props
    const authenticated = auth.isLoaded && !auth.isEmpty;
    return (

      <div style={{marginTop:10}}>
       
       {authenticated&& <MyJobsCarousel  pauseButtonLoading={this.state.pauseButtonLoading} handlePostJob={this.handlePostJob} handleEditDraft={this.handleEditDraft} draft={this.state.draft} scrollToMyRef={this.scrollToMyRef} myJobs={this.props.myJobs} selectDraftToEdit={selectDraftToEdit}/>}

       {!isLoaded(categories)? <LoadingComponent/> : 
       categories &&
          categories.map(category => (
            <BuildCarousel
              key={category.id}
              category={category}
              scrollToMyRef={this.scrollToMyRef}
              handleContextRef={this.handleContextRef}
             
            />
          ))}
        
      </div>
    );
  }
}



export default connect(
  mapState,
  actions
)(firestoreConnect(props => query(props))(BuildDetail));
