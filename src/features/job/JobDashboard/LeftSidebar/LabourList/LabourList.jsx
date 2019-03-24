import React, { Component } from 'react'
import {connect} from 'react-redux'
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
      <div  style={{minHeight:"490"}}>
        {labourers&&labourers.map(labourer=>(
            <LabourItem labourer={labourer} newChatLabourer={newChatLabourer}/>
        ))}
      </div>
    )
  }
}

export default connect(mapState, actions)(LabourList)
