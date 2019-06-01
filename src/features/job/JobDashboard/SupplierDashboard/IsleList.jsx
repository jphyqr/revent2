import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import {Button, Loader, Dimmer} from 'semantic-ui-react'
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
        materialInIsle : state.firestore.ordered.material_in_isle,
    };
  };

 class IsleList extends Component {

    render() {
        const {materialInIsle, supplierProfile, createItemLoader, clickedItemId, requesting , isleListLoader} = this.props || []
        const {isSupplier} = supplierProfile || false



        return (

            <div style={{  width:"100%", margin:5, height:400, overflowX:"hidden", overflowY:"auto"}}>
            {(!isLoaded(materialInIsle)) ?  <Dimmer active>
        <Loader content='Loading' />
      </Dimmer> : 
<div>
                {materialInIsle&&materialInIsle.map(material=>(

                    <div style={{width:"100%", backgroundColor:"lightgrey",  marginBottom:"5"}}>
                    <Button positive size='mini' loading={createItemLoader&&(clickedItemId===material.fieldId)} onClick={isSupplier?()=>this.props.handleCreateItem(material.fieldId): () => this.props.openModal("SupplierProfileModal")}>New Item</Button>
                    {material.name}</div>

                ))}
                </div>
                }
            </div>
        )
    }
}




export default connect(
    mapState,
    null
  )(firestoreConnect(props => query(props))(IsleList));
  