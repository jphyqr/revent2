import React, { Component } from "react";
import { Container, Segment, Button, Label , Feed} from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";
import NavBar from "../../features/nav/NavBar/NavBar";
import JobForm from "../../features/job/JobForm/JobForm";
import SettingsDashboard from "../../features/user/Settings/SettingsDashboard";
import JobDashboard from "../../features/job/JobDashboard/JobDashboard";
import UserDetailedPage from "../../features/user/UserDetailed/UserDetailedPage";
import UserDirectMessagePage from "../../features/user/UserDetailed/UserDirectMessagePage";
import PeopleDashboard from "../../features/user/PeopleDashboard/PeopleDashboard";
import JobDetailedPage from "../../features/job/JobDetailed/JobDetailedPage";
import MessageDashboard from "../../features/user/MessageDashboard/MessageDashboard";
import HomePage from "../../features/home/HomePage";
import TestComponent from "../../features/testarea/TestComponent";
import ModalManager from "../../features/modals/ModalManager";
import OpenMessage from "../../features/nav/NavBar/Messages/OpenMessage/OpenMessage";
import { connect } from "react-redux";
import { closeMessage } from "../../features/popup/popupActions";
import {withRouter} from 'react-router-dom'
import PopupContainer from '../../features/popup/PopupContainer/PopupContainer'
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
  
  renderChats = (openMessage, index) => {
    const calcRight = index*(BORDER+WIDTH)
    return (<div
      style={{
        width: WIDTH,
        height: HEIGHT,
        right: calcRight,
        position: "fixed",
        bottom: BOTTOM,
        zIndex: 100+100*index
      }}
    >
    <PopupContainer width={WIDTH} height={HEIGHT} right={calcRight}  bottom={BOTTOM} message={openMessage}/>
  

  
    </div>)
  }
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

              <Container className="main">
                <Switch>
                  <Route path="/jobs" component={JobDashboard} />
                  <Route path="/test" component={TestComponent} />
                  <Route path="/people" component={PeopleDashboard} />
                  <Route path="/profile/:id" component={UserDetailedPage} />
                  <Route
                    path="/directmessage/:id"
                    component={UserDirectMessagePage}
                  />
                  <Route path="/settings" component={SettingsDashboard} />
                  <Route path="/createJob" component={JobForm} />
                  <Route path="/job/:id" component={JobDetailedPage} />
                  <Route path="/managejob/:id" component={JobForm} />
                  <Route path="/messages" component={MessageDashboard} />
                </Switch>
              </Container>
              {openMessages &&
                openMessages.map((openMessage,index) => (
                    this.renderChats(openMessage, index)
                  
                ))}
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(connect(
  mapState,
  actions
)(App));

//export default App