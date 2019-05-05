import React, { Component } from 'react'
import {connect} from 'react-redux'
import {Header} from "semantic-ui-react"
import {getLabourForList} from './labourActions'
import LabourItem from './LabourItem'
import {newChatLabourer} from '../../../../user/userActions'
const mapState = (state) =>({
    labourers: state.labour ,
    role: state.role
})

const actions = {
    getLabourForList, newChatLabourer
    
}
 class LabourList extends Component {
     

    async componentDidMount(){
        await this.props.getLabourForList()

    }
  render() {
      const {labourers, newChatLabourer, compactDisplayMode} = this.props
    return (
      <div
      style={{
        width: "100%",
        height: compactDisplayMode?"300px": "500px",
        overflowX:"hidden", overflowY:"auto",
        backgroundColor: "lightgrey",
      //  margin: 10
        // position: "relative"
      }}
    >

   {(!compactDisplayMode)&& <Header as="h1">Looking for Work</Header>}
      <div  style={{ overflowY:"hidden",  whiteSpace: "nowrap", overflowX:"auto"}}>
        {labourers&&labourers.map(labourer=>(
            <LabourItem role={this.props.role} compactDisplayMode labourer={labourer} newChatLabourer={newChatLabourer}/>
        ))}
      </div>
      </div>
    )
  }
}

export default connect(mapState, actions)(LabourList)
