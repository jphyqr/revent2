import React, { Component } from "react";
import BuildDetail from "./BuildDetail/BuildDetail";
import {
  Grid,
  Button,
  Container,
  Responsive,
  Message
} from "semantic-ui-react";
import JobDashboard from "../../job/JobDashboard/JobDashboard";
import LogDashboard from "./LogDashboard/LogDashboard";
import { firestoreConnect } from "react-redux-firebase"; //even though we using firestore this gives our binding
import { resendEmailVerificationLink } from "../../user/userActions";
import { connect } from "react-redux";

const actions = {
  resendEmailVerificationLink
};

const mapState = state => {
  return {
    role: state.role,
    verified: state.firebase.auth.emailVerified,
    loading: state.async.loading
  };
};
class BuildDashboard extends Component {
  state = {
    showJobs: true,
    verified: false
  };
  handleOnUpdate = (e, { width }) => this.setState({ width });
  handleClickShowJobs = () => {
    console.log("show jobs");
    this.setState({ showJobs: true });
  };

  async componentDidMount() {
    const { firestore } = this.props;
    await firestore.setListener(`auth`);
    if (this.state.verified !== this.props.verified)
      this.setState({ verified: this.props.verified });
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.verified !== this.state.verified) {
      this.setState({ verified: nextProps.verified });
    }
  };

  handleClickShowLogs = () => {
    console.log("show logs");
    this.setState({ showJobs: false });
  };
  render() {
    const { role, loading } = this.props || {};
    const { authenticated } = role || {};
    const { width, verified } = this.state;
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
        <div style={{ paddingTop: compactDisplayMode ? 10 : 40 }}>
          {authenticated && !verified ? (
            <div style={{ height: "600", margin: 20, paddingBottom: 400 }}>
              <Message
                warning
                header="You must Verify your e-mail!"
                content="Check your email for a link sent from us!"
              />

              <Button
                loading={loading}
                onClick={() => this.props.resendEmailVerificationLink()}
                primary
              >
                Resend Verification Link
              </Button>
            </div>
          ) : (
            <div>
              {" "}
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
                  <LogDashboard
                    handleClickShowJobs={this.handleClickShowJobs}
                  />
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
          )}
        </div>
      </Responsive>
    );
  }
}

export default connect(
  mapState,
  actions
)(firestoreConnect()(BuildDashboard));
