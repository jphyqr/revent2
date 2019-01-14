import React, { Component } from "react";
import {selectDraftToEdit, postToggle} from '../../../build/draftActions'
import {openModal} from '../../../modals/modalActions'
import {connect} from 'react-redux'
import MyJobsItem from './MyJobsItem'

const actions = {
    selectDraftToEdit, postToggle, openModal
}
class MyJobs extends Component {
  handleDelete = job => {
    this.setState({ deleted: false });
    this.props.handleDelete(job);
    this.setState({ deleted: true });
  };


 postJob = async (posted, jobId) =>{
   
   await this.props.postToggle(posted, jobId)
}

handleEdit = async jobId =>{
  
   await this.props.selectDraftToEdit(jobId)
    this.props.openModal("CreateJobModal")
}



  render() {
    const { myJobs } = this.props;
    return (
      <div>
        <div
          style={{
            width: "100%",
            padding: 0,
            backgroundColor: "grey",
            position: "absolute",
            top: 0
          }}
        >
          <label style={{ fontSize: 16 }}>My Jobs </label>
        </div>
        <div
          style={{
            marginTop: 25,
            maxHeight: 475,
            padding: 5,
            minHeight: 475,
            position: "relative",
            overflowY: "auto"
          }}
        >
          {myJobs &&
            myJobs.map(job => (
              <MyJobsItem job={job}
              key={job.created}
              handleDelete={this.handleDelete}
              handleEdit={this.handleEdit}
              postJob = {this.postJob}
              />
            ))}
        </div>
      </div>
    );
  }
}

export default connect(null, actions)(MyJobs);
