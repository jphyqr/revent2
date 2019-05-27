import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import {Button} from 'semantic-ui-react'


const query = ({ auth, selectedIsle }) => {
    return [
        {
            collection: "items",
            where: [["supplierUid", "==", `${auth.uid}`]],
            orderBy: ["name", "asc"],
            storeAs: "items_for_user",
            
          }
    ];
  };

  const mapState = state => {
  
    return {
        itemsForUser : state.firestore.ordered.items_for_user
    };
  };

 class MyItems extends Component {
    render() {
        const {itemsForUser} = this.props || []
        return (
            <div style={{ backgroundColor:"blue", width:"100%", height:100, overflowX:"hidden", overflowY:"auto"}}>
                {itemsForUser&&itemsForUser.map(item=>(

                    <div style={{width:"100%", backgroundColor:"green", color:"white"}}>
                    <Button size='mini' negative onClick={()=>this.props.handleDeleteItem(item)}>X</Button>
                    <label onClick={()=>this.props.handleEditItem(item)}>{item.description||'no description'}</label></div>

                ))}
            </div>
        )
    }
}




export default connect(
    mapState,
    null
  )(firestoreConnect(props => query(props))(MyItems));
  