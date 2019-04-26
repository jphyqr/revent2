import React, { Component } from 'react'
import { Grid, Responsive } from "semantic-ui-react";
import { Switch, Route, Redirect } from "react-router-dom";
import SettingsNav from "./SettingsNav";
import AboutPage from "./AboutPage";
import PhotosPage from "./PhotosPage";
import AccountPage from "./AccountPage";
import BasicPage from "./BasicPage";
import { connect } from "react-redux";
import { updatePassword } from "../../auth/authActions";
import {updateProfile} from '../userActions'

const actions = {
  updatePassword,
  updateProfile
};


const mapState =(state) =>({
  providerId: state.firebase.auth.providerData[0].providerId,
  user: state.firebase.profile
})




 class SettingsDashboard extends Component {

state={width:0}

  handleOnUpdate = (e, { width }) => this.setState({ width });

  render() {
    const { updatePassword, providerId, user, updateProfile } = this.props
       const {width} = this.state

    const CUSTOM_TABLET_CUTOFF = 800;
    const compactDisplayMode = width >= CUSTOM_TABLET_CUTOFF ? false : true;
    return (
      <Responsive fireOnMount onUpdate={this.handleOnUpdate}>
    
      {compactDisplayMode? 
         <div>

<SettingsNav compactDisplayMode={compactDisplayMode}/>
<Grid>
<Grid.Column width={16}>
        <Switch>
          <Redirect exact from="/settings" to="/settings/basic" />
          <Route path="/settings/basic" render={()=> <BasicPage updateProfile={updateProfile} initialValues={user}/>} />
          <Route path="/settings/about" render={()=> <AboutPage updateProfile={updateProfile} initialValues={user}/>} />
          <Route path="/settings/photos" component={PhotosPage} />
          <Route
            path="/settings/account"
            render={() => <AccountPage updatePassword={updatePassword} providerId={providerId}/>}
          />
        </Switch>
      </Grid.Column>
    

</Grid>
         </div> 
      :
      <Grid>
      <Grid.Column width={12}>
        <Switch>
          <Redirect exact from="/settings" to="/settings/basic" />
          <Route path="/settings/basic" render={()=> <BasicPage updateProfile={updateProfile} initialValues={user}/>} />
          <Route path="/settings/about" render={()=> <AboutPage updateProfile={updateProfile} initialValues={user}/>} />
          <Route path="/settings/photos" component={PhotosPage} />
          <Route
            path="/settings/account"
            render={() => <AccountPage updatePassword={updatePassword} providerId={providerId}/>}
          />
        </Switch>
      </Grid.Column>
      <Grid.Column width={4}>
        <SettingsNav />
      </Grid.Column> </Grid>}
   
    </Responsive>
    )
  }
}





export default connect(
  mapState,
  actions
)(SettingsDashboard);
