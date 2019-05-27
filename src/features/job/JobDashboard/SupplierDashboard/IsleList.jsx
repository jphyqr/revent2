import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import {Button} from 'semantic-ui-react'
const query = ({ selectedIsle }) => {
    return [
        {
            collection: "material_in_isle",
            where: [["isleId", "==", `${selectedIsle}`]],
            orderBy: ["name", "asc"],
            storeAs: "material_in_isle",
            
          }
    ];
  };


  const mapState = state => {
    const tasksInCategory = state.firestore.ordered.tasksInCategory
     
    return {
        materialInIsle : state.firestore.ordered.material_in_isle
    };
  };

 class IsleList extends Component {
    render() {
        const {materialInIsle} = this.props || []
        return (
            <div style={{ backgroundColor:"yellow", width:"100%", height:100, overflowX:"hidden", overflowY:"auto"}}>
                {materialInIsle&&materialInIsle.map(material=>(

                    <div style={{width:"100%", backgroundColor:"green", color:"white"}}>
                    <Button onClick={()=>this.props.handleCreateItem(material.fieldId)}>+</Button>
                    {material.name}</div>

                ))}
            </div>
        )
    }
}




export default connect(
    mapState,
    null
  )(firestoreConnect(props => query(props))(IsleList));
  