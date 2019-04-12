import React, { Component } from "react";
import { Container, Segment, Button, Label, Feed } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";
import NavBar from "../../features/nav/NavBar/NavBar";
import SettingsDashboard from "../../features/user/Settings/SettingsDashboard";
import JobDashboard from "../../features/job/JobDashboard/JobDashboard";
import BuildDashboard from "../../features/build/BuildDashboard/BuildDashboard";
import UserDetailedPage from "../../features/user/UserDetailed/UserDetailedPage";
import UserDirectMessagePage from "../../features/user/UserDetailed/UserDirectMessagePage";
import PeopleDashboard from "../../features/user/PeopleDashboard/PeopleDashboard";
import JobDetailedPage from "../../features/job/JobDetailed/JobDetailedPage";
import MessageDashboard from "../../features/user/MessageDashboard/MessageDashboard";
import TestScroll from "../../features/testarea/TestScroll";
import TestAnimations from "../../features/testarea/TestAnimations";

import HomePage from "../../features/home/HomePage";
import AboutAlpha from "../../features/nav/Alpha/AboutAlpha";
import JoinedAlpha from "../../features/nav/Alpha/JoinedAlpha";
import AboutDashboard from "../../features/nav/AboutDashboard/AboutDashboard";
import PricingDashboard from "../../features/nav/PricingDashboard/PricingDashboard";
import TestComponent from "../../features/testarea/TestComponent";
import ModalManager from "../../features/modals/ModalManager";
import { connect } from "react-redux";
import { closeMessage } from "../../features/popup/popupActions";
import { withRouter } from "react-router-dom";
import PopupContainer from "../../features/popup/PopupContainer/PopupContainer";
const RIGHT = 0;
const BOTTOM = 0;
const BORDER = 10;
const WIDTH = 300;
const HEIGHT = 350;

const mapState = state => ({
  openMessages: state.openMessages
});
const actions = {
  closeMessage
};

class App extends Component {
  state = {
    valuePropositionActive: true,
    pricingActive: false
  };

  handleSelectPricing = () => {
    this.setState({ valuePropositionActive: false, pricingActive: true });
  };

  handleSelectValueProposition = () => {
    this.setState({ valuePropositionActive: true, pricingActive: false });
  };
  renderChats = (openMessage, index) => {
    const calcRight = index * (BORDER + WIDTH);
    return (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          right: calcRight,
          position: "fixed",
          bottom: BOTTOM,
          zIndex: 100 + 100 * index
        }}
      >
        <PopupContainer
          closeMessage={this.props.closeMessage}
          width={WIDTH}
          height={HEIGHT}
          right={calcRight}
          bottom={BOTTOM}
          message={openMessage}
        />
      </div>
    );
  };
  render() {
    const { closeMessage, openMessages } = this.props;
    return (
      <div>
        <ModalManager />
        <Switch>
      
            <Route exact path="/" component={HomePage} />
       
          
    
        </Switch>

        <Route
          path="/(.+)"
          render={() => (
            <div>
              <NavBar />

              <Container
                style={{ width: "auto", marginTop: 64, background: "DimGrey" }}
                className="main"
              >
                <Switch>
                  <Route path="/jobs" component={JobDashboard} />
                  <Route path="/test" component={TestComponent} />
                  <Route path="/testAnimations" component={TestScroll} />
                  <Route path="/people" component={PeopleDashboard} />
                  <Route path="/build" component={BuildDashboard} />
                  <Route path="/alpha/about" component={AboutAlpha} />
                  <Route path="/alpha/joined" component={JoinedAlpha} />
                  <Route path="/about" component={AboutDashboard} />
                  <Route path="/pricing" component={PricingDashboard} />

                  <Route path="/profile/:id" component={UserDetailedPage} />
                  <Route
                    path="/directmessage/:id"
                    component={UserDirectMessagePage}
                  />
                  <Route path="/settings" component={SettingsDashboard} />
                  <Route path="/job/:id" component={JobDetailedPage} />
                  <Route path="/messages" component={MessageDashboard} />
                </Switch>
              </Container>
              {openMessages &&
                openMessages.map((openMessage, index) =>
                  this.renderChats(openMessage, index)
                )}
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapState,
    actions
  )(App)
);

//export default App
