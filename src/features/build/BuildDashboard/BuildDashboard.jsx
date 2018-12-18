import React, { Component } from "react";
import BuildDetail from "./BuildDetail/BuildDetail";
import { Grid , Container} from "semantic-ui-react";
import JobDashboard from '../../job/JobDashboard/JobDashboard'
class BuildDashboard extends Component {
  render() {
    return (
      <div>
       
          <JobDashboard/>
    
          <BuildDetail />
          </div>
    );
  }
}

export default BuildDashboard;
