import React, { Component } from "react";
import {selectDraftToEdit, postToggle} from '../../build/draftActions'
import {openModal} from '../../modals/modalActions'
import {connect} from 'react-redux'

const actions = {
    selectDraftToEdit, postToggle, openModal
}
class MyJobs extends Component {
  handleDelete = jobId => {
    this.setState({ deleted: false });
    this.props.handleDelete(jobId);
    this.setState({ deleted: true });
  };


 postJob = async (posted, jobId) =>{
    console.log("post job", jobId)
   await this.props.postToggle(posted, jobId)
}

handleEdit = async jobId =>{
    console.log(jobId)
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
              <div
                style={{
                  position: "relative",
                  width: "max",
                  height: 40,
                  backgroundColor: "WhiteSmoke",
                  margin: 0,
                  marginBottom: 8,
                  padding: 0,
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                }}
              >
                <div
                  onClick={() => this.handleDelete(job.jobId)}
                  style={{
                    position: "absolute",
                    fontSize: 14,
                    color: "grey",
                    right: 5,
                    top: 5
                  }}
                >
                  x
                </div>
                  
                <div
                  style={{
                    position: "absolute",
                    fontSize: 14,
                    fontStyle: "italic",
                    color: "grey",
                    width: "100%",
                    left: 5,
                    top: 15
                  }}
                >
                
                    <label>
                      {job.title} : {job.jobTypeId}
                    </label>
                
                </div>
                <div style={{position:"absolute", right:50, top:"40%"}}>
                  {job.inDraft && (
                    <label onClick={()=>this.handleEdit(job.jobId)}style={{ background: "white", color:"", width: "90" }}>
                      {" "}
                      edit draft{" "}
                    </label>
                  )}
                </div>
                <div style={{position:"absolute", right:110, top:"40%"}}>
                  {(job.inDraft) ? (
                    <label onClick={()=>this.postJob(true, job.jobId)}style={{ background: "white", color:"", width: "90" }}>
                      {" "}
                      post job{" "}
                    </label>
                  ):
                  <label onClick={()=>this.postJob(false, job.jobId)}style={{ background: "white", color:"", width: "90" }}>
                  {" "}
                  pause job
                </label>
                
                }
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default connect(null, actions)(MyJobs);
