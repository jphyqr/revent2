import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Header} from "semantic-ui-react"
import {getLabourForList} from './labourActions'
import LabourItem from './LabourItem'
import {newChatLabourer} from '../../../../user/userActions'
const mapState = (state) =>({
    labourers: state.labour 
})

const actions = {
    getLabourForList, newChatLabourer
    
}
 class LabourList extends Component {
     

    async componentDidMount(){
        await this.props.getLabourForList()

    }
  render() {
      const {labourers, newChatLabourer} = this.props
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

    <Header as="h1">Looking for Work</Header>
      <div  style={{minHeight:"490", overflowY:"hidden",  whiteSpace: "nowrap", overflowX:"auto"}}>
        {labourers&&labourers.map(labourer=>(
            <LabourItem labourer={labourer} newChatLabourer={newChatLabourer}/>
        ))}
      </div>
      </div>
    )
  }
}

export default connect(mapState, actions)(LabourList)
