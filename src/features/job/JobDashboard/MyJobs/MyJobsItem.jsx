import React, { Component } from 'react'

export default class MyJobsItem extends Component {
  render() {
      const {job} = this.props
    return (
        <div
        style={{
          position: "relative",
          width: "max",
          minHeight: 40,
          backgroundColor: "WhiteSmoke",
          margin: 0,
          marginBottom: 8,
          padding: 0,
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        }}
      >
        <div
          onClick={() => this.props.handleDelete(job)}
          style={{
            position: "absolute",
            cursor:"pointer",
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
            top: 5
          }}
        >
        
            <label>
              {job.title} : {job.taskValue}
            </label>
        
        </div>
        <div style={{position:"absolute", right:"25%", top:"40%"}}>
          {job.inDraft && (
            <label onClick={()=>this.props.handleEdit(job.jobId)}style={{ background: "white", color:"", width: "90" }}>
              {" "}
              edit draft{" "}
            </label>
          )}
        </div>
        <div style={{position:"absolute", right:"50%", top:"40%"}}>
          {(job.inDraft) ? (
            <label onClick={()=>this.props.postJob(true, job.jobId)}style={{ background: "white", color:"", width: "90" }}>
              {" "}
              post job{" "}
            </label>
          ):
          <label onClick={()=>this.props.postJob(false, job.jobId)}style={{ background: "white", color:"", width: "90" }}>
          {" "}
          pause job
        </label>
        
        }
        </div>
      </div>
    )
  }
}
