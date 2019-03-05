import React, { Component } from "react";
import BuildDetail from "./BuildDetail/BuildDetail";
import { Grid , Container} from "semantic-ui-react";
import JobDashboard from '../../job/JobDashboard/JobDashboard'
import LogDashboard from './LogDashboard/LogDashboard'
class BuildDashboard extends Component {

  state={
    showJobs:true
  }

  handleClickShowJobs = () => {
    console.log('show jobs')
  this.setState({showJobs:true})
  }

  handleClickShowLogs = () => {
    console.log('show logs')
  this.setState({showJobs:false})
  }
  render() {
    return (
      <div >
       
       <div style={{height:'600'}}>
        {this.state.showJobs?  <JobDashboard handleClickShowLogs={this.handleClickShowLogs} />: <LogDashboard  handleClickShowJobs={this.handleClickShowJobs}/> }
        </div>       
          <BuildDetail />
          </div>
    );
  }
}

export default BuildDashboard;
