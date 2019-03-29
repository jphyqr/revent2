import React, { Component } from 'react'

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase"; //even though we using firestore this gives our binding
import {Grid, Header, Divider, Label} from 'semantic-ui-react'
import {objectToArray} from '../../../../app/common/util/helpers'
const mapState = state => ({

    auth: state.firebase.auth,
    salesTeam: state.firestore.ordered.sales_team || {},

  });

const query = ({ auth }) => {
   
    
      return [
        {
          collection: "sales_team",
          
          storeAs: "sales_team"
        }
      ];
   
  };
 class StatsDashboard extends Component {
  render() {
      const {salesTeam} = this.props
      const salesTeamArray = objectToArray(salesTeam)
      let teamTotal=0
      for(var i=0; i<(salesTeamArray&&salesTeamArray.length); i++){
       teamTotal=teamTotal+salesTeamArray[i].count
      }
      console.log({salesTeamArray})
    return (
        <div
        style={{
          width: "100%",
          height: "500px",
          backgroundColor: "lightgrey",
          margin: 10
          // position: "relative"
        }}
      >

      <Grid centered columns={3}>
        <Grid.Column>
        <Header color="orange" as="h1">TEAM GOAL FRIDAY: 500</Header>
        </Grid.Column>
        <Grid.Column>
        <Header color="green" as="h1">TEAM TOTAL: {teamTotal}</Header>
            </Grid.Column>
            <Grid.Column>
            <Header color="red" as="h1">REMAINING: {500-teamTotal}</Header>  
            </Grid.Column>
        
      </Grid>
      <Divider></Divider>
      <Header  style={{width:"100%", textAlign:"center"}}color="green" as="h1">$50 BONUS EACH</Header>
      <Divider></Divider>
        <Grid centered columns={salesTeamArray&&salesTeamArray.length}> 

                {salesTeamArray&&salesTeamArray.map(salesmen=>(
        <Grid.Column >
            <Header as="h3">{salesmen.name}({salesmen.count})</Header>
               
                    <Divider/>
                    <div style={{width:"100%", maxHeight:"250px", overflowY:"auto", overflowX:"hidden" }}>
                    {salesmen.email_list&&salesmen.email_list.map(email=>(
                        <Label>{email}</Label>
                    ))}
                    </div>
        </Grid.Column> 
                
                ))}



    
      </Grid>
      </div>
    )
  }
}


export default connect(
    mapState,
    null
  )(firestoreConnect(props => query(props))(StatsDashboard));
  