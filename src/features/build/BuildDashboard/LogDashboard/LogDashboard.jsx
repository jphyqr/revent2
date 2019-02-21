import React, { Component } from 'react'
import {Button, Menu, Input} from 'semantic-ui-react'
import BugsDashboard from './BugsDashboard/BugsDashboard'
import JournalDashboard from './JournalDashboard/JournalDashboard'
import FeaturesDashboard from './FeaturesDashboard/FeaturesDashboard'
import {connect} from 'react-redux'
import {addJournalEntry} from './logActions'

const mapState = state => ({



});

const actions = {
  addJournalEntry
};


 class LogDashboard extends Component {
     state={
         activeItem:'journal'
     }
     handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
      const {activeItem} = this.state
    return (
        <div style={{ backgroundColor:"whiteSmoke", minHeight: '510px', width: '100%' }}>
       {/* <Button onClick={()=>this.props.handleClickShowJobs()}>Dashboard</Button> */}
     <Menu secondary>
     <Menu.Menu position='left'>

          <Menu.Item
            name='Show Jobs'
            active={activeItem === 'Show Jobs'}
            onClick={()=>this.props.handleClickShowJobs()}
          />
        </Menu.Menu>
        <Menu.Item
          name='journal'
          active={activeItem === 'journal'}
          onClick={this.handleItemClick}
        />
        <Menu.Item name='bugs' active={activeItem === 'bugs'} onClick={this.handleItemClick} />

        <Menu.Item
          name='features'
          active={activeItem === 'features'}
          onClick={this.handleItemClick}
        />
     <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>

        </Menu.Menu>
      </Menu>

      <div style={{ width:'100%', height:'400px', overflowY:'none', backgroundColor:'lightgrey'}}>
        {activeItem === 'bugs'? <BugsDashboard/>  : activeItem ==='journal' ? <JournalDashboard addJournalEntry={this.props.addJournalEntry}/> : activeItem === 'feautures' ? <FeaturesDashboard/> : null }
      </div>
      </div>
    )
  }
}


export default  connect(mapState, actions)(LogDashboard)

