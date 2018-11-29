import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';
import NavBar from '../../features/nav/NavBar/NavBar';
import JobForm from '../../features/job/JobForm/JobForm'
import SettingsDashboard from '../../features/user/Settings/SettingsDashboard';
import JobDashboard from '../../features/job/JobDashboard/JobDashboard';
import UserDetailedPage from '../../features/user/UserDetailed/UserDetailedPage';
import UserDirectMessagePage from '../../features/user/UserDetailed/UserDirectMessagePage';
import PeopleDashboard from '../../features/user/PeopleDashboard/PeopleDashboard';
import JobDetailedPage from '../../features/job/JobDetailed/JobDetailedPage';
import MessageDashboard from '../../features/user/MessageDashboard/MessageDashboard'
import NewMessageDashboard from '../../features/message/NewMessageDashboard'
import HomePage from '../../features/home/HomePage';
import TestComponent from '../../features/testarea/TestComponent';
import ModalManager from '../../features/modals/ModalManager';

class App extends Component {
  render() {
    return (
      <div>
        <ModalManager/>
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
                  <Route path="/directmessage/:id" component={UserDirectMessagePage} />
                  <Route path="/settings" component={SettingsDashboard} />
                  <Route path="/createJob" component={JobForm} />
                  <Route path="/job/:id" component={JobDetailedPage} />
                  <Route path="/managejob/:id" component={JobForm} />
                  <Route path="/messages" component={MessageDashboard} />
                  <Route path="/newmessages" component={NewMessageDashboard}/>
                </Switch>
              </Container>
            </div>
          )}
        />
      </div>
    );
  }
}

export default App;
