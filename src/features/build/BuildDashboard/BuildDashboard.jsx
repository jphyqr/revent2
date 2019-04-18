import React, { Component } from "react";
import BuildDetail from "./BuildDetail/BuildDetail";
import { Grid, Container, Responsive } from "semantic-ui-react";
import JobDashboard from "../../job/JobDashboard/JobDashboard";
import LogDashboard from "./LogDashboard/LogDashboard";

class BuildDashboard extends Component {
  state = {
    showJobs: true
  };
  handleOnUpdate = (e, { width }) => this.setState({ width });
  handleClickShowJobs = () => {
    console.log("show jobs");
    this.setState({ showJobs: true });
  };

  handleClickShowLogs = () => {
    console.log("show logs");
    this.setState({ showJobs: false });
  };
  render() {
    const { width } = this.state;
    const CUSTOM_TABLET_CUTOFF = 800;
    const COMPACT_ITEM_HEIGHT = 125;
    const COMPACT_ITEM_WIDTH = 110;
    const REGULAR_ITEM_HEIGHT = 150;
    const REGULAR_ITEM_WIDTH = 300;
    const REGULAR_EXCLUSIVE_HEIGHT = 400;
    const REGULAR_EXCLUSIVE_WIDTH = 300;
    const COMPACT_EXCLUSIVE_HEIGHT = 200;
    const COMPACT_EXCLUSIVE_WIDTH = 110;
    const compactDisplayMode = width >= CUSTOM_TABLET_CUTOFF ? false : true;
    return (
      <Responsive fireOnMount onUpdate={this.handleOnUpdate}>
        <div style={{paddingTop: compactDisplayMode?0:10}}>
          <div style={{ height: "600" }}>
            {this.state.showJobs ? (
              <JobDashboard
                compactDisplayMode={compactDisplayMode}
                REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
                REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
                COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
                COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}
                CUSTOM_TABLET_CUTOFF={CUSTOM_TABLET_CUTOFF}
                handleClickShowLogs={this.handleClickShowLogs}
              />
            ) : (
              <LogDashboard handleClickShowJobs={this.handleClickShowJobs} />
            )}
          </div>
          <BuildDetail
            REGULAR_EXCLUSIVE_HEIGHT={REGULAR_EXCLUSIVE_HEIGHT}
            REGULAR_EXCLUSIVE_WIDTH={REGULAR_EXCLUSIVE_WIDTH}
            COMPACT_EXCLUSIVE_HEIGHT={COMPACT_EXCLUSIVE_HEIGHT}
            COMPACT_EXCLUSIVE_WIDTH={COMPACT_EXCLUSIVE_WIDTH}
            compactDisplayMode={compactDisplayMode}
            REGULAR_ITEM_WIDTH={REGULAR_ITEM_WIDTH}
            REGULAR_ITEM_HEIGHT={REGULAR_ITEM_HEIGHT}
            COMPACT_ITEM_WIDTH={COMPACT_ITEM_WIDTH}
            COMPACT_ITEM_HEIGHT={COMPACT_ITEM_HEIGHT}
            CUSTOM_TABLET_CUTOFF={CUSTOM_TABLET_CUTOFF}
            handleClickShowLogs={this.handleClickShowLogs}
          />
        </div>
      </Responsive>
    );
  }
}

export default BuildDashboard;
